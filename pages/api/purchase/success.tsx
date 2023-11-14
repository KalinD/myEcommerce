import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import stripe from "@/lib/utils/stripe";
import prisma from "@/lib/prisma";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const session = await getServerSession(request, response, authOptions);
  const body: { stripeSessionId: string } = await request.body;
  const foundOrder = await prisma.order.findFirst({
    where: {
      stripeSession: body.stripeSessionId,
    },
  })
  if (foundOrder) {
    response
      .status(409)
      .send(JSON.stringify({ message: "Purchase was successful!" }));
    return;
  }
  
  const stripeSession = await stripe.checkout.sessions.retrieve(
    body.stripeSessionId,
    { expand: ["line_items"] }
  );

  if (stripeSession.status?.toString() === "complete") {
    if (session?.user === undefined) {
      await prisma.order.create({
        data: {
          userEmail: stripeSession.customer_email,
          stripeSession: stripeSession.id,
          products: {
            create: stripeSession.line_items?.data.map((item) => ({
              productId: item.price?.product as string,
              amount: item.quantity as number,
            })),
          },
        },
      });
    } else {
      await prisma.order.create({
        data: {
          userId: session?.user?.id as string,
          stripeSession: stripeSession.id,
          products: {
            create: stripeSession.line_items?.data.map((item) => ({
              productId: item.price?.product as string,
              amount: item.quantity as number,
            })),
          },
        },
      });
    }
    response
      .status(200)
      .send(JSON.stringify({ message: "Purchase was successful!" }));
    return;
  } else {
    response
      .status(500)
      .send(JSON.stringify({ error: "Pruchase was not complete!" }));
    return;
  }
  response.status(405).send(JSON.stringify({ error: "Method Not Allowed!" }));
}
