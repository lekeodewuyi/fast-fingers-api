const { db } = require('../utilities/admin');


exports.getTitles = (req, res) => {
    // titleId = req.params.titleId

    response = [];
    db.doc(`data/new`).get()
        .then((doc) => {
            response = doc.data();

            return res.json({response})
        })
    
        
}