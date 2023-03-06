import { type FC } from 'react';

import { Button } from 'lib/components';

const WhitelistButton: FC = () => {
  const handleClickWhitelistButton = () => {
    // eslint-disable-next-line no-console
    console.log('whitelist button click');
  };

  return <Button text="Get whitelisted" onClick={handleClickWhitelistButton} uppercase />;
};

export { WhitelistButton };
