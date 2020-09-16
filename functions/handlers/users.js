const { db, firebase } = require('../utilities/admin');
const crypto = require('crypto');

const { validateSignupData, validateLoginData } = require('../utilities/validators');


exports.signup = (req, res) => {
    const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
    }

    const { valid, errors} = validateSignupData(newUser);

    const buf = Buffer.alloc(20);
    crypto.randomFillSync(buf).toString('hex')
    crypto.randomFillSync(buf, 5, 5);
    const identifier = buf.toString('hex');

    if (!valid) {
        let name = errors.name;
        let email = errors.email;
        let password = errors.password;
        let confirmPassword = errors.confirmPassword;
        return res.status(400).json({name, email, password, confirmPassword});
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
                preference: null,
                stats: false,
                score: 0,
                cpm: 0,
                wpm: 0,
                accuracy: 0,
                identifier,
                createdAt: new Date().toISOString()
            }
            return db.doc(`users/${newUser.email}`).set(userCredentials);
        })
        .then(() => {
            userCredentials = {
                name: newUser.name,
                email: newUser.email,
                preference: null,
                stats: false,
                score: 0,
                cpm: 0,
                wpm: 0,
                accuracy: 0,
                identifier,
                createdAt: new Date().toISOString()
            }
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


exports.login = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    }

    const { valid, errors } = validateLoginData(user);

    if (!valid) {
        let password = errors.password;
        let email = errors.email;
        return res.status(400).json({email, password});
    }


    let loginResponse = {};
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
        return data.user.getIdToken();
    })
    .then((idToken) => {
        loginResponse.token = idToken;
        return db.doc(`users/${user.email}`).get();
    })
    .then((doc) => {
        loginResponse.userData = doc.data();
        return res.json({loginResponse})
    })
    .catch((error) => {
        if (error.code === 'auth/wrong-password') {
            return res.status(403).json({ password: 'Wrong password, please try again' });
        } else if (error.code === 'auth/user-not-found') {
            return res.status(403).json({ email: 'This email is not registered as a user' });
        } else if (error.code === 'auth/invalid-email') {
            return res.status(403).json({ email: 'Please enter a valid email' });
        } else if (error.code === 'auth/too-many-requests') {
            return res.status(403).json({ email: 'Too many invalid requests, please try again later' });
        }else {
            console.log(error)
            return res.status(500).json({ general: "Something went wrong, please try again" })
        }
    })
}


exports.getUser = (req, res) => {
    const email = req.params.email;

    db.doc(`/users/${email}`).get()
        .then((data) => {
            console.log(data.data());
            return res.json({data});
        })
        .catch((error) => {
            console.log(error)
        })
}