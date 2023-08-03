import { GetStaticProps, InferGetServerSidePropsType } from "next";
import Product from "@/components/Product";
import prisma from "@/lib/prisma";

// const inter = Inter({ subsets: ["latin"] });
type ProductType = {
  id: number;
  name: string;
  image: string;
  altText: string;
  description: string;
  price: number;
};

export default function Home({
  products,
}: InferGetServerSidePropsType<typeof getStaticProps>) {
  return (
    <main className="flex flex-col items-center justify-between p-10 md:px-24 ">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4 lg:gap-4 ">
        {products.map((product: ProductType) => (
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
      id: Number(p.id),
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
