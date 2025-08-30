module.exports.createTree = function createTree(arr, parentId = "", counter = { value: 0 }){
    const tree = []
    arr.forEach(item =>{
        if(item.parent_id === parentId){
            counter.value++
            const newItem = item
            newItem.index = counter.value
            const children = createTree(arr, item.id, counter)
            if(children.length > 0){
                newItem.children = children
            }
            tree.push(newItem)
        }
    })
    return tree
    
}