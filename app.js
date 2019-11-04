import express from 'express';
import apiVersion1 from './router/apiVersion1';
import { urlencoded,json } from 'body-parser';
const app = express();

app.use(urlencoded({
    extended: true
}));
app.use(json());
app.use('/api/v1', apiVersion1);

export default app;