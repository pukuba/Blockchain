import assert from 'assert'
import app from 'index'
import request from 'supertest'

describe(`Server Init Test`, () => {
    it(`Server Running Test-1`, async () => {
        const query = `
            query{
                test
            }
        `
        const res = await request(app)
            .get(`/api?query=${query}`)
            .expect(200)
        assert.strictEqual(res.body.data.test, "Server On")
    })
    it(`Server Running Test-2`, async () => {
        const query = `
            query{
                test1
            }
        `
        const res = await request(app)
            .get(`/api?query=${query}`)
            .expect(400)
        assert.strict(Array.isArray(res.body.errors[0].locations))
        assert.strictEqual(res.body.errors[0].message, `Cannot query field "test1" on type "Query". Did you mean "test"?`)
    })
})