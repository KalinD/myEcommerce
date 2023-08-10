import { PrismaClient } from '@prisma/client'
import { NumericLiteral } from 'typescript';
const prisma = new PrismaClient()
import fs from 'fs'

type APIProducts = {
    id: number;
    title: string;
    price: number;
    category: string;
    description: string;
    image: string;
}

const UPLOAD_URL = './public/images'
const IMAGES_URL = '/images'

async function main() {
    const res = await fetch('https://fakestoreapi.com/products')
    const products: APIProducts[] = await res.json()

    products.forEach(async (product) => {
        console.log("Started seeding...")
        const response = await fetch(product.image);
        const fileName = product.image.split('/')[product.image.split('/').length - 1]
        const blobImage = await response.blob();
        const href = URL.createObjectURL(blobImage);

        fs.writeFile(`${UPLOAD_URL}/${fileName}`, href, (err) => {
            if (err) throw err;
        });

        const p = await prisma.product.create({
            data: {
                name: product.title,
                image: `${IMAGES_URL}/${fileName}`,
                price: product.price,
                description: product.description,
                altText: product.title
            }
        })
        console.log(`Created product ${p.name} with id: ${p.id}`)
    })
    console.log('Seeding completed.')
}

main()
    .catch(async (e) => {
        console.error(e)
        process.exit(1)
    }).finally(async () => {
        await prisma.$disconnect()
    })
