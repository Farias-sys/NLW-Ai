import {fastify} from 'fastify'
import { fastifyCors} from '@fastify/cors'
import {prisma} from './lib/prisma'
import { getAllPrompsRoute } from './routes/get-all-prompts'
import { uploadVideoRoute } from './routes/upload-video'
import {createTranscriptionRoute} from './routes/create-transcription'
import {generateAICompletionRoute} from './routes/generate-ai-completion'

const api = fastify()

api.register(fastifyCors, {
    origin: '*'
})

api.register(getAllPrompsRoute)
api.register(uploadVideoRoute)
api.register(createTranscriptionRoute)
api.register(generateAICompletionRoute)

api.listen({
    port: 5000,
}).then(() => {
    console.log("HTTP Server Running!")
})