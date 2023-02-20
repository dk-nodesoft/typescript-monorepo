import { createId } from '@paralleldrive/cuid2';
import axios from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';
import type { Request, Response } from 'express';
import express from 'express';
import type { Comment, CommentsByPostId } from 'mnjsreact-types';
import { CommentStatus } from 'mnjsreact-types';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId: CommentsByPostId = {};

app.get('/posts/:id/comments', (req: Request, res: Response) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req: Request, res: Response) => {
  const commentId = createId();
  const { content } = req.body;
  const postId = req.params.id;

  const comments = commentsByPostId[postId] || [];
  comments.push({ id: commentId, content, status: CommentStatus.Pending });
  commentsByPostId[postId] = comments;

  await axios.post('http://localhost:4005/events', {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      postId
    }
  });

  res.status(201).send(comments);
});

app.post('/events', async (req: Request, res: Response) => {
  console.log('Received Event', req.body.type);

  const { type, data } = req.body;

  if (type === 'CommentModerated') {
    const { postId, id, status, content } = data;
    const comments = commentsByPostId[postId];

    const comment = comments.find((comment: Comment) => {
      return comment.id === id;
    });

    if (comment) {
      comment.status = status || CommentStatus.Pending;

      await axios.post('http://localhost:4005/events', {
        type: 'CommentUpdated',
        data: {
          id,
          status,
          postId,
          content
        }
      });
    }
  }
  res.send({});
});

app.listen(4001, () => {
  console.log('Comments -> Listening on localhost:4001');
});
