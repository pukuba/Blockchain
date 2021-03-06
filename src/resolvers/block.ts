import crypto from "crypto"
import { Block, Trade } from "config/Types"

const chain: Block[] = []

const getTime = () => Math.floor(Date.now() / 1000)

const getHash = (index: number, data: Trade, prevHash: string, timestamp: number) => crypto
    .createHmac("sha256", "secret")
    .update(JSON.stringify(data) + prevHash + index + timestamp)
    .digest("hex")


const createBlock = (index: number, data: Trade, prevHash: string) => {
    const timestamp = getTime()
    return {
        index,
        timestamp,
        data,
        prevHash,
        hash: getHash(index, data, prevHash, timestamp)
    }
}

const addBlock = (data: Trade) => {
    const index = chain.length
    const prevHash = index !== 0 ? chain[index - 1].hash : "0"
    chain.push(createBlock(index, data, prevHash))
    return chain[index]
}

const chainIsValid = (idx: number = chain.length - 1): boolean => {
    if (idx === -1) {
        return true
    }
    const hash = getHash(chain[idx].index, chain[idx].data, chain[idx].prevHash, chain[idx].timestamp)
    if (chain[idx].hash !== hash) {
        return false
    }
    if (idx > 0 && chain[idx].prevHash !== chain[idx - 1].hash) {
        return false
    }
    return chainIsValid(idx - 1)
}

const getBlocks = () => chain

const getChainLength = () => chain.length

const getBlock = (id: number): Block => chain[id - 1]

export { addBlock, chainIsValid, getBlock, getBlocks, getChainLength }