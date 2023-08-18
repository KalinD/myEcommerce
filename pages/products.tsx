import Product from "@/components/Product";
import { TableProduct } from "@/components/TableProduct";
import prisma from "@/lib/prisma";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/Modal";
import ProductForm from "@/components/ProductForm";
import ProductsTable from "@/components/ProductsTable";

type ProductProps = {
  ps: Product[];
};

const Products = ({ ps }: ProductProps) => {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product>()
  const [products, setProducts] = useState<Product[]>(ps);
  
  useEffect(() => {
    if(!isOpen){
      setEditProduct(undefined)
    }
  }, [isOpen])

  if (status === "loading") {
    return <div className="p-20">Loading...</div>;
  }

  if (session?.user.role !== "ADMIN") {
    throw new Error("You do not have permission to access this page!");
  }

  return (
    <div className="h-screen overflow-y-hidden pt-12 px-10 pb-24 bg-no-repeat">
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <ProductForm setIsOpen={setIsOpen} product={editProduct} setProducts={setProducts} />
        </Modal>
      )}
      <div className="flex w-full justify-end p-2">
        <Button onClick={() => setIsOpen(true)}>Add product</Button>
      </div>
      <ProductsTable products={products} setProducts={setProducts} setEditProduct={setEditProduct} setIsOpen={setIsOpen} />
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
