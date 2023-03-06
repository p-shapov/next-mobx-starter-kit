import type { NextPageWithLayout } from 'lib/types/common';

import { BaseLayout } from 'layout/BaseLayout';

export const Home: NextPageWithLayout = () => {
  return null;
};

Home.getLayout = (page) => <BaseLayout>{page}</BaseLayout>;
