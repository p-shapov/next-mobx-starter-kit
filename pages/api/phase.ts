import { NextApiRequest, NextApiResponse } from 'next';

import { sleep } from 'shared/utils/sleep';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      const rand = Math.floor(Math.random() * 3);

      const phase = ['Soon', 'Started', 'Finished'][rand];

      await sleep(500);

      res.status(200).send(phase);

      break;
    }
    default: {
      res.setHeader('Allow', ['GET']);

      res.status(405).send(`Method ${req.method} Not Allowed`);
    }
  }
}
