import 'reflect-metadata';
import 'the-new-css-reset';
import 'assets/styles/global.scss';

import type { AppProps } from 'next/app';
import { ReactElement } from 'react';

import { NextPageWithLayout } from 'lib/types/common';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page: ReactElement) => page);

  return getLayout(<Component {...pageProps} />, pageProps);
}

export default MyApp;
