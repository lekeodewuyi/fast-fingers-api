const functions = require('firebase-functions');

const express = require('express');
const app = express();

const cors = require ('cors');
app.use(cors());

const { auth } = require('./utilities/auth')
const { signup, login } = require('./handlers/users');
const { postChat, getChats } = require('./handlers/chat');


app.post('/', (req, res) => {
    return res.send("Hello World");
})

app.post('/signup', signup);
app.post('/login', login);

app.post('/postchat', auth, postChat);
app.post('/getchats', auth, getChats);

exports.api = functions.https.onRequest(app);
