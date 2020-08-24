const { admin } = require('./admin');
const { db } = require('./admin');


exports.auth = (req, res, next) => {
    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
        console.error('No token found')
        return res.status(403).json({ error: 'Unauthorized' });
    }

    admin.auth().verifyIdToken(idToken)
        .then(decodedToken => {
            req.user = decodedToken;
            return db.collection('users')
                .where('email', '==', req.user.email)
                .limit(1)
                .get();
        })
        .then(data => {
            email = data.docs[0].data().email;
            name = data.docs[0].data().name;
            return next();
        })
        .catch(err => {
            if (err.code === 'auth/argument-error') {
                return res.status(401).json({ token: 'This is an unauthorized token, please use a valid token' })
            } else {
                console.error('Error while verifying token ', err);
                return res.status(403).json(err);
            }
        })

}


exports.basicAuth = (req, res, next) => {
    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        idToken = req.headers.authorization.split('Bearer ')[1];

        admin.auth().verifyIdToken(idToken)
        .then(decodedToken => {
            req.user = decodedToken;
            return db.collection('users')
                .where('email', '==', req.user.email)
                .limit(1)
                .get();
        })
        .then(data => {
            email = data.docs[0].data().email;
            name = data.docs[0].data().name;
            return next();
        })
        .catch(err => {
            if (err.code === 'auth/argument-error') {
                return res.status(401).json({ token: 'This is an unauthorized token, please use a valid token' })
            } else {
                console.error('Error while verifying token ', err);
                return res.status(403).json(err);
            }
        })
    } else {
        name = null;
        email = null;
        console.error('No token found')
        return next();
        }
}