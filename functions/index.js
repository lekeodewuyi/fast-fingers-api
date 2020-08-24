const functions = require('firebase-functions');

const express = require('express');
const app = express();

const cors = require ('cors');
app.use(cors());

const { auth } = require('./utilities/auth')
const { signup, login, getUser } = require('./handlers/users');
const { getTitles, generateText } = require('./handlers/data');
const { postChat, getChats } = require('./handlers/chat');


app.post('/', (req, res) => {
    return res.send("Hello World");
})

app.post('/signup', signup);
app.post('/login', login);
app.get('/getuser/:email', getUser);

app.post('/postchat', auth, postChat);
app.post('/getchats', auth, getChats);

app.get('/titles', getTitles);
app.post('/generate/:type', generateText);

exports.api = functions.https.onRequest(app);
