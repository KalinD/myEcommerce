import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function Post(request: NextApiRequest, response: NextApiResponse) {
    const session = await getServerSession(request, response, authOptions)
    if (request.method !== 'POST') {
        response.status(400).send(JSON.stringify({ error: 'Only POST requests allowed on this route!' }))
        return
    }

    // List of product ids
    const body: string[] = await request.body;

    if (session?.user) {
        const order = await prisma.order.create({
            data: {
                userId: session?.user.id,
                products: {
                    connect: body.map(id => ({ id }))
                }
            },
        });
        response.send(JSON.stringify(order))
        return
    }
    response.status(401).send(JSON.stringify({ message: 'User must be logged in!' }))
}
