import {AxiosError, AxiosPromise, AxiosRequestConfig, AxiosResponse} from "axios";
import {HttpMethod} from "./src/helpers/http_method";
import {RequestPayload} from "./src/helpers/types";

export class Errors<T extends object> {
  public errors: T;

  public constructor(errors: T = <T>{});

  public record(errors: T = <T>{}): void;

  public has(field: string): boolean;

  public any(): boolean;

  public get(field: string): string[] | string | undefined;

  public getFirst(field: string): string | undefined;

  public clear(field?: string): void;
}

export default class Form<T extends object> {
  readonly originalData: T;
  public payload: T;
  public isPending: boolean;
  public errors: Errors;

  constructor(data: T);

  public get(url: string, config?: AxiosRequestConfig): AxiosPromise<any>;

  public post(url: string, config?: AxiosRequestConfig): AxiosPromise<any>;

  public patch(url: string, config?: AxiosRequestConfig): AxiosPromise<any>;

  public put(url: string, config?: AxiosRequestConfig): AxiosPromise<any>;

  public delete(url: string, config?: AxiosRequestConfig): AxiosPromise<any>;

  public submit(
    method: HttpMethod,
    url: string,
    config: AxiosRequestConfig = {}
  ): AxiosPromise<any>;

  public reset(): void;

  public formData(): RequestPayload;

  public propertyExists(propertyName: PropertyKey): boolean;

  protected onSuccess(response: AxiosResponse): void;

  protected onFail({response: {data = {}}}: AxiosError): void;

  private hasFiles(): boolean;
}
