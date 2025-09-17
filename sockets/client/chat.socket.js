const uploadToCloudinary = require("../../helpers/uploadToCloudinary")
const Chat = require("../../models/chat.model")
const User = require("../../models/user.model")

module.exports = (res) => {
    const userId = res.locals.user.id
    const fullname = res.locals.user.fullname
     _io.once("connection", (socket) => {
        console.log('a user connected', socket.id)
        socket.on("CLIENT_SEND_MESSAGE", async (data) =>{
            let images = []
            console.log(data.images)
            for(const image of data.images){
                const link = await uploadToCloudinary.uploadToCloud(image)
                images.push(link)
            }
            const chat = new Chat({
                user_id: userId,
                content: data.content,
                images: images
                
            })
            await chat.save()
            _io.emit("SERVER_RETURN_MESSAGE",{
                fullname:fullname,
                user_id: userId,
                content: data.content,
                images: images
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
}