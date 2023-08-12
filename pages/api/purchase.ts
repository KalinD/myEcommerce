import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import stripe from "@/lib/utils/stripe";

function getOccurrence(array: string[], value: string) {
    var count = 0;
    array.forEach((v) => (v === value && count++));
    return count;
}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    const session = await getServerSession(request, response, authOptions)
    if (request.method !== 'POST') {
        response.status(400).send(JSON.stringify({ error: 'Only POST requests allowed on this route!' }))
        return
    }

    // List of product ids
    const body: string[] = await request.body;

    const products = await prisma.product.findMany({
        where: {
            OR: body.map(id => ({ id }))
        }
    })

    const stripeSession = await stripe.checkout.sessions.create({
        success_url: 'http://127.0.0.1:3000/',
        line_items: products.map(p => ({ price: p.stripeId as string, quantity: getOccurrence(body, p.id)})),
        mode: 'payment',
    });

    if (session?.user && stripeSession.url) {
        const order = await prisma.order.create({
            data: {
                userId: session?.user.id,
                products: {
                    connect: body.map(id => ({ id }))
                }
            },
        });

        response.status(201).send(JSON.stringify({order, redirectUrl: stripeSession.url}))
        return
    }
    response.status(401).send(JSON.stringify({ message: 'User must be logged in!' }))
}
