import type { AppProps } from 'next/app';
import { ReactElement } from 'react';

import 'the-new-css-reset';
import 'shared/styles/global.scss';

import { DisableWindowScrollProvider } from 'shared/hooks/useDisableWindowScroll';
import { DetectDeviceProvider } from 'shared/hooks/useDetectDevice';

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
