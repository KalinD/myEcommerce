import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { UserRole } from "@prisma/client";
import multiparty from "multiparty";
import fs from 'fs'
import { addProduct } from "@/lib/utils/stripe";

type ImageRequest = {
    fieldName: string,
    originalFilename: string,
    path: string,
    headers: {[key: string]: string}[],
    size: number
}

export interface RequestBody {
    fields: {
        name: string[], 
        description: string[], 
        price: string[], 
        altText: string[] 
    }, 
    files: { 
        image: ImageRequest[]
    } 
}

export const config = {
    api: {
        bodyParser: false,
    },
};

const UPLOAD_URL = './public/images'
const IMAGES_URL = '/images'

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    const session = await getServerSession(request, response, authOptions)

    if (request.method !== 'POST') {
        response.status(400).send(JSON.stringify({ error: 'Only POST requests allowed on this route!' }))
        return
    }
    if (session?.user.role !== UserRole.ADMIN){
        response.status(401).send(JSON.stringify({ error: 'Only ADMINs are allowed on this route!' }))
    }
    
    const form = new multiparty.Form();
    form.on('file', (_, file) => {
        if(file){
            fs.renameSync(file.path, `${UPLOAD_URL}/${file.originalFilename}`)
        }  
    })
    const data: RequestBody = await new Promise((resolve, reject) => {
        form.parse(request, function (err, fields, files) {
            if (err) reject({ err });
            resolve({ fields, files });
        });
    });

    const product = await prisma.product.create({
        data: {
            name: data.fields.name[0],
            altText: data.fields.altText[0],
            description: data.fields.description[0],
            price: Number(data.fields.price[0]),
            image: `${IMAGES_URL}/${data.files.image[0].originalFilename}`,
        },
    });

    await addProduct(product.id)

    response.status(201).send(product)
}
