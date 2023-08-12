import Product from "@/components/Product";
// import { loadStripe } from "@stripe/stripe-js";
// import {useStripe, useElements, PaymentElement} from '@stripe/react-stripe-js';
// import Stripe from "stripe";
import prisma from "../prisma";
import Stripe from 'stripe';
import { strictEqual } from "assert";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2022-11-15",
});

export default stripe

// export const getStripe = async () => {
//     // return new Stripe(process.env.STRIPE_SECRET_KEY as string);
//     // return await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)
//     return new stripe(process.env.STRIPE_SECRET_KEY)
// }

export const addMissing = async () => {
    console.log('Populating...')
    const products = await prisma.product.findMany({
        select: {
            id: true
        }
    })
    const stripeProducts = (await stripe.products.list()).data
    const stripeIds = stripeProducts.map(sp => sp.id)
    for (let i = 0; i < products.length; i++) {
        if (stripeIds.includes(products[i].id)) continue
        addProduct(products[i].id)
    }
    console.log('Done')
}

export const addProduct = async (productId: string) => {
    // const stripe = await getStripe()
    const product = await prisma.product.findUnique({
        where: {
            id: productId
        }
    })
    if (product) {
        const stripeProduct = await stripe.products.create({
            name: product.name,
            id: product.id,
            description: product.description,
            default_price_data: {
                currency: 'eur',
                unit_amount_decimal: String(product.price * 100) // cents
            }
        });
        await prisma.product.update({
            where: {
                id: productId
            },
            data: {
                stripeId: stripeProduct.default_price as string
            }
        })
        return stripeProduct
    }
}

export const updateProduct = async (product: Product) => {
    const stripeProduct = await stripe.products.update(product.id, {
        name: product.name,
        description: product.description,
        default_price: String(product.price * 100) // cents
    });
    return stripeProduct
}

export const deleteProduct = async (productId: string) => {
    const res = await stripe.products.del(productId)
    return res.deleted
}
