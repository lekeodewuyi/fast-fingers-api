const functions = require('firebase-functions');

const express = require('express');
const app = express();
const cors = require ('cors');
// app.use(cors());

const { auth, basicAuth } = require('./utilities/auth')
const { signup, login, getUser } = require('./handlers/users');
const { generateText, updatePreference, updateStats, retrieveLeaderBoard } = require('./handlers/data');
const { postChat, getChats } = require('./handlers/chat');

const corsOption = {
    origin: 'https://twtr.lekeodewuyi.com',
    optionsSuccessStatus: 200
}
const referrer_domain = "https://twtr.lekeodewuyi.com"


app.all('/*', function(req, res, next) {
    if(req.headers.referer.indexOf(referrer_domain) == -1){
        console.log("no")
      res.send('Invalid Request')
    }
    next();
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
