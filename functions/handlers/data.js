const { db } = require('../utilities/admin');
const txtgen = require('txtgen');


exports.getTitles = (req, res) => {
    // titleId = req.params.titleId

    response = [];
    db.doc(`data/new`).get()
        .then((doc) => {
            response = doc.data();

            return res.json({response})
        })
    
        
}


exports.generateText = (req, res) => {

    // const sentence = txtgen.sentence();
    // const paragraph = txtgen.paragraph();
    // const article = txtgen.article();

    let result;
    const type = req.params.type

    if (type === "sentence") {
        result = txtgen.sentence();
    } else if (type === "paragraph") {
        result = txtgen.paragraph();
    } else if (type === "article") {
        result = txtgen.article();
    }
    
    return res.json({result});

}