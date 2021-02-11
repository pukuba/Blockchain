import { Block } from "config/Types"

export default {
    Block: {
        id: (parent: Block) => parent.index + 1
    }
}