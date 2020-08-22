const functions = require('firebase-functions');

const express = require('express');
const app = express();

const cors = require ('cors');
app.use(cors());


const { signup } = require('./handlers/users')


app.post('/', (req, res) => {
    return res.send("Hello World");
})

app.post('/signup', signup)

exports.api = functions.https.onRequest(app);
