import { NextApiRequest, NextApiResponse } from 'next';

import { sleep } from 'lib/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await sleep(2000);

  switch (req.method) {
    case 'GET': {
      res.status(200).send(1000);

      break;
    }
    default: {
      res.setHeader('Allow', ['GET']);

      res.status(405).send(`Method ${req.method} Not Allowed`);
    }
  }
}
