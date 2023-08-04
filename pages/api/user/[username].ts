import { VerifyJwt } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function Get(req: NextApiRequest, res: NextApiResponse) {
    const { username } = req.query
    if (!req.headers.authorization || req.headers.authorization.split(' ')[0] !== 'Bearer') {
        res.status(401).send(JSON.stringify({ error: 'Unauthorized' }))
        return
    }
    const accessToken = req.headers.authorization.split(' ')[1]
    if (!VerifyJwt(accessToken)) {
        res.status(401).send(JSON.stringify({ error: 'Unauthorized' }))
        return
    }

    const user = await prisma.user.findFirst({
        where: {
            username: String(username)
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
