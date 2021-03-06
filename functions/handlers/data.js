const { db, admin } = require('../utilities/admin');
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

    const docRef = db.collection('users').doc(email);
    let statsLength, score, topScore, cpm, wpm, accuracy;
    let userDetails = {}
    db.doc(`/users/${email}`).get()
        .then( async (doc) => {
            statsLength = doc.data().statsLength;
            score = doc.data().score;
            topScore = doc.data().topScore;
            cpm = doc.data().cpm;
            wpm = doc.data().wpm;
            accuracy = doc.data().accuracy;
            if (doc.data().preference === null || doc.data().preference === "sentence" || doc.data().preference === "paragraph") {
                await docRef.update({stats: true})
                await docRef.update({score: Number(stats.score + score)})
                console.log("top score", topScore)
                console.log("new score", stats.score)
                if (stats.score > topScore) {
                    await docRef.update({topScore: stats.score})
                }
                if (stats.cpm > cpm) {
                    await docRef.update({cpm: stats.cpm})
                }
                if (stats.wpm > wpm) {
                    await docRef.update({wpm: stats.wpm})
                }
                if (stats.accuracy > accuracy) {
                    await docRef.update({accuracy: stats.accuracy})
                }

                                
                await docRef.update({
                    allScores: admin.firestore.FieldValue.arrayUnion({[new Date().toISOString()]: stats.score})
                });
                await docRef.update({
                    allCpm: admin.firestore.FieldValue.arrayUnion({[new Date().toISOString()]: stats.cpm})
                });
                await docRef.update({
                    allWpm: admin.firestore.FieldValue.arrayUnion({[new Date().toISOString()]: stats.wpm})
                });
                await docRef.update({
                    allAccuracy: admin.firestore.FieldValue.arrayUnion({[new Date().toISOString()]: stats.accuracy})
                });
                await docRef.update({statsLength: statsLength + 1})

                await db.doc(`/users/${email}`).get()
                    .then( async (doc) => {
                        statsLength = doc.data().statsLength;
                        if ( statsLength > 30 ) {
                            let allScores = doc.data().allScores
                            allScores.shift();
                            await docRef.update({allScores: allScores})

                            let allCpm = doc.data().allCpm
                            allCpm.shift();
                            await docRef.update({allCpm: allCpm})

                            let allWpm = doc.data().allWpm
                            allWpm.shift();
                            await docRef.update({allWpm: allWpm})

                            let allAccuracy = doc.data().allAccuracy
                            allAccuracy.shift();
                            await docRef.update({allAccuracy: allAccuracy})

                            await docRef.update({statsLength: statsLength - 1})
                        }
                        // score is the cummulative score
                        function arrayAve (array) {
                            let arrayTotal = 0;
                            let average = 0;
                            for (let i = 0; i < array.length; i++) {
                                    let eachScore = Number(Object.values(array[i]));
                                    arrayTotal += eachScore;
                            }
                            return average = arrayTotal / array.length;
                        }

                        userDetails = {
                            name: doc.data().name,
                            email: doc.data().email,
                            preference: doc.data().preference,
                            stats: doc.data().stats,
                            score: doc.data().score,
                            topScore: doc.data().topScore,
                            aveScore: Math.round(arrayAve(doc.data().allScores)),
                            cpm: doc.data().cpm,
                            aveCpm: Math.round(arrayAve(doc.data().allCpm)),
                            wpm: doc.data().wpm,
                            aveWpm: Math.round(arrayAve(doc.data().allWpm)),
                            accuracy: (doc.data().accuracy).toFixed(2),
                            aveAccuracy: (arrayAve(doc.data().allAccuracy)).toFixed(2),
                            identifier: doc.data().identifier,
                            createdAt: doc.data().createdAt
                        }
                    })
                    let message = {message: "New stats data applied"}
                return res.json({message, userDetails});
            }  else {
                return res.json({message: "User is using a custom text, so the stats from this section are not applied."})
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({error: "Something went wrong"})
        })
}

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