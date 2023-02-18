import { createId } from '@paralleldrive/cuid2';
import bodyParser from 'body-parser';
import cors from 'cors';
import type { Request, Response } from 'express';
import express from 'express';

type Post = {
  id: string;
  title: string;
};

type Posts = {
  [key: string]: Post;
};

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts: Posts = {};

app.get('/posts', (_req: Request, res: Response) => {
  res.send(posts);
});

app.post('/posts', (req: Request, res: Response) => {
  const id = createId();

  const { title } = req.body;
  posts[id] = {
    id,
    title
  };

  res.status(201).send(posts[id]);
});

app.listen(4000, () => {
  console.log('Posts -> Listening on localhost:4000');
});
