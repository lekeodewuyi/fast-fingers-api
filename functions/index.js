const functions = require('firebase-functions');

const express = require('express');
const app = express();

const cors = require ('cors');
app.use(cors());


const { signup, login } = require('./handlers/users');
const { postChat } = require('./handlers/chat');


app.post('/', (req, res) => {
    return res.send("Hello World");
})

app.post('/signup', signup);
app.post('/login', login);

app.post('/postchat', postChat);

exports.api = functions.https.onRequest(app);
