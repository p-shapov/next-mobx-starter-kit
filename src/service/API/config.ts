import { AxiosRequestConfig } from 'axios';

import { Env } from 'lib/constants';

export const axiosConfig: AxiosRequestConfig = {
  baseURL: Env.API_URL,
};
