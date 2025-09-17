// preview image
import { FileUploadWithPreview } from 'https://unpkg.com/file-upload-with-preview/dist/index.js'
const upload = new FileUploadWithPreview('upload-file', {
  multiple: true,
  maxFileCount: 6
})

// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".inner-form")
if(formSendData){
    formSendData.addEventListener("submit", (e)=>{
        e.preventDefault()
        const content = e.target.elements.content.value
        const images = upload.cachedFileArray
        console.log(images)
        if(content || images.length > 0){
            socket.emit("CLIENT_SEND_MESSAGE", {
                content: content,
                images: images
            })
            e.target.elements.content.value = ""
            upload.resetPreviewPanel();
            socket.emit("CLIENT_SEND_TYPING","hidden")
        }
    })
}
// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data)=> {
    const myId = document.querySelector("[my-id]").getAttribute("my-id")
    const body = document.querySelector(".inner-body")
    const div = document.createElement("div")
    const boxTyping = document.querySelector(".inner-list-typing")
    let htmlFullname = ""
    let htmlContent = ""
    let htmlImages = ""
    if(String(myId) === String(data.user_id)){
        div.classList.add("inner-outgoing")
    }else{
        htmlFullname = `<div class="inner-name">${data.fullname}</div>`
        div.classList.add("inner-incoming")
    }
    if(data.content){
        htmlContent = `<div class="inner-content">${data.content}</div>`
    }
    if(data.images.length > 0){
        htmlImages =`<div class="inner-images">`
        for(const image of data.images){
            htmlImages += `<img src="${image}">`
        }
        htmlImages +=`</div>`
    }
    div.innerHTML = `
        ${htmlFullname}
        ${htmlContent}
        ${htmlImages}
    `
    // body.appendChild(div)
    body.insertBefore(div, boxTyping)
    body.scrollTop = body.scrollHeight;
    const gellary = new Viewer(div)
    
})

//scroll chat to bottom
const bodyChat = document.querySelector(".inner-body")
if(bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight;
}

//show pop up
import { createPopper } from 'https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/esm/index.js'

const buttonIcon = document.querySelector('.button-icon')
const tooltip = document.querySelector('.tooltip')

if (buttonIcon && tooltip) {
  createPopper(buttonIcon, tooltip, {
    placement: 'top-start'
  })

  buttonIcon.addEventListener('click', () => {
    tooltip.classList.toggle('show')
  })
}
// show typing
var timeout;
const showTyping = () => {
    socket.emit("CLIENT_SEND_TYPING","show")
        clearTimeout(timeout)
        timeout = setTimeout(()=>{
            socket.emit("CLIENT_SEND_TYPING","hidden")
        },3000)
}
//insert icon to input
const emojiPicker = document.querySelector("emoji-picker")
if(emojiPicker){
    const inputChat = document.querySelector(".inner-form input[name='content']")
    var timeout;
    emojiPicker.addEventListener("emoji-click", (event) =>{
        const icon = event.detail.unicode
        inputChat.value = inputChat.value + icon
        const end = inputChat.value.length
        inputChat.setSelectionRange(end, end)
        inputChat.focus()
        showTyping()
    })
    inputChat.addEventListener("keyup", () => {
        showTyping()
    })
}

//SERVER_RETURN_TYPING
const elementTyping = document.querySelector(".inner-list-typing")
console.log(elementTyping)
if(elementTyping){
    socket.on("SERVER_RETURN_TYPING", (data) =>{

        if(data.type==="show"){
            const bodyChat = document.querySelector(".inner-body")
            const existTyping = elementTyping.querySelector(`[user-id="${data.user_id}"]`)
            if(!existTyping){
                const boxTyping = document.createElement("div")
                boxTyping.classList.add("box-typing")
                boxTyping.setAttribute("user-id",data.user_id)
                boxTyping.innerHTML = `
                    <div class="box-typing">
                        <div class="inner-name"> ${data.fullname} </div>
                        <div class="inner-dots">
                            <span></span> 
                            <span></span>  
                            <span></span>
                        </div>
                    </div>`
                elementTyping.appendChild(boxTyping)
                bodyChat.scrollTop = bodyChat.scrollHeight;

            }
        }else{
            const boxRemove = elementTyping.querySelector(`[user-id="${data.user_id}"]`)
            if(boxRemove){
                elementTyping.removeChild(boxRemove)
            }
        }
    })
}
//preview full image
// import Viewer from 'https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.11.7/viewer.js'
// import Viewer from "https://cdn.jsdelivr.net/npm/viewerjs@1.11.7/dist/viewer.esm.js"

const bodyChatPreview = document.querySelector(".inner-body")
if(bodyChatPreview){
    const gellary = new Viewer(bodyChatPreview) 
}