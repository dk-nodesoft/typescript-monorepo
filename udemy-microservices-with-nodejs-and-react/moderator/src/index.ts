import axios from 'axios';
import bodyParser from 'body-parser';
import type { Request, Response } from 'express';
import express from 'express';

import { CommentStatus } from 'mnjsreact-types';

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req: Request, res: Response): Promise<void> => {
  console.log('Received Event', req.body.type);

  const { type, data } = req.body;

  if (type === 'CommentCreated') {
    const status: CommentStatus = data.content.includes('orange') ? CommentStatus.Rejected : CommentStatus.Approved;

    await axios.post('http://localhost:4005/events', {
      type: 'CommentModerated',
      data: {
        id: data.id,
        postId: data.postId,
        status,
        content: data.content
      }
    });
  }

  res.send({});
});

app.listen(4003, () => {
  console.log('Moderator -> Listening on localhost:4003');
});
