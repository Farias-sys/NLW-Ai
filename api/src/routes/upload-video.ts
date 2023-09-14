import { FastifyInstance } from "fastify";
import {fastifyMultipart} from '@fastify/multipart'
import {prisma} from '../lib/prisma'
import path from "node:path"
import { randomUUID } from "node:crypto";

import fs from 'node:fs'
import { promisify } from "node:util";
import { pipeline } from "node:stream";
const pump = promisify(pipeline)

export async function uploadVideoRoute(api:FastifyInstance){
    api.register(fastifyMultipart, {
        limits: {
            fileSize: 1_048_576 * 25
        }
    })

    api.post('/videos', async (req, res) => {
        const data = await req.file()

        if(!data){
            return res.status(400).send({error: 'Missing file input.'})
        }

        const extension = path.extname(data.filename)

        if(extension!='.mp4'){
            return res.status(400).send({error:'Invalid input type, please upload a MP4.'})
        }

        const fileBaseName = path.basename(data.filename, extension)
        const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`

        const uploadDir = path.resolve(__dirname, '../../tmp', fileUploadName)

        await pump(data.file, fs.createWriteStream(data.filename))

        const video = await prisma.video.create({
            data: {
                name: data.filename,
                path: uploadDir
            }
        })

        return video
    })
}