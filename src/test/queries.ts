const getBlockQuery = (id: number) => {
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

const addBlockQuery = (sender: string, reciver: string, amount: number) => {
    return `
        mutation{
            addBlock(sender:"${sender}", reciver:"${reciver}", amount:${amount}){
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

const getBlocksQuery = () => {
    return `
        query{
            getBlocks{
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

export { getBlockQuery, addBlockQuery, getBlocksQuery }