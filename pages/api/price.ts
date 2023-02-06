import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
