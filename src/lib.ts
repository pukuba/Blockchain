const getBlockStr = (id: number) => {
    return `
        query{
            getBlock(id:${id}){
                hash
                prevHash
                timestamp
                id
                data{
                    sender
                    reciver
                    amount
                }
            }
        }
    `
}

export { getBlockStr }