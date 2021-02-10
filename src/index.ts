import dotenv from "dotenv"
dotenv.config()

import { ApolloServer, ApolloError } from "apollo-server-express"
import { readFileSync } from "fs"
import { createServer } from "http"
import queryComplexity, { simpleEstimator } from 'graphql-query-complexity'
import depthLimit from "graphql-depth-limit"
import DB from "config/connectDB"

import express from "express"
import expressPlayground from "graphql-playground-middleware-express"
import bodyParser from "body-parser"
import cors from "cors"
import resolvers from "resolvers"
const typeDefs = readFileSync("src/typeDefs.graphql", "utf-8")

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.get("/graphql", expressPlayground({ endpoint: "/api" }))

const start = async () => {
    const db = await DB.get()
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: () => {
            return { db }
        },
        validationRules: [
            depthLimit(5),
            queryComplexity({
                estimators: [
                    simpleEstimator({ defaultComplexity: 1 })
                ],
                maximumComplexity: 1000,
                onComplete: (complexity: number) => {
                    console.log(`Query Complexity: ${complexity}`)
                },
                createError: (max: number, actual: number) => {
                    return new ApolloError(`Query is too complex: ${actual}. Maximum allowed complexity: ${max}`);
                },

            })
        ]
    })

    server.applyMiddleware({
        app,
        path: "/api"
    })

    const httpServer = createServer(app)
    httpServer.timeout = 5000
    httpServer.listen({ port: process.env.PORT || 3000 }, () => {
        console.log(`GraphQL Server Running at http://localhost:${process.env.PORT || 3000}/api`)
    })
}

start()

export default app