import bodyParser from 'body-parser';
import cors from 'cors';
import type { Request, Response } from 'express';
import express from 'express';
import type { Comment } from 'mnjsreact-comments';
import type { Post } from 'mnjsreact-posts';

const app = express();
app.use(bodyParser.json());
app.use(cors());

export type Posts = {
  [key: string]: Post & { comments: Comment[] };
};

const posts: Posts = {};

app.get('/posts', (_req: Request, res: Response): void => {
  res.send(posts);
});

app.post('/events', (req: Request, res: Response): void => {
  const { type, data } = req.body;

  if (type === 'PostCreated') {
    const { id, title } = data;

    posts[id] = {
      id,
      title,
      comments: []
    };
  }

  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  console.log(JSON.stringify(posts));

  res.send({});
});

app.listen(4002, () => {
  console.log('Posts -> Listening on localhost:4002');
});
