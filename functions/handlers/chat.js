const { db } = require('../utilities/admin');

exports.postChat = (req, res) => {
    const newChat = {
        message: req.body.message,
        createdAt: new Date().toISOString(),
        name: name
    }

    if (newChat.message.trim() === '') {
        return res.status(400).json({error: "Please enter a message"});
    }

    let chat = {};
    db.collection('chats').add(newChat)
        .then((doc) => {
            chat = newChat;
            chat.chatId = doc.id;
            return db.doc(`/chats/${chat.chatId}`).update({chatId: chat.chatId});
        })
        .then(() => {
            return res.status(200).json({chat});
        })
        .catch((error) => {
            console.error(error);
            console.error(error);
            return res.status(500).json({error: "Something went wrong"});
        })
}




exports.getChats = (req, res) => {
    let allChats = [];
    db.collection('chats').orderBy('createdAt', 'desc').get()
        .then((data) => {
            data.forEach((doc) => {
                allChats.push(doc.data());
            })
        })
        .then(() => {
            return res.status(200).json({allChats});
        })
        .catch((error) => {
            console.error(error);
            console.error(error);
            return res.status(500).json({error: "Something went wrong"});
        })
}