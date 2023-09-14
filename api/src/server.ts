import {fastify} from 'fastify'
import { fastifyCors} from '@fastify/cors'
import {prisma} from './lib/prisma'
import { getAllPrompsRoute } from './routes/get-all-prompts'
import { uploadVideoRoute } from './routes/upload-video'
import {createTranscriptionRoute} from './routes/create-transcription'

const api = fastify()

api.register(fastifyCors, {
    origin: '*'
})

api.register(getAllPrompsRoute)
api.register(uploadVideoRoute)
api.register(createTranscriptionRoute)

api.listen({
    port: 5000,
}).then(() => {
    console.log("HTTP Server Running!")
})