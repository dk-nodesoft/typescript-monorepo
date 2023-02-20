import axios from 'axios';
import bodyParser from 'body-parser';
import express from 'express';
import type { Event } from 'mnjsreact-types';

const app = express();
app.use(bodyParser.json());

const events: Event[] = [];

app.post('/events', (req, res) => {
  const event: Event = req.body;

  events.push(event);

  axios.post('http://localhost:4000/events', event).catch((err) => {
    console.log(err.message);
  });
  axios.post('http://localhost:4001/events', event).catch((err) => {
    console.log(err.message);
  });
  axios.post('http://localhost:4002/events', event).catch((err) => {
    console.log(err.message);
  });
  axios.post('http://localhost:4003/events', event).catch((err) => {
    console.log(err.message);
  });

  res.send({ status: 'ok' });
});

app.get('/events', (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log('Eventbus Listening on localhost:4005');
});
