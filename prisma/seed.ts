import { PrismaClient } from '@prisma/client'
import { NumericLiteral } from 'typescript';
const prisma = new PrismaClient()

type APIProducts = {
    id: number;
    title: string;
    price: number;
    category: string;
    description: string;
    image: string;
}

async function main() {
    const res = await fetch('https://fakestoreapi.com/products')
    const products: APIProducts[] = await res.json()

    products.forEach(async (product) => {
        console.log("Started seeding...")
        const p = await prisma.product.create({
            data: {
                name: product.title,
                image: product.image,
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
