import { addMissing } from "@/lib/utils/stripe";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    addMissing()
}
