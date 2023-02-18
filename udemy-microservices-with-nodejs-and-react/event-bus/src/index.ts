import axios from 'axios';
import bodyParser from 'body-parser';
import express from 'express';

const app = express();
app.use(bodyParser.json());

app.post('/events', (req, res) => {
  const event = req.body;

  console.log('Received Event', event.type);

  axios.post('http://localhost:4000/events', event).catch((err) => {
    console.log(err.message);
  });
  axios.post('http://localhost:4001/events', event).catch((err) => {
    console.log(err.message);
  });
  axios.post('http://localhost:4002/events', event).catch((err) => {
    console.log(err.message);
  });

  res.send({ status: 'ok' });
});

app.listen(4005, () => {
  console.log('Eventbus Listening on localhost:4005');
});