import { AxiosRequestConfig } from 'axios';

import { Env } from 'shared/constants';

export const axiosConfig: AxiosRequestConfig = {
  baseURL: Env.API_URL,
};
