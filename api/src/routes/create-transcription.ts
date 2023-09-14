import { FastifyInstance } from "fastify";
import {prisma} from '../lib/prisma'
import { createReadStream } from "fs";
import {openai} from '../lib/openai'
import {z} from 'zod'

export async function createTranscriptionRoute(api:FastifyInstance){
    api.post('/videos/:videoId/transcription', async (req, res) => {
        const paramsSchema = z.object({
            videoId: z.string().uuid()
        })

        const {videoId} = paramsSchema.parse(req.params)

        const bodySchema = z.object({
            prompt: z.string()
        })

        const {prompt} = bodySchema.parse(req.body)

        const video = await prisma.video.findUniqueOrThrow({
            where: {
                id: videoId
            }
        })

        const videoPath = video.path
        const audioReadStream = createReadStream(videoPath)

        const response = await openai.audio.transcriptions.create({
            file: audioReadStream,
            model: 'whisper-1',
            language: 'pt',
            response_format: 'json',
            temperature: 0,
            prompt
        })

        await prisma.video.update({
            where: {
                id: videoId
            },
            data: {
                transcription:response.text
            }
        })
    })
}