import express from 'express';
import bodyParser from 'body-parser';
import {Express} from "express-serve-static-core";

const app: Express = express();

app.use(bodyParser.json());

app.get('/get', (request, response) => {
  response.json({data: request.body})
});

app.post('/post', (request, response) => {
  response.json({data: request.body});
});

app.put('/put', (request, response) => {
  response.json({data: request.body})
});

app.patch('/patch', (request, response) => {
  response.json({data: request.body})
});

app.delete('/delete', (request, response) => {
  response.json({data: request.body})
});

app.post('/error', (request, response) => {
  response.status(422).json({
    errors: {
      field: ['Error message']
    }
  })
});

export default app;
