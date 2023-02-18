import { createId } from '@paralleldrive/cuid2';
import axios from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';
import type { Request, Response } from 'express';
import express from 'express';

export type Post = {
  id: string;
  title: string;
};

export type Posts = {
  [key: string]: Post;
};

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts: Posts = {};

app.get('/posts', (_req: Request, res: Response): void => {
  res.send(posts);
});

app.post('/posts', async (req: Request, res: Response): Promise<void> => {
  const id = createId();

  const { title } = req.body;
  posts[id] = {
    id,
    title
  };

  await axios.post('http://localhost:4005/events', {
    type: 'PostCreated',
    data: {
      id,
      title
    }
  });

  res.status(201).send(posts[id]);
});

app.listen(4000, () => {
  console.log('Posts -> Listening on localhost:4000');
});
