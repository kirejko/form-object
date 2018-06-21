import {AxiosError, AxiosPromise, AxiosRequestConfig, AxiosResponse} from 'axios';
import axios from './helpers/axios';
import {HttpMethod} from './helpers/http_method';
import {RequestPayload} from './helpers/request_payload';
import {Errors} from './Errors';
import {cloneDeep} from 'lodash';

export class Form {
  readonly originalData: object;
  payload: object;
  isPending: boolean = false;
  errors: Errors = new Errors();

  /**
   * Form constructor
   *
   * @param {object} data
   */
  constructor(data: object) {
    this.originalData = cloneDeep(data);
    this.payload = cloneDeep(data);

    return new Proxy(this, {
      get(target: Form, prop: PropertyKey) {
        if (target.propertyExists(prop)) {
          return target.payload[prop];
        }

        return 'function' === typeof target[prop]
          ? (...args) => target[prop].apply(target, args)
          : undefined;
      },
      set(target: Form, prop: PropertyKey, value: any) {
        if (target.propertyExists(prop)) {
          target.payload[prop] = value;
        }

        return true;
      }
    });
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
    type DataKey = keyof AxiosRequestConfig['params'] | keyof AxiosRequestConfig['data']
    const dataKey: DataKey = method === HttpMethod.GET ? 'params' : 'data';

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

    let formData = new FormData();

    for (let field in this.payload) {
      // @todo: add deep
      const name = Array.isArray(this.payload[field]) ? `${field}[]` : field;
      formData.append(name, this.payload[field]);
    }

    return formData;
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
    console.log('SUCCESS');
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
  private hasFiles(): boolean {
    for (let field in this.payload) {
      if (this.payload[field] instanceof File) {
        return true;
      } else if (Array.isArray(this.payload[field])) {
        // @todo: check deeper
        if (this.payload[field].some(item => item instanceof File)) {
          return true;
        }
      }
    }

    return false;
  }
}
