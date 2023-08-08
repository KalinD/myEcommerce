import Button from "@/components/Button";
import Product from "@/components/Product";
import { TableProduct } from "@/components/TableProduct";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

type ProductProps = {
  products: Product[];
};

const Products = ({ products }: ProductProps) => {
  const { data: session, status } = useSession();
  const router = useRouter()

  if(status === 'loading'){
    return <div className="p-20">Loading...</div>
  }

  if (session?.user.role !== 'ADMIN') {
    throw new Error("You do not have permission to access this page!");
  }

  return (
    <div className="h-screen overflow-y-hidden pt-12 pb-24 bg-no-repeat">
        <div className="flex w-full justify-end p-2">
            <Button onClick={() => {router.push('/createProduct')}}>Add product</Button>
        </div>
      <table className="w-full h-full border-collapse text-center">
        <thead  className="w-full table-fixed table ">
          <tr>
            <th colSpan={2}>Product</th>
            <th>Description</th>
            <th>Price</th>
            <th>Accessability Text</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody className="block h-full pb-10 overflow-auto w-full table-fixed">
          {products.map((p) => (
            <TableProduct p={p} key={`product-${p.id}`} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;

export const getStaticProps = async () => {
  const products = await prisma.product.findMany();

  return {
    props: {
      products,
    },
  };
};
