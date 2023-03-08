import { type FC } from 'react';
import { observer } from 'mobx-react-lite';

import { Button } from 'lib/components';

const WhitelistButton: FC = observer(() => {
  const handleClickWhitelistButton = () => {
    // eslint-disable-next-line no-console
    console.log('whitelist button click');
  };

  return <Button text="Get whitelisted" onClick={handleClickWhitelistButton} uppercase />;
});

export { WhitelistButton };
