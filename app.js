import express from 'express';
import api from './router/apiVersion1';
import { json } from 'body-parser';
const app = express();


app.use(json());
app.use('/api/v1', api);

export default app;