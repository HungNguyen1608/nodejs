// CLIENT_SEND_MESSAGE
const formSenData = document.querySelector(".inner-form")
if(formSenData){
    formSenData.addEventListener("submit", (e)=>{
        e.preventDefault()
        const content = e.target.elements.content.value
        if(content){
            socket.emit("CLIENT_SEND_MESSAGE", content)
            e.target.elements.content.value = ""
        }
    })
}