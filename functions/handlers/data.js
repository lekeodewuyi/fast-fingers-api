const { db } = require('../utilities/admin');
const txtgen = require('txtgen');


// exports.getTitles = (req, res) => {
//     // titleId = req.params.titleId

//     response = [];
//     db.doc(`data/new`).get()
//         .then((doc) => {
//             response = doc.data();

//             return res.json({response})
//         })
    
        
// }


exports.generateText = (req, res) => {
    console.log(name);
    console.log(email);

    // const sentence = txtgen.sentence();
    // const paragraph = txtgen.paragraph();
    // const article = txtgen.article();

    let type;
    db.collection('users').where("email", "==", email).get()
        .then((data) => {
            let userData = [];
            data.forEach((doc) => {
                userData.push(doc.data());
            })
            if (!Array.isArray(userData) || !userData.length) {
                console.log("no such user")
                result = txtgen.paragraph();
                return res.json({result});
            } else {
                console.log(userData[0].email)
                type = userData[0].preference;
                console.log(type);

                if (type == null || type == undefined || typeof type == undefined) {
                    console.log("User has no preference")
                    result = txtgen.paragraph();
                    return res.json({result});
                } else {
                    if (type === "sentence") {
                        result = txtgen.paragraph();
                    } else if (type === "paragraph") {
                        let part1 = txtgen.paragraph();
                        let part2 = txtgen.sentence();
                        let part3 = txtgen.paragraph();
                        result = `${part1} ${part2}`
                        // result = txtgen.paragraph();
                    } else {
                        result = type;
                    }
                    console.log(type);
                    console.log(result)
                    return res.json({result});
                }
            }
        })
        .catch((error) => {
        console.error(error);
        console.error(error);
        return res.status(500).json({error: "Something went wrong"});
    })
        

}


exports.updatePreference = (req, res) => {

    //email and userData from auth
    const userEmail = email;
    const preference = req.body.preference;

    db.doc(`/users/${userEmail}`).update({preference: preference})
        .then(() => {
            return db.collection('users').where("email" ,"=", email).get();
            // return res.json({userData, preference})
        })
        .then((data) => {
            let userData = [];
            data.forEach((doc) => {
                userData.push(doc.data());
            })
            return res.json({userData, preference})
        })
        .catch((error) => {
            console.error(error);
            console.error(error);
            return res.status(500).json({error: "Something went wrong"});
        })
}


exports.updateStats = (req, res) => {
    const stats = {
        score: req.body.score,
        cpm: req.body.cpm,
        wpm: req.body.wpm,
        accuracy: req.body.accuracy
    }

    let oldDoc;
    let score, cpm, wpm, accuracy;
    db.doc(`/users/${email}`).get()
        .then((doc) => {
            oldDoc = doc.data();
            score = doc.data().score;
            cpm = doc.data().cpm;
            wpm = doc.data().wpm;
            accuracy = doc.data().accuracy;
            return docRef = db.doc(`/users/${email}`);
        })
        .then( async () => {
            await docRef.update({stats: true})
            await docRef.update({score: Number(stats.score + score)})
            // if (stats.score > score) {
            //     await docRef.update({score: stats.score})
            // }
            if (stats.cpm > cpm) {
                await docRef.update({cpm: stats.cpm})
            }
            if (stats.wpm > wpm) {
                await docRef.update({wpm: stats.wpm})
            }
            if (stats.accuracy > accuracy) {
                await docRef.update({accuracy: stats.accuracy})
            }
            return db.doc(`/users/${email}`).get();
        })
        .then((doc) => {
            if (doc.data().score !== score || doc.data().wpm !== wpm || doc.data().cpm !== cpm || doc.data().accuracy !== accuracy) {
                return res.json({message: "new stats data applied"});
            } else {
                return res.json({message: "The new stats are not higher than the existing stats"});
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({error: "Something went wrong"})
        })
}


// score = doc.data().score;
// if (stats.score > score) {
//     return db.doc(`/users/${email}`)
//     .update({
//         stats: true,
//         score: stats.score,
//         cpm: stats.cpm,
//         wpm: stats.wpm,
//         accuracy: stats.accuracy,
//     })
// } else {
//     return res.json({message: "This new score is not higher than the existing score"});
// }

exports.retrieveLeaderBoard = (req, res) => {
    db.collection("users").where("stats", "==", true).orderBy("score", "desc").limit(10).get()
        .then((data) => {
            let scores = [];
            data.forEach((doc) => {
                scores.push({
                    name: doc.data().name,
                    score: doc.data().score,
                    wpm: doc.data().wpm,
                    cpm: doc.data().cpm,
                    accuracy: doc.data().accuracy,
                    identifier: doc.data().identifier
                });
            })
            return res.json({leaderboard: scores});
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({error: "Something went wrong"})
        })
}