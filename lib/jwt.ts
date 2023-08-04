import jwt, { JwtPayload } from 'jsonwebtoken'

interface SignOption {
    expiresIn?: string | number;
}

const DEFAULT_SIGN_OPTION: SignOption = {
    expiresIn: "1h"
}

export function SignJwtAccessToken(payload: JwtPayload, options: SignOption = DEFAULT_SIGN_OPTION) {
    const secretKey = process.env.SECRET_KEY
    const token = jwt.sign(payload, secretKey!, options)
    return token
}

export function VerifyJwt(token: string) {
    try {
        const secretKey = process.env.SECRET_KEY
        const decoded = jwt.verify(token, secretKey!)
        return decoded as JwtPayload

    } catch (e) {
        console.log(e)
        return null
    }
}
