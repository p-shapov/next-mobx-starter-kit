import { GetServerSideProps } from 'next';

import type { Props } from 'module/Home';

import { api } from 'service/API/core';

export { Home as default } from 'module/Home';

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const price = (await api.get<number>('/phase/')).data;
  const phase = (await api.get<'Soon' | 'Started' | 'Finished'>('/phase/')).data;
  const supply = (await api.get<number>(`/supply/${phase}/`)).data;

  return {
    props: {
      price,
      phase,
      supply,
    },
  };
};
