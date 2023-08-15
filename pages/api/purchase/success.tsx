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
  if (!session?.user) {
    response.status(401).send(JSON.stringify({ message: "Unauthorized!" }));
  }

  if (
    await prisma.order.findUnique({
      where: {
        stripeSession: session?.user.purchaseSession as string,
      },
    })
  ) {
    return;
  }
  const stripeSession = await stripe.checkout.sessions.retrieve(
    session?.user.purchaseSession as string,
    { expand: ["line_items"] }
  );

  if (
    request.method === "GET" &&
    stripeSession.status?.toString() === "complete"
  ) {
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
