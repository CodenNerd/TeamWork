const express = require('express');
const api = require('./router')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

mongoose.connect(`mongodb+srv://AbdulAzeez:transitnexus0987654321@cluster0-qi2mt.mongodb.net/test?retryWrites=true&w=majority`, {
    useNewUrlParser: true
}).then(()=>{
    console.log('db connection successful...');
}).catch((error)=>{
    console.error(error);
})
app.use(bodyParser.json());
app.use('/api', api);

module.exports = app;