import { SignJwtAccessToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import * as bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from "next";
import { headers } from "next/dist/client/components/headers";

interface RequestBody {
  emailOrUsername: string;
  password: string;
}

export default async function Post(request: NextApiRequest, response: NextApiResponse) {
  const body: RequestBody = await request.body;

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
    response.send(JSON.stringify(result))
    return
  }
  response.send(JSON.stringify(null))
}
