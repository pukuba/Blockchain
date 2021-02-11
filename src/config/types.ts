interface Trade {
    sender: string
    reciver: string
    amount: number
}

interface Block {
    index: number
    timestamp: number
    data: Trade
    prevHash: string
    hash: string
}

export { Trade, Block }