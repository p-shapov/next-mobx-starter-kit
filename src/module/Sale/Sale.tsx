import type { NextPageWithLayout } from 'lib/types/common';

import { BaseLayout } from 'layout/BaseLayout';

const Sale: NextPageWithLayout = () => {
  return null;
};

Sale.getLayout = (page) => <BaseLayout content={page} />;

export { Sale };
