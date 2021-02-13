import { getBlock, getBlocks, chainIsValid, getChainLength } from "resolvers/block"
import { ApolloError } from "apollo-server-express"

export default {
    getBlock: (parent: void, { id }: { id: number }) => {
        const block = getBlock(id)
        if (block === undefined) {
            const chainLength = getChainLength()
            if (chainLength === 0) {
                throw new ApolloError(`chain is empty`)
            }
            else {
                throw new ApolloError(`id : [1 ~ ${chainLength}] / ${id} is not valid `)
            }
        }
        return block
    },
    getBlocks,
    chainIsValid,
    getChainLength
}