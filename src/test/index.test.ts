import assert from "assert"
import app from "index"
import request from "supertest"
import { Block } from "config/types"
import { getBlockQuery, addBlockQuery, getBlocksQuery } from "test/queries"

describe(`Blockchain GraphQL API Test`, () => {

    describe(`addBlock Success Case`, () => {
        it(`Insert Block - 1`, async () => {
            const query = addBlockQuery("seung-won", "won-seung", 1004)
            const res = await request(app)
                .post(`/api`)
                .set("Content-Type", "application/json")
                .send(JSON.stringify({ query }))
                .expect(200)

            assert.strictEqual(res.body.data.addBlock.prevHash, "0")
            assert.strictEqual(res.body.data.addBlock.id, 1)
            assert.strictEqual(res.body.data.addBlock.data.sender, "seung-won")
            assert.strictEqual(res.body.data.addBlock.data.reciver, "won-seung")
            assert.strictEqual(res.body.data.addBlock.data.amount, 1004)
        })

        it(`Insert Block - 2`, async () => {
            const query = addBlockQuery("won-seung", "seung-won", 10004)
            const res = await request(app)
                .post(`/api`)
                .set("Content-Type", "application/json")
                .send(JSON.stringify({ query }))
                .expect(200)

            assert.strictEqual(res.body.data.addBlock.id, 2)
        })

        it(`Insert Block - 3`, async () => {
            const query = addBlockQuery(">.<", "^~^", 1e6 + 7)
            const res = await request(app)
                .post(`/api`)
                .set("Content-Type", "application/json")
                .send(JSON.stringify({ query }))
                .expect(200)

            assert.strictEqual(res.body.data.addBlock.id, 3)
        })
    })

    describe(`addBlock Failure Case`, async () => {
        it(`Insert Block - 4`, async () => {
            const query = addBlockQuery("seung", "won", 1004.5)
            const res = await request(app)
                .post(`/api`)
                .set("Content-Type", "application/json")
                .send(JSON.stringify({ query }))
                .expect(400)

            assert.strictEqual(res.body.errors[0].message, 'Argument "amount" has invalid value 1004.5.')
            assert.strictEqual(res.body.errors[0].extensions.code, "GRAPHQL_VALIDATION_FAILED")
            assert.strictEqual(res.body.errors[1].message, 'Int cannot represent non-integer value: 1004.5')
        })
    })

    describe(`getBlock Success Case`, async () => {
        let chainLength: number
        before(async () => {
            const query = `
                query{
                    getChainLength
                }
            `
            const res = await request(app)
                .get(`/api?query=${query}`)
                .expect(200)
            chainLength = res.body.data.getChainLength
        })
        it(`Get Block - 1`, async () => {
            const query = getBlockQuery(1)
            const res = await request(app)
                .get(`/api?query=${query}`)
                .expect(200)

            assert.strictEqual(res.body.data.getBlock.prevHash, "0")
            assert.strictEqual(res.body.data.getBlock.id, 1)
            assert.strictEqual(res.body.data.getBlock.data.sender, "seung-won")
            assert.strictEqual(res.body.data.getBlock.data.reciver, "won-seung")
            assert.strictEqual(res.body.data.getBlock.data.amount, 1004)
        })

        it(`Get Block - 2`, async () => {
            const query = getBlockQuery(chainLength)
            const res = await request(app)
                .get(`/api?query=${query}`)
                .expect(200)

            assert.strictEqual(res.body.data.getBlock.id, chainLength)
            assert.strictEqual(res.body.data.getBlock.data.sender, ">.<")
            assert.strictEqual(res.body.data.getBlock.data.reciver, "^~^")
            assert.strictEqual(res.body.data.getBlock.data.amount, 1e6 + 7)
        })

        it(`Get Block - 3`, async () => {
            const query = getBlocksQuery()
            const res = await request(app)
                .get(`/api?query=${query}`)
                .expect(200)
            const chain: Block[] = res.body.data.getBlocks
            let hash = "", count: number = 1
            for (const block of chain) {
                if (hash.length) {
                    assert.strictEqual(hash, block.prevHash)
                    count += ~~(hash === block.prevHash)
                    hash = block.hash
                } else {
                    hash = block.hash
                }
            }
            assert.strictEqual(chainLength, count)
        })
    })
})