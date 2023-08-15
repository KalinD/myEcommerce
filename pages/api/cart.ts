import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";


export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    const session = await getServerSession(request, response, authOptions)
    if (!session?.user){
        response.status(401).send(JSON.stringify({message: 'Unauthorized!'}))
        return
    }
    if (request.method === 'GET') {
        const user = await prisma.user.findUnique({
            where: {
                id: session.user.id
            },
            include: {
                carts: true
            }
        })
        const cart = user?.carts[0]
        
        response.status(200).send(JSON.stringify(cart))
    } else {
        response.status(405).send(JSON.stringify({ message: 'Method Not Allowed!' }))
    }
}
