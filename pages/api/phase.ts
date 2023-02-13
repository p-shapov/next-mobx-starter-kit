import { NextApiRequest, NextApiResponse } from 'next';

import { sleep } from 'lib/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      const rand = Math.floor(Math.random() * 3);

      await sleep(1000);

      const phase = ['Soon', 'Started', 'Finished'][rand];

      res.status(200).send(phase);

      break;
    }
    default: {
      res.setHeader('Allow', ['GET']);

      res.status(405).send(`Method ${req.method} Not Allowed`);
    }
  }
}
