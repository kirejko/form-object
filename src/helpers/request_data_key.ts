import {AxiosRequestConfig} from "axios";

export type RequestDataKey = keyof AxiosRequestConfig['params'] | keyof AxiosRequestConfig['data']
