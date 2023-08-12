import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { UserRole } from "@prisma/client";
import multiparty from "multiparty";
import fs from 'fs'

import { RequestBody } from "../product";
import { deleteProduct, updateProduct } from "@/lib/utils/stripe";

export const config = {
    api: {
        bodyParser: false,
    },
};

const UPLOAD_URL = './public/images/'
const IMAGES_URL = '/images/'

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    const session = await getServerSession(request, response, authOptions)

    if (!session?.user) {
        response.status(401).send(JSON.stringify({ error: 'You must log in to access this path!' }))
        return
    }

    if (session?.user.role !== UserRole.ADMIN) {
        response.status(403).send(JSON.stringify({ error: 'Only ADMINs are allowed on this route!' }))
    }
    const { id } = request.query
    if (request.method === 'DELETE') {
        const deletedProducts = await prisma.product.delete({
            where: {
                id: id as string
            }
        })
        if (deletedProducts && await deleteProduct(id as string)) {
            fs.unlinkSync(`${UPLOAD_URL}/${deletedProducts.image.split('/')[2]}`)
            response.status(204).send(null)
        }
        else response.status(404).send({ message: 'Product was not found! Make sure you delete an existing product.' })
    } else if (request.method === 'PUT') {
        const form = new multiparty.Form();
        const data: RequestBody = await new Promise((resolve, reject) => {
            form.parse(request, function (err, fields, files) {
                if (err) reject({ err });
                resolve({ fields, files });
            });
        });
        const oldProduct = await prisma.product.findUnique({
            where: {
                id: id as string
            }
        })
        form.on('file', (_, file) => {
            if (file) {
                fs.renameSync(file.path, `${UPLOAD_URL}/${file.originalFilename}`)
                fs.unlinkSync(`./public${oldProduct?.image}`)
            }
        })
        const updatedProduct = await prisma.product.update({
            where: {
                id: id as string
            },
            data: {
                name: data.fields.name[0],
                altText: data.fields.altText[0],
                description: data.fields.description[0],
                image: data.files.image ? `${IMAGES_URL}${data.files.image[0].originalFilename}` : oldProduct?.image,
                price: Number(data.fields.price[0]),
            }
        })
        await updateProduct(updatedProduct)
        if (updatedProduct) response.status(200).send(updatedProduct)
        else response.status(404).send({ message: 'Product was not found! Make sure you delete an existing product.' })
    }
    else {
        response.status(405).send({ message: 'Method Not Allowed!' })
    }
}
