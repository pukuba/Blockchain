import { getBlock, getBlocks, chainIsValid, getChainLength } from "resolvers/block"
import { ApolloError } from "apollo-server-express"

export default {
    test: () => "Server On",
    getBlock: (parent: void, { id }: { id: number }) => {
        const block = getBlock(id)
        if (block === false) {
            throw new ApolloError(`id : [0 ~ ${getChainLength()}] ${id} is not valid `)
        }
        return block
    },
    getBlocks: () => getBlocks(),
    chainIsValid: () => chainIsValid()
}