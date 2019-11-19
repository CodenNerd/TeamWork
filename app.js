import express from 'express';
import { urlencoded, json } from 'body-parser';
import fileUpload from 'express-fileupload';
import apiVersion1 from './router/apiVersion1';

const app = express();


app.use(urlencoded({
  limit: '50mb',
  extended: true,
}));
app.use(json({ limit: '50mb' }));
app.use(fileUpload({
  useTempFiles: true,
}));


app.use('/api/v1', apiVersion1);
app.use((req, res) => {
  res.status(404).send({
    status: 'error',
    message: 'page not found',
  });
});

export default app;
