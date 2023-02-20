import axios from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';
import type { Request, Response } from 'express';
import express from 'express';
import type { Event, QueryPosts } from 'mnjsreact-types';
import { EventType } from 'mnjsreact-types';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts: QueryPosts = {};

const handleEvent = ({ type, data }: Event): void => {
  if (type === EventType.PostCreated) {
    const { id, title } = data;

    posts[id] = {
      id,
      title,
      comments: []
    };
  }

  if (type === EventType.CommentCreated) {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type === EventType.CommentUpdated) {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    const comment = post.comments.find((comment) => {
      return comment.id === id;
    });

    if (comment) {
      comment.status = status;
      comment.content = content;
    }
  }
};

app.get('/posts', (_req: Request, res: Response): void => {
  res.send(posts);
});

app.post('/events', (req: Request, res: Response): void => {
  const { type, data }: Event = req.body;

  handleEvent({ type, data });

  res.send({});
});

app.listen(4002, async () => {
  console.log('Posts -> Listening on localhost:4002');

  // Get all events from event-bus
  try {
    const res = await axios.get('http://localhost:4005/events');

    for (const event of res.data) {
      console.log('Processing event:', event.type);

      handleEvent(event);
    }
  } catch (err: any) {
    console.log(err.message);
  }
});
