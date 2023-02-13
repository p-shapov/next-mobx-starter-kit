import 'reflect-metadata';
import 'the-new-css-reset';

import type { AppProps } from 'next/app';
import { ReactElement } from 'react';

import 'lib/styles/global.scss';
import { DisableWindowScrollProvider, DetectDeviceProvider } from 'lib/hooks';

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
