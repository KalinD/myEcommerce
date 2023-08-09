import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { UserRole } from "@prisma/client";
import multiparty from "multiparty";
import fs from 'fs'

type ImageRequest = {
    fieldName: string,
    originalFilename: string,
    path: string,
    headers: {[key: string]: string}[],
    size: number
}

interface RequestBody {
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

const IMAGES_URL = './images'

export default async function Post(request: NextApiRequest, response: NextApiResponse) {
    const form = new multiparty.Form();
    form.on('file', (name, file) => {
        console.log(JSON.stringify(file))
        console.log(JSON.stringify(name))
        if(file){
            console.log(file.image)
            fs.rename(file.path, `${IMAGES_URL}/${file.originalFilename}`, () => {})
        }
        // fs.writeFile(`${IMAGES_URL}/${file.originalFilename}`, JSON.stringify(file), () => {})    
    })
    const data: RequestBody = await new Promise((resolve, reject) => {
        form.parse(request, function (err, fields, files) {
            if (err) reject({ err });
            resolve({ fields, files });
        });
    });
    console.log(`data: `, data);
    console.log(`data: `, JSON.stringify(data));
    // const session = await getServerSession(authOptions)

    if (request.method !== 'POST') {
        response.status(400).send(JSON.stringify({ error: 'Only POST requests allowed on this route!' }))
        return
    }
    // if (session?.user.role !== UserRole.ADMIN){
    //     response.status(401).send(JSON.stringify({ error: 'Only ADMINs are allowed on this route!' }))
    // }

    const product = await prisma.product.create({
        data: {
            name: data.fields.name[0],
            altText: data.fields.altText[0],
            description: data.fields.description[0],
            price: Number(data.fields.price[0]),
            image: `${IMAGES_URL}/${data.files.image[0].originalFilename}`,
        },
    });

    response.status(201).send(product)
}
