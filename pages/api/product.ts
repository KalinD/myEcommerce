import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { UserRole } from "@prisma/client";

interface RequestBody {
    name: string;
    image: string;
    altText: string;
    description: string;
    price: number;
}

export default async function Post(request: NextApiRequest, response: NextApiResponse) {
    const session = await getServerSession(authOptions)
    
    if (request.method !== 'POST') {
        response.status(400).send(JSON.stringify({ error: 'Only POST requests allowed on this route!' }))
        return
    }
    if (session?.user.role !== UserRole.ADMIN){
        response.status(401).send(JSON.stringify({ error: 'Only ADMINs are allowed on this route!' }))
    }

    const body: RequestBody = await request.body;

    const product = await prisma.product.create({
        data: {
            name: body.name,
            image: body.image,
            altText: body.altText,
            description: body.description,
            price: body.price
        },
    });

    response.status(201).send(product)
}
