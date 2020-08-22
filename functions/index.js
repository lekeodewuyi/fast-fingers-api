const functions = require('firebase-functions');

const express = require('express');
const app = express();

const cors = require ('cors');
app.use(cors());


const { signup, login } = require('./handlers/users')


app.post('/', (req, res) => {
    return res.send("Hello World");
})

app.post('/signup', signup);
app.post('/login', login);

exports.api = functions.https.onRequest(app);
