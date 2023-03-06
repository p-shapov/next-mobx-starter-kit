import { Axios } from 'axios';

import { axiosConfig } from './config';

const api = new Axios(axiosConfig);

export { api };
