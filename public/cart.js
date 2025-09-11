// update cart
const inputQuantity = document.querySelectorAll("input[name='quantity']")
if(inputQuantity.length > 0)
{
    inputQuantity.forEach( input => {
        input.addEventListener("click", (e)=>{
            const productId = input.getAttribute("product-id")
            const quantity = input.value
            console.log(quantity)
            // console.log(e.target.value)

            window.location.href = `/cart/update/${productId}/${quantity}`
        })
    })
}