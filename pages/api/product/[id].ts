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

export default async function handle(request: NextApiRequest, response: NextApiResponse) {
    const session = await getServerSession(authOptions)

    if (!session.user) {
        response.status(401).send(JSON.stringify({ error: 'You first must log in!' }))
        return
    }

    if (session?.user.role !== UserRole.ADMIN) {
        response.status(403).send(JSON.stringify({ error: 'Only ADMINs are allowed on this route!' }))
    }
    const { id } = request.query
    if (request.method === 'DELETE') {
        const deletedProducts = await prisma.product.delete({
            where: {
                id: id as string
            }
        })
        if (deletedProducts) response.status(204).send({})
        else response.status(404).send({ message: 'Product was not found! Make sure you delete an existing product.' })
    } else if (request.method === 'PUT') {
        const body: RequestBody = request.body
        const updatedProduct = await prisma.product.update({
            where: {
                id: id as string
            },
            data: {
                name: body.name,
                altText: body.altText,
                description: body.description,
                image: body.image,
                price: body.price
            }
        })
        if (updatedProduct) response.status(200).send(updatedProduct)
        else response.status(404).send({ message: 'Product was not found! Make sure you delete an existing product.' })
    }
    // else if (request.method === 'POST') {
    //     const body: RequestBody = await request.body;

    //     const product = await prisma.product.create({
    //         data: {
    //             name: body.name,
    //             image: body.image,
    //             altText: body.altText,
    //             description: body.description,
    //             price: body.price
    //         },
    //     });

    //     response.status(201).send(product)
    // }
    else {
        response.status(405).send({message: 'Method Not Allowed!'})
    }

}
