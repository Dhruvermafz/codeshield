import express from "express"
import createSchemas from "../models/schemas"

const schemaRouter = express.Router()

schemaRouter.post("/schema", createSchemas)

export default schemaRouter