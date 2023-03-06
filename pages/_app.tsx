import 'reflect-metadata';
import 'the-new-css-reset';
import 'assets/styles/global.scss';

import type { AppProps } from 'next/app';
import { ReactElement } from 'react';

import { DisableWindowScrollProvider, DetectDeviceProvider } from 'lib/hooks';
import { NextPageWithLayout } from 'lib/types/common';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page: ReactElement) => page);

  return (
    <DetectDeviceProvider uaString={pageProps.uaString}>
      <DisableWindowScrollProvider>
        {getLayout(<Component {...pageProps} />, pageProps)}
      </DisableWindowScrollProvider>
    </DetectDeviceProvider>
  );
}

export default MyApp;
