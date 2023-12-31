import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import stripe from "@/lib/utils/stripe";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    if (request.method !== 'POST') {
        response.status(400).send(JSON.stringify({ error: 'Only POST requests allowed on this route!' }))
        return
    }

    // List of product ids
    const body: { id: string, amount: number }[] = await request.body;

    const products = await prisma.product.findMany({
        where: {
            OR: body.map(p => ({ id: p.id }))
        }
    })

    const session = await getServerSession(request, response, authOptions)

    const stripeSession = await stripe.checkout.sessions.create({
        customer_email: session?.user.email,
        success_url: `${process.env.NEXTAUTH_URL}/purchase/success`,
        cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
        line_items: products.map(p => ({ price: p.stripeId as string, quantity: body.filter(b => b.id === p.id)[0].amount })),
        mode: 'payment',
    });

    if (session?.user.id) {
        await prisma.user.update({
            where: { id: session?.user.id },
            data: { purchaseSession: stripeSession.id }
        })
    }

    if (stripeSession.url) {
        response.status(201).send(JSON.stringify({ stripeSessionId: stripeSession.id, redirectUrl: stripeSession.url }))
        return
    }
    response.status(401).send(JSON.stringify({ message: 'User must be logged in!' }))
}
