const { db, admin, firebase } = require('../utilities/admin');

const { config } = require('../utilities/config')

const { validateSignupData, validateLoginData } = require('../utilities/validators');
const { user } = require('firebase-functions/lib/providers/auth');


exports.signup = (req, res) => {
    const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
    }

    const { valid, errors} = validateSignupData(newUser);

    if (!valid) {
        return res.status(400).json({errors});
    }

    let token, userId;
    let userCredentials = {};
    db.doc(`users/${newUser.email}`).get()
        .then((doc) => {
            return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
        })
        .then((data) => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then((idToken) => {
            token = idToken;
                userCredentials = {
                name: newUser.name,
                email: newUser.email,
                userId: userId,
                createdAt: new Date().toISOString()
            }
            return db.doc(`users/${newUser.email}`).set(userCredentials);
        })
        .then(() => {
            return res.json({token, userCredentials});
        })
        .catch((error) => {
            console.error(error);
            if (error.code === 'auth/email-already-in-use') {
                return res.status(400).json({ email: 'This email is already in use' });
            } else if (error.code === 'auth/weak-password') {
                return res.status(400).json({ password: 'Please use a stronger password' });
            } else { 
                return res.status(500).json({ general: "Something went wrong, please try again" });
            }
        })
}