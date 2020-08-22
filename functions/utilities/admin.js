const { config } = require('./config');

const firebase = require('firebase');
const admin = require('firebase-admin');

firebase.initializeApp(config)
admin.initializeApp();

const db = admin.firestore();

module.exports = { admin, db, firebase };