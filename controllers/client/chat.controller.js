const Chat = require("../../models/chat.model")
const User = require("../../models/user.model")
const uploadToCloudinary = require("../../helpers/uploadToCloudinary")
const chatSocket = require("../../sockets/client/chat.socket")

module.exports.index = async (req, res) => {
    const userId = res.locals.user.id
    const fullname = res.locals.user.fullname

    chatSocket(res)
    const chats = await Chat.find({
        deleted: false
    })
    for(const chat of chats){
        const infoUser = await User.findOne({
            _id: chat.user_id
        }).select("fullname")
        chat.infoUser = infoUser
    }
    res.render("clients/pages/chat/index", {
        pageTitle: "Chat",
        chats: chats

    })
}