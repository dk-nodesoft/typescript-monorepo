import { createId } from '@paralleldrive/cuid2';
import bodyParser from 'body-parser';
import cors from 'cors';
import type { Request, Response } from 'express';
import express from 'express';

type Comment = {
  id: string;
  content: string;
};

type CommentsByPostId = {
  [key: string]: Comment[];
};
const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId: CommentsByPostId = {};

app.get('/posts/:id/comments', (req: Request, res: Response) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', (req: Request, res: Response) => {
  const commentId = createId();
  const { content } = req.body;
  const postId = req.params.id;

  const comments = commentsByPostId[postId] || [];
  comments.push({ id: commentId, content });
  commentsByPostId[postId] = comments;

  res.status(201).send(comments);
});

app.listen(4001, () => {
  console.log('Comments -> Listening on localhost:4001');
});