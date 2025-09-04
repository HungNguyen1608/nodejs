const tablePermission = document.querySelector("[table-permission]")
if(tablePermission){
    const buttonSubmit = document.querySelector("[button-submit]")
    buttonSubmit.addEventListener("click", () =>{
        let permission = []

        const rows = tablePermission.querySelectorAll("[data-name]")
        rows.forEach(row =>{
            const name = row.getAttribute("data-name")
            const input = row.querySelectorAll("input")

            if(name == "id"){
                input.forEach(input =>{
                    const id = input.value
                    permission.push({
                        id: id,
                        permissions: []
                    })
                })
            }else{
                input.forEach((input,index) =>{
                    const checked = input.checked
                    if(checked){
                        permission[index].permissions.push(name)
                    }
                })
            }

        })
        console.log(permission)
        if(permission.length > 0)
        {
            const formChangePermissions = document.querySelector("#form-change-permissions")
            const inputPermission = formChangePermissions.querySelector("input[name='permissions']")
            inputPermission.value = JSON.stringify(permission)
            formChangePermissions.submit()

        }
    })
}

const dataRecords = document.querySelector("[data-records]")
if(dataRecords){
    const records = JSON.parse(dataRecords.getAttribute("data-records"))
    records.forEach((record,index)=>{
        const permissions = record.permissions
        permissions.forEach(permission =>{
            const row = tablePermission.querySelector(`[data-name="${permission}"]`)
            const input = row.querySelectorAll("input")[index]
            console.log(input)
            input.checked = true
        })
    })
}