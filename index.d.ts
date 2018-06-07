import {AxiosPromise, AxiosRequestConfig} from 'axios';
import {FormMethods} from './src/helpers/form-methods';

export type RequestPayload = FormData | object

export interface Errors {
  errors: object;

  record(errors: object): void;

  has(filed: string): boolean;

  any(): boolean;

  get(field: string): string[] | string | undefined;

  getFirst(filed: string): string | undefined;

  clear(field?: string): void;
}

export default interface Form {
  readonly originalData: object
  payload: object;
  isPending: boolean;
  errors: Errors;

  submit(
    method: FormMethods,
    url: string,
    config: AxiosRequestConfig
  ): Promise<any>;

  get(url: string, config?: AxiosRequestConfig): AxiosPromise<any>;

  post(url: string, config?: AxiosRequestConfig): AxiosPromise<any>;

  patch(url: string, config?: AxiosRequestConfig): AxiosPromise<any>;

  put(url: string, config?: AxiosRequestConfig): AxiosPromise<any>;

  delete(url: string, config?: AxiosRequestConfig): AxiosPromise<any>;

  formData(): FormData | object;

  reset(): void;
}
