import Product from "@/components/Product";
import prisma from "@/lib/prisma";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/Modal";
import ProductForm from "@/components/ProductForm";
import ProductsTable from "@/components/ProductsTable";
import Head from "next/head";

type ProductProps = {
  ps: Product[];
};

const Products = ({ ps }: ProductProps) => {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product>();
  const [products, setProducts] = useState<Product[]>(ps);

  useEffect(() => {
    if (!isOpen) {
      setEditProduct(undefined);
    }
  }, [isOpen]);

  if (status === "loading") {
    return <div className="p-20">Loading...</div>;
  }

  if (session?.user.role !== "ADMIN") {
    throw new Error("You do not have permission to access this page!");
  }

  return (
    <div className="h-screen overflow-y-hidden pt-12 px-10 pb-24 bg-no-repeat">
      <Head>
        <title>Update Products | Admin</title>
        <meta
          name="description"
          content="Page to view and edit existing products. Only admins are allowed on this page!"
        />
        <meta property="og:title" content="Update Products | Admin" />
        <meta
          property="og:description"
          content="Page to view and edit existing products. Only admins are allowed on this page!"
        />
        <meta property="og:image" content="https://www.kalind-ecommerce.com/" />
        <meta
          property="og:image:secure"
          content="https://www.kalind-ecommerce.com/"
        />
        <meta property="og:url" content="https://www.kalind-ecommerce.com/products" />
        <meta name="keywords" content="products, ecommrce, demo" />
        <link rel="canonical" href="https://www.kalind-ecommerce.com/products" />
      </Head>
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <ProductForm
            setIsOpen={setIsOpen}
            product={editProduct}
            setProducts={setProducts}
          />
        </Modal>
      )}
      <div className="flex w-full justify-end p-2">
        <Button onClick={() => setIsOpen(true)}>Add product</Button>
      </div>
      <ProductsTable
        products={products}
        setProducts={setProducts}
        setEditProduct={setEditProduct}
        setIsOpen={setIsOpen}
      />
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
