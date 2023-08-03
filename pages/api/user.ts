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

export default async function Post(request: NextApiRequest, response: NextApiResponse) {
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
    // return new Response(JSON.stringify(result));
}
