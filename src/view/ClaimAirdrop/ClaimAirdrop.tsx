import { observer } from 'mobx-react-lite';
import { type FC } from 'react';

import type { FetchData, SalePhase } from 'lib/types/common';

type ClaimAirdropProps = {
  phase: FetchData<SalePhase>;
  allowedToMint: FetchData<number | undefined>;
  whitelisted?: FetchData<boolean | undefined>;
};

const ClaimAirdrop: FC<ClaimAirdropProps> = observer(({ phase, allowedToMint, whitelisted }) => {
  return (
    <div>
      <div>
        {phase.status}
        {phase.value}
      </div>

      <div>
        {allowedToMint.status}
        {allowedToMint.value}
      </div>

      <div>{whitelisted?.value ? 'whitelisted' : 'not whitelisted'}</div>
    </div>
  );
});

export { ClaimAirdrop };
