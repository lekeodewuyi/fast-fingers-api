const functions = require('firebase-functions');

const express = require('express');
const app = express();
const cors = require ('cors');
// app.use(cors());

const { auth, basicAuth } = require('./utilities/auth')
const { signup, login, getUser } = require('./handlers/users');
const { generateText, updatePreference, updateStats, retrieveLeaderBoard } = require('./handlers/data');
const { postChat, getChats } = require('./handlers/chat');

const whitelist = ['https://fast-fingers-dev.netlify.app', 'https://ffingers.lekeodewuyi.com']
const corsOption = {
    origin: whitelist,
    optionsSuccessStatus: 200
}

app.all('/*', function(req, res, next) {
    for (let i = 0; i < whitelist.length; i++) {
      if (req.headers.referer.indexOf(whitelist[i]) > -1) {
        console.log(whitelist[i]);
        return next()
      }
    }
    console.log("no")
    return res.status(400).json({error: 'Invalid Request'})
  });
app.use(cors(corsOption));



app.post('/', (req, res) => {
    return res.send("Hello World");
})

app.post('/signup', signup);
app.post('/login', login);
app.get('/getuser/:email', getUser);

app.post('/postchat', auth, postChat);
app.post('/getchats', auth, getChats);

app.post('/generatetext', basicAuth, generateText);
app.post('/setpreference', auth, updatePreference);
app.post('/stats/user/update', auth, updateStats);
app.post('/leaderboard/retrieve', retrieveLeaderBoard)



exports.api = functions.https.onRequest(app);
