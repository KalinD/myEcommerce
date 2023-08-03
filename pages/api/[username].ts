import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export async function Get(req: NextApiRequest, res: NextApiResponse, { params }: { params: { username: string } }) {
    const user = await prisma.user.findFirst({
        where: {
            username: params.username
        },
        include: {
            orders: {
                select: {
                    products: true,
                }
            },
            carts: {
                select: {
                    products: true,
                }
            }
        }
    })
    res.send(JSON.stringify(user))
}
