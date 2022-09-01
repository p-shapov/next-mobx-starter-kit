import type { AppProps } from 'next/app';
import 'the-new-css-reset';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
