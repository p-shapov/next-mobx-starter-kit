import { GetServerSideProps } from 'next';

import type { Props } from 'module/Home';

import { api } from 'service/API/core';

export { Home as default } from 'module/Home';

export const getServerSideProps: GetServerSideProps<Props, { id: 'Soon' | 'Started' | 'Finished' }> = async (
  req,
) => {
  const phase = req.params?.id;

  if (!phase)
    return {
      notFound: true,
    };

  const price = (await api.get<number>('/price/')).data;
  const supply = (await api.get<number>(`/supply/${phase}/`)).data;

  return {
    props: {
      price,
      phase,
      supply,
    },
  };
};
