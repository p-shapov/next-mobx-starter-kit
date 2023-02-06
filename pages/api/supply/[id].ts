import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
  } = req;

  const isBadRequest = typeof id !== 'string' || !(id === 'Soon' || id === 'Started' || id === 'Finished');

  if (isBadRequest) {
    res.status(400).send('Bad Request');

    return;
  }

  switch (req.method) {
    case 'GET': {
      switch (id) {
        case 'Soon': {
          res.status(200).send(2000);

          break;
        }

        case 'Started': {
          res.status(200).send(1500);

          break;
        }

        case 'Finished': {
          res.status(200).send(1000);
        }
      }

      break;
    }
    default: {
      res.setHeader('Allow', ['GET']);

      res.status(405).send(`Method ${req.method} Not Allowed`);
    }
  }
}
