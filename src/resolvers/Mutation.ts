import { Trade } from "config/Types"
import { addBlock } from "resolvers/block"

export default {
    addBlock: (parent: void, args: Trade) => addBlock(args)
}