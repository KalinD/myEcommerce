import { SignJwtAccessToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import * as bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from "next";
import { headers } from "next/dist/client/components/headers";

interface RequestBody {
  emailOrUsername: string;
  password: string;
}

export default async function Post(req: NextApiRequest, res: NextApiResponse) {
  const body: RequestBody = await req.body;

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: body.emailOrUsername }, { email: body.emailOrUsername }],
    },
  });
  if (user && user.password && (await bcrypt.compare(body.password, user.password))) {
    const { password, ...userWithoutPass } = user;
    const accessToken = SignJwtAccessToken(userWithoutPass)
    const result = {
      ...userWithoutPass,
      accessToken
    }
    res.send(JSON.stringify(result))
    return
  }
  res.send(JSON.stringify(null))
}
