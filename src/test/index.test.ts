import assert from 'assert'
import app from 'index'
import request from 'supertest'
import { getBlockStr } from "lib"

describe(`GraphQL API Test`, () => {
    it(`addBlock Success Case`, async () => {
        const query = `
            mutation{
                addBlock(sender:"seung-won", reciver:"won-seung", amount:1004){
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
        const res1 = await request(app)
            .post(`/api`)
            .set("Content-Type", "application/json")
            .send(JSON.stringify({ query }))
            .expect(200)

        assert.strictEqual(res1.body.data.addBlock.prevHash, "0")
        assert.strictEqual(res1.body.data.addBlock.id, 1)
        assert.strictEqual(res1.body.data.addBlock.data.sender, "seung-won")
        assert.strictEqual(res1.body.data.addBlock.data.reciver, "won-seung")
        assert.strictEqual(res1.body.data.addBlock.data.amount, 1004)

        const res2 = await request(app)
            .post(`/api`)
            .set("Content-Type", "application/json")
            .send(JSON.stringify({ query }))
            .expect(200)

        assert.strictEqual(res1.body.data.addBlock.hash, res2.body.data.addBlock.prevHash)
        assert.strictEqual(res2.body.data.addBlock.id, 2)

        const res3 = await request(app)
            .post(`/api`)
            .set("Content-Type", "application/json")
            .send(JSON.stringify({ query }))
            .expect(200)

        assert.strictEqual(res2.body.data.addBlock.hash, res3.body.data.addBlock.prevHash)
        assert.strictEqual(res3.body.data.addBlock.id, 3)
    })

    it(`addBlock Failure Case`, async () => {
        const query = `
            mutation{
                addBlock(sender:1004, reciver:1004, amount:1004.5){
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
        const res = await request(app)
            .post(`/api`)
            .set("Content-Type", "application/json")
            .send(JSON.stringify({ query }))
            .expect(400)

        assert.strictEqual(res.body.errors[0].message, 'Argument "sender" has invalid value 1004.')
        assert.strictEqual(res.body.errors[0].extensions.code, "GRAPHQL_VALIDATION_FAILED")
        assert.strictEqual(res.body.errors[1].message, 'String cannot represent a non string value: 1004')
        assert.strictEqual(res.body.errors[2].message, 'String cannot represent a non string value: 1004')
        assert.strictEqual(res.body.errors[3].message, 'Int cannot represent non-integer value: 1004.5')
    })

    it(`getBlock & getBlocks Query Test`, async () => {

        const query = `
            query{
                getBlocks{
                    id
                }
            }
        `

        const query1 = getBlockStr(2)
        const query2 = getBlockStr(3)
        const query3 = getBlockStr(10000)

        const res = await request(app)
            .get(`/api?query=${query}`)
            .expect(200)
        assert.strictEqual(res.body.data.getBlocks.length, 3)

        const res1 = await request(app)
            .get(`/api?query=${query1}`)
            .expect(200)
        assert.strictEqual(res1.body.data.getBlock.id, 2)

        const res2 = await request(app)
            .get(`/api?query=${query2}`)
            .expect(200)
        assert.strictEqual(res2.body.data.getBlock.id, 3)

        assert.strictEqual(res1.body.data.getBlock.hash, res2.body.data.getBlock.prevHash)

        const res3 = await request(app)
            .get(`/api?query=${query3}`)
            .expect(200)

        assert.strictEqual(res3.body.errors[0].message, "id : [1 ~ 3] / 10000 is not valid ")
        assert.strictEqual(res3.body.data.getBlock, null)
    })
})