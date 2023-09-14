import { FastifyInstance } from "fastify";
import {prisma} from '../lib/prisma'

export async function getAllPrompsRoute(api:FastifyInstance){
    api.get('/prompts', async () => {
        const prompts = await prisma.prompt.findMany()
    })
}