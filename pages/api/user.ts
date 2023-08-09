import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";

interface RequestBody {
    name: string;
    email: string;
    password: string;
    username: string;
}

const ROUNDS = 10

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    if(request.method !== 'POST'){
        response.status(400).send(JSON.stringify({error: 'Only POST requests allowed on this route!'}))
        return
    }

    const body: RequestBody = await request.body;

    const user = await prisma.user.create({
        data: {
            name: body.name,
            email: body.email,
            username: body.username,
            password: await bcrypt.hash(body.password, ROUNDS),
        },
    });

    const { password, ...result } = user;
    response.send(result)
}
