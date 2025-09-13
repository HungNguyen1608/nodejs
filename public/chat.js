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
// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data)=> {
    const myId = document.querySelector("[my-id]").getAttribute("my-id")
    const body = document.querySelector(".inner-body")
    const div = document.createElement("div")
    console.log(myId)
    console.log(data.user_id)
    if(String(myId) === String(data.user_id)){
        htmlFullname= ``
        div.classList.add("inner-outgoing")
    }else{
        htmlFullname = `<div class="inner-name">${data.fullname}</div>`
        div.classList.add("inner-incoming")
    }
    div.innerHTML = `
        ${htmlFullname}
        <div class="inner-content">${data.content}</div>
    `
    body.appendChild(div)
    body.scrollTop = body.scrollHeight;

    
})

//scroll chat to bottom
const bodyChat = document.querySelector(".inner-body")
if(bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight;
}