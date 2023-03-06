import { AxiosRequestConfig } from 'axios';

import { Env } from 'assets/constants';

const axiosConfig: AxiosRequestConfig = {
  baseURL: Env.API_URL,
};

export { axiosConfig };
