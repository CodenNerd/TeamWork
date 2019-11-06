import express from 'express';
import apiVersion1 from './router/apiVersion1';
import { urlencoded,json } from 'body-parser';
import fileUpload from 'express-fileupload';

const app = express();


app.use(urlencoded({
    limit: '50mb',
    extended: true
}));
// app.use(json({limit: '50mb'}));
app.use(fileUpload({
    useTempFiles: true,
   // limits: { fileSize: 50 * 1024 * 1024 }
}))
app.use('/api/v1', apiVersion1);

export default app;