import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import Product from "@/components/Product";


export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    if (request.method === 'GET') {
        let products: Product[] = [];
        if (!request.query) {
            products = await prisma.product.findMany()
        } else {
            const ids = request.query['id']
            if (typeof ids === 'string') {
                products = await prisma.product.findMany({
                    where: {
                        id: ids
                    },
                })
            } else if (Array.isArray(ids)) {
                products = await prisma.product.findMany({
                    where: {
                        OR: ids.map(id => ({ id }))
                    }
                })
            }
        }
        response.status(200).send(JSON.stringify(products))
    } else {
        response.status(405).send(JSON.stringify({ message: 'Method Not Allowed!' }))
    }
}
