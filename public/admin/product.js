
//change-status
const buttonChangeStatus = document.querySelectorAll("[button-change-status]")
if(buttonChangeStatus.length > 0){
    const formChangeStatus = document.querySelector("#form-change-status")
    const path = formChangeStatus.getAttribute("data-path")
    buttonChangeStatus.forEach( button =>{
        button.addEventListener("click",()=>{
            console.log(1)
            const statusCurrent = button.getAttribute("data-status")
            const id = button.getAttribute("data-id")
            
            let statusChange = statusCurrent == "active" ? "inactive":"active"

            const action = path + `/${statusChange}/${id}?_method=PATCH`
            
            formChangeStatus.action = action

            formChangeStatus.submit()

        })
    })
}

//delete
const buttonDelete = document.querySelectorAll("[button-delete]")
if(buttonDelete.length > 0){
    const formDelete =document.querySelector("#form-delete")
    const path = formDelete.getAttribute("data-path")

    buttonDelete.forEach(button => {
        button.addEventListener("click", () =>{
            const isConfirm = confirm("Bạn có chắc chắn muốn xoá")

            if(isConfirm){
                const id = button.getAttribute("data-id")
                console.log(id)

                const action = `${path}/${id}?_method=DELETE`
                formDelete.action = action
                formDelete.submit()
            }
        })
    })
}