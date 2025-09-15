const Chat = require("../../models/chat.model")
const User = require("../../models/user.model")

module.exports.index = async (req, res) => {
    const userId = res.locals.user.id
    const fullname = res.locals.user.fullname

    _io.once("connection", (socket) => {
        console.log('a user connected', socket.id)
        socket.on("CLIENT_SEND_MESSAGE", async (content) =>{
            const chat = new Chat({
                user_id: userId,
                content: content,

            })
            await chat.save()
            _io.emit("SERVER_RETURN_MESSAGE",{
                fullname:fullname,
                user_id: userId,
                content: content
            })
        })
        socket.on("CLIENT_SEND_TYPING", async (type) =>{
           socket.broadcast.emit("SERVER_RETURN_TYPING",{
                fullname: fullname,
                user_id: userId,
                type: type
           })
        })
    })
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