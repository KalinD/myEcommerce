import { GetStaticProps, InferGetServerSidePropsType } from "next";
import Product from "@/components/Product";
import prisma from "@/lib/prisma";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import { addMissing } from "@/lib/utils/stripe";

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

  const buttonClasses = "p-0 md:p-0 lg:px-2 lg:py-0.5 bg-accent";

  return (
    <main className="flex flex-col-reverse justify-between md:justify-start md:flex-col items-center p-12 md:px-24 h-screen ">
      <div className="flex flex-row w-full justify-end">
        <div>
          <Button
            className={buttonClasses}
            disabled={page === 0}
            onClick={() => setPage((prevPage) => prevPage - 1)}
          >
            {"<"}
          </Button>
        </div>
        <div className="text-lg bold px-2">{page + 1}</div>
        <div>
          <Button
            className={buttonClasses}
            disabled={
              page + 1 === Math.ceil(products.length / PRODUCTS_PER_PAGE)
            }
            onClick={() => setPage((prevPage) => prevPage + 1)}
          >
            {">"}
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
