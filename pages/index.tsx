import { GetStaticProps, InferGetServerSidePropsType } from "next";
import Product from "@/components/Product";
import prisma from "@/lib/prisma";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Head from "next/head";

// const inter = Inter({ subsets: ["latin"] });
type ProductType = {
  id: string;
  name: string;
  image: string;
  altText: string;
  description: string;
  price: number;
};

const PRODUCTS_PER_PAGE = 8;

export default function Home({
  products,
}: InferGetServerSidePropsType<typeof getStaticProps>) {
  const [page, setPage] = useState<number>(0);

  return (
    <main className="flex flex-col-reverse justify-between md:justify-start md:flex-col items-center p-12 md:px-24 h-screen">
      <Head>
        <title>
          Ecommerce demo website by Kalin Doychev
        </title>
        <meta
          name="description"
          content="This is a side project to practice my Web Dev Skill. For more information check out the about page."
        />
        <meta
          property="og:title"
          content="Ecommerce demo website by Kalin Doychev"
        />
        <meta
          property="og:description"
          content="This is a side project to practice my Web Dev Skill. For more information check out the about page."
        />
        <meta
          property="og:image"
          content="https://kalind-ecommerce.com/next.svg"
        />
        <meta
          property="og:image:secure"
          content="https://kalind-ecommerce.com/next.svg"
        />
        <meta property="og:url" content="https://kalind-ecommerce.com/" />
        <meta
          name="keywords"
          content="demo, web dev, ecommerce"
        />
        <link rel="canonical" href="https://kalind-ecommerce.com/" />
      </Head>
      <div className="flex flex-row w-full justify-end m-2">
        <div>
          <Button
            disabled={page === 0}
            onClick={() => setPage((prevPage) => prevPage - 1)}
          >
            Prev
          </Button>
        </div>
        <div className="text-lg bold px-2 flex flex-col justify-center">
          <div className="h-fit">{page + 1}</div>
        </div>
        <div>
          <Button
            disabled={
              page + 1 >= Math.ceil(products.length / PRODUCTS_PER_PAGE)
            }
            onClick={() => setPage((prevPage) => prevPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4 lg:gap-4 overflow-y-scroll overflow-x-hidden">
        {products
          .slice(PRODUCTS_PER_PAGE * page, PRODUCTS_PER_PAGE * (page + 1))
          .map((product: ProductType) => (
            <Product key={product.id} {...product} />
          ))}
      </div>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const database_products = await prisma.product.findMany();
  const products = database_products.map((p) => {
    let product = {
      id: p.id,
      name: p.name,
      image: p.image,
      altText: p.altText,
      description: p.description,
      price: p.price,
    };
    return product;
  });
  return {
    props: { products },
    revalidate: 10,
  };
};
