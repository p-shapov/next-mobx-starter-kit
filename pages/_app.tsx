import 'reflect-metadata';
import 'the-new-css-reset';
import 'assets/styles/global.scss';

import type { AppProps } from 'next/app';
import { ReactElement } from 'react';

import { NextPageWithLayout } from 'lib/types/common';
import { MountedProvider } from 'lib/hocs/clientOnly';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page: ReactElement) => page);

  return <MountedProvider>{getLayout(<Component {...pageProps} />, pageProps)}</MountedProvider>;
}

export default MyApp;
