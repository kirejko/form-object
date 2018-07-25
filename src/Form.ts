import {AxiosError, AxiosPromise, AxiosRequestConfig, AxiosResponse} from 'axios';
import axios from './helpers/axios';
import {HttpMethod} from './helpers/http_method';
import {DataType, RequestPayload} from './helpers/types';
import {RequestDataKey} from './helpers/request_data_key';
import {Errors} from './Errors';
import {cloneDeep} from 'lodash';

export class Form {
  readonly originalData: DataType;
  payload: DataType;
  isPending: boolean = false;
  errors: Errors = new Errors();

  [key: string]: any;

  private proxyHandler: ProxyHandler<Form> = {
    get(target: Form, prop: PropertyKey): any {
      const property = Reflect.get(target, prop);

      if (['originalData', 'payload', 'errors', 'isPending'].includes(<string>prop)) {
        return property;
      }

      if (target.propertyExists(prop)) {
        return Reflect.get(target.payload, prop);
      }

      return 'function' === typeof property
        ? (...args) => Reflect.apply(property, target, args)
        : undefined;
    },
    set(target: Form, prop: PropertyKey, value: any): boolean {
      if (target.propertyExists(prop)) {
        Reflect.set(target.payload, prop, value);
      }

      return true;
    }
  };

  /**
   * Form constructor
   *
   * @param {DataType} data
   */
  constructor(data: DataType) {
    this.originalData = cloneDeep(data);
    this.payload = cloneDeep(data);

    return new Proxy(this, this.proxyHandler);
  }

  /**
   *
   * @param {string} url
   * @param {AxiosRequestConfig} config
   *
   * @returns {AxiosPromise<any>}
   */
  public get(url: string, config?: AxiosRequestConfig): AxiosPromise<any> {
    return this.submit(HttpMethod.GET, url, config);
  }

  /**
   *
   * @param {string} url
   * @param {AxiosRequestConfig} config
   *
   * @returns {AxiosPromise<any>}
   */
  public post(url: string, config?: AxiosRequestConfig): AxiosPromise<any> {
    return this.submit(HttpMethod.POST, url, config);
  }

  /**
   *
   * @param {string} url
   * @param {AxiosRequestConfig} config
   *
   * @returns {AxiosPromise<any>}
   */
  public put(url: string, config?: AxiosRequestConfig): AxiosPromise<any> {
    return this.submit(HttpMethod.PUT, url, config);
  }

  /**
   *
   * @param {string} url
   * @param {AxiosRequestConfig} config
   *
   * @returns {AxiosPromise<any>}
   */
  public patch(url: string, config?: AxiosRequestConfig): AxiosPromise<any> {
    return this.submit(HttpMethod.PATCH, url, config);
  }

  /**
   *
   * @param {string} url
   * @param {AxiosRequestConfig} config
   *
   * @returns {AxiosPromise<any>}
   */
  public delete(url: string, config?: AxiosRequestConfig): AxiosPromise<any> {
    return this.submit(HttpMethod.DELETE, url, config);
  }

  /**
   * Submit the form.
   *
   * @param {HttpMethod} method
   * @param {string} url
   * @param {AxiosRequestConfig} config
   *
   * @returns {AxiosPromise<any>}
   */
  public submit(
    method: HttpMethod,
    url: string,
    config: AxiosRequestConfig = {}
  ): AxiosPromise<any> {
    this.isPending = true;
    this.errors.clear();

    let data: RequestPayload = this.formData();

    if (data instanceof FormData) {
      data.append('_method', method);
      method = HttpMethod.POST;
    }

    let requestConfig: AxiosRequestConfig = {url, method};
    const dataKey: RequestDataKey = method === HttpMethod.GET ? 'params' : 'data';

    requestConfig[dataKey] = data;

    requestConfig = Object.assign(
      requestConfig,
      config,
    );

    return axios
      .request(requestConfig)
      .then((response: AxiosResponse) => {
        this.onSuccess(response);

        return response.data;
      })
      .catch((error: AxiosError) => {
        this.onFail(error);

        return Promise.reject(error);
      })
      .finally(() => this.isPending = false);
  }

  /**
   * Reset the form fields.
   *
   * @returns {void}
   */
  public reset(): void {
    this.payload = cloneDeep(this.originalData);

    this.errors.clear();
  }

  /**
   * @returns {RequestPayload}
   */
  public formData(): RequestPayload {
    if (!this.hasFiles()) {
      return this.payload;
    }

    return this.convertPayloadToFormData();
  }

  /**
   * @param {PropertyKey} propertyName
   * @returns {boolean}
   */
  public propertyExists(propertyName: PropertyKey): boolean {
    return this.originalData.hasOwnProperty(propertyName);
  }

  /**
   * Handle success submit
   *
   * @param {AxiosResponse} response
   * @returns {void}
   */
  protected onSuccess(response: AxiosResponse): void {
    // console.log('SUCCESS');
  }

  /**
   * Handle submit with error
   *
   * @param {AxiosError} error
   * @returns {void}
   */
  protected onFail({response: {data = {}}}: AxiosError): void {
    const errors = data.hasOwnProperty('errors')
      ? data.errors
      : data;

    this.errors.record(errors);
  }

  /**
   * @returns {boolean}
   */
  private hasFiles(data: any = this.payload): boolean {
    if (data instanceof File) return true;

    if (Array.isArray(data)) {
      return data.some(item => this.hasFiles(item));
    }

    try {
      return Reflect.ownKeys(data)
        .reduce((result, key) => result || this.hasFiles(data[key]), false);
    } catch (e) {
    }

    return false;
  }

  /**
   * @returns {FormData}
   */
  private convertPayloadToFormData(): FormData {
    const formData: FormData = new FormData();

    for (let field in this.payload) {
      // @todo: add deep fields name convert
      const name = Array.isArray(this.payload[field]) ? `${field}[]` : field;
      formData.append(name, this.payload[field]);
    }

    return formData;
  }
}
