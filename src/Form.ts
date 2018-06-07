import {AxiosError, AxiosPromise, AxiosRequestConfig, AxiosResponse} from 'axios';
import axios from './helpers/axios';
import {FormMethods} from './helpers/form-methods';
import Errors from './Errors';
import FormInterface, {RequestPayload} from '../index';

export default class Form implements FormInterface {
  readonly originalData: object;
  isPending: boolean = false;
  errors = new Errors();

  /**
   * Form constructor
   *
   * @param {object} data
   */
  public constructor(data: object = {}) {
    this.originalData = Object.assign({}, data);

    for (let field in data) {
      this[field] =
        typeof data[field] === 'object'
          ? Object.assign({}, data[field])
          : data[field];
    }
  }

  /**
   * Get form payload
   *
   * @returns {object}
   */
  get payload(): object {
    let payload: object = {};

    for (let field in this.originalData) {
      payload[field] = this[field];
    }

    return payload;
  }

  /**
   *
   * @param {string} url
   * @param {AxiosRequestConfig} config
   *
   * @returns {Promise<any>}
   */
  public get(url: string, config?: AxiosRequestConfig): Promise<any> {
    return this.submit(FormMethods.GET, url, config);
  }

  /**
   *
   * @param {string} url
   * @param {AxiosRequestConfig} config
   *
   * @returns {Promise<any>}
   */
  public post(url: string, config?: AxiosRequestConfig): Promise<any> {
    return this.submit(FormMethods.POST, url, config);
  }

  /**
   *
   * @param {string} url
   * @param {AxiosRequestConfig} config
   *
   * @returns {Promise<any>}
   */
  public put(url: string, config?: AxiosRequestConfig): Promise<any> {
    return this.submit(FormMethods.PUT, url, config);
  }

  /**
   *
   * @param {string} url
   * @param {AxiosRequestConfig} config
   *
   * @returns {Promise<any>}
   */
  public patch(url: string, config?: AxiosRequestConfig): Promise<any> {
    return this.submit(FormMethods.PATCH, url, config);
  }

  /**
   *
   * @param {string} url
   * @param {AxiosRequestConfig} config
   *
   * @returns {Promise<any>}
   */
  public delete(url: string, config?: AxiosRequestConfig): Promise<any> {
    return this.submit(FormMethods.DELETE, url, config);
  }

  /**
   * Submit the form.
   *
   * @param {FormMethods} method
   * @param {string} url
   * @param {AxiosRequestConfig} config
   *
   * @returns {AxiosPromise<any>}
   */
  public submit(
    method: FormMethods,
    url: string,
    config: AxiosRequestConfig = {}
  ): AxiosPromise<any> {
    this.isPending = true;
    this.errors.clear();

    let data = this.formData();
    if (data instanceof FormData) {
      data.append('_method', method);
      method = FormMethods.POST;
    }

    const requestConfig: AxiosRequestConfig = Object.assign(
      {url, method, data},
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
    for (let field in this.originalData) {
      this[field] = this.originalData[field];
    }

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
