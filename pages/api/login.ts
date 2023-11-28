import { SignJwtAccessToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import * as bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from "next";

interface RequestBody {
  emailOrUsername: string;
  password: string;
}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const body: RequestBody = await request.body;
  console.log(`Body: ${body}`)
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: body.emailOrUsername }, { email: body.emailOrUsername }],
    },
  });
  console.log(`User: ${user}`)
  if (user && user.password && (await bcrypt.compare(body.password, user.password))) {
    const { password, ...userWithoutPass } = user;
    const accessToken = SignJwtAccessToken(userWithoutPass)
    console.log(`AccessToken: ${accessToken}`)
    const result = {
      ...userWithoutPass,
      accessToken
    }
    console.log(`Result: ${result}`)
    response.send(JSON.stringify(result))
    return
  }
  response.send(JSON.stringify(null))
}
