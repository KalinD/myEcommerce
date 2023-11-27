import React from "react";
import type {
  InferGetStaticPropsType,
  GetStaticProps,
  GetStaticPaths,
} from "next";
import { ParsedUrlQuery } from "querystring";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import Head from "next/head";

type Product = {
  id: string;
  name: string;
  image: string;
  altText: string;
  description: string;
  price: number;
};

const DEFAULT_PRODUCT: Product = {
  id: "",
  name: "Not Found",
  image: "Not Found",
  altText: "Not Found",
  description: "Product was not found",
  price: 0,
};

interface Params extends ParsedUrlQuery {
  id: string;
}

type PathType = {
  params: {
    id: string;
  };
};

const ProductPage = ({
  product,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { addProduct } = useCart();

  if (!product) return <div>Error</div>;

  return (
    <div className="pt-10 px-4 flex flex-col gap-2 md:gap-4 h-full">
      <Head>
        <title>{product.name}</title>
        <meta
          name="description"
          content={product.description}
        />
        <meta property="og:title" content={product.name} />
        <meta
          property="og:description"
          content={product.description}
        />
        <meta property="og:image" content={`https://www.kalind-ecommerce.com${product.image}`} />
        <meta
          property="og:image:secure"
          content={`https://www.kalind-ecommerce.com${product.image}`}
        />
        <meta property="og:url" content={`https://www.kalind-ecommerce.com/product/${product.id}`} />
        <meta name="keywords" content={`product, ${product.name}, ecommrce, demo`} />
        <link rel="canonical" href={`https://www.kalind-ecommerce.com/product/${product.id}`} />
      </Head>
      <div className="font-bold text-lg md:text-xl">
        <h1>{product.name}</h1>
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="relative w-1/2 h-1/2 px-10 md:px-0">
          <Image
            src={product.image}
            alt={product.altText}
            width={400}
            height={400}
            unoptimized={true}
          />
        </div>
        <div className="flex flex-col gap-4 px-2 pt-2 md:px-5 md:pt-5 lg:px-10 lg:pt-10 justify-betwen">
          <div className="bg-white bg-opacity-70 p-2 md:p-4 rounded-lg">
            {product.description}
          </div>
          <div className="flex flex-row justify-end gap-4">
            <div className="flex flex-col justify-center">
              {(product.price / 100).toFixed(2)}€
            </div>
            <div>
              <Button onClick={() => addProduct({ ...product, amount: 1 })}>
                Add to cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps<{
  product: Product;
}> = async ({ params }) => {
  const { id } = params as Params;
  const prismaReq = await prisma.product.findFirst({
    where: { id: id },
  });
  let product: Product = DEFAULT_PRODUCT;
  if (prismaReq) {
    product = { ...prismaReq, id: prismaReq.id, altText: prismaReq.altText };
  }
  return { props: { product: { ...product } } };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const ids = (await prisma.product.findMany()).map((p) => p.id);
  const paths: PathType[] = [];
  ids.forEach((id) => {
    paths.push({ params: { id: String(id) } });
  });
  return {
    paths: paths,
    fallback: true,
  };
};

export default ProductPage;
