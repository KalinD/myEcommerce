import prisma from "@/lib/prisma";
import * as bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from "next";
import { headers } from "next/dist/client/components/headers";

interface RequestBody {
  emailOrUsername: string;
  password: string;
}

export default async function Post(req: NextApiRequest, res: NextApiResponse) {
  console.log('login')
  const body: RequestBody = await req.body;

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: body.emailOrUsername }, { email: body.emailOrUsername }],
    },
  });

  if (user && user.password && (await bcrypt.compare(body.password, user.password))) {

    const { password, ...userWithoutPass } = user;
    res.send(JSON.stringify(userWithoutPass))
    return
  }
  res.send(JSON.stringify(null))
}
