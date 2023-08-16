import Product from "@/components/Product";
import { TableProduct } from "@/components/TableProduct";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Modal from "@/components/Modal";
import CreateProductForm from "@/components/CreateProductForm";
import ProductsTable from "@/components/ProductsTable";

type ProductProps = {
  ps: Product[];
};

const Products = ({ ps }: ProductProps) => {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(ps);
  const router = useRouter();

  if (status === "loading") {
    return <div className="p-20">Loading...</div>;
  }

  if (session?.user.role !== "ADMIN") {
    throw new Error("You do not have permission to access this page!");
  }

  return (
    <div className="h-screen overflow-y-hidden pt-12 pb-24 bg-no-repeat">
    <div id="modal-root"></div>
        {isOpen && (
          <Modal onClose={() => setIsOpen(false)}>
            <CreateProductForm setIsOpen={setIsOpen} />
          </Modal>
        )}
      <div className="flex w-full justify-end p-2">
        <Button onClick={() => setIsOpen(true)}>Add product</Button>
        {/* <Button onClick={() => {router.push('/createProduct')}}>Add product</Button> */}
      </div>
      <ProductsTable products={products} setProducts={setProducts}/>
      {/* <table className="w-full h-full border-collapse text-center">
        <thead className="w-full table-fixed table ">
          <tr>
            <th colSpan={2}>Product</th>
            <th>Description</th>
            <th>Price</th>
            <th>Accessability Text</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody className="block h-full pb-10 overflow-auto w-full table-fixed">
          {ps.map((p) => (
            <TableProduct
              p={p}
              setProducts={setProducts}
              key={`product-${p.id}`}
            />
          ))}
        </tbody>
      </table> */}
    </div>
  );
};

export default Products;

export const getStaticProps = async () => {
  const ps = await prisma.product.findMany();

  return {
    props: {
      ps,
    },
  };
};
