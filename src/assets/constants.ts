import type { Address } from '@wagmi/core';

export const Env = {
  API_URL: process.env.NEXT_PUBLIC_API_URL as string,
  ALCHEMY_API_KEY: process.env.NEXT_ALCHEMY_API_KEY as string,
  BIMKON_EYES_ADDRESS: process.env.NEXT_BIMKON_EYES_ADDRESS as string,
  IS_TESTNET: process.env.NEXT_IS_TESTNET !== 'false',
};

export const ADDRESS_PLACEHOLDER: Address = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
