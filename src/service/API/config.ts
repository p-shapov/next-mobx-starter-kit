import { AxiosRequestConfig } from 'axios';

import { Env } from 'assets/constants';

export const axiosConfig: AxiosRequestConfig = {
  baseURL: Env.API_URL,
};
