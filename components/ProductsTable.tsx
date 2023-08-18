import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import Product from "./Product";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Image from "next/image";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

type ProductsTableProps = {
  products: Product[];
  setProducts: Dispatch<SetStateAction<Product[]>>;
  setEditProduct: Dispatch<SetStateAction<Product | undefined>>;
  setIsOpen: Dispatch<SetStateAction<boolean>>
};

const ProductsTable = ({ products, setProducts, setEditProduct, setIsOpen }: ProductsTableProps) => {
  const imageInput = useRef<HTMLInputElement[]>([]);
  const [images, setImages] = useState<Blob[]>([]);
  //   const router = useRouter();

    const handleDelete = async (productId: string) => {
      const res = await fetch(`/api/product/${productId}`, {
        method: "DELETE",
      });
      if (res.status === 204) {
        setProducts((oldProducts) => oldProducts.filter(p => p.id !== productId))
      };
    };

  return (
    <Table className="w-full h-full border-collapse text-center">
      <TableHeader className="w-full table-fixed table">
        <TableRow>
          <TableHead colSpan={2} className="text-center">Product</TableHead>
          <TableHead className="text-center">Description</TableHead>
          <TableHead className="text-center">Price</TableHead>
          <TableHead className="text-center">Accessability Text</TableHead>
          <TableHead className="text-center">Options</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="block h-full pb-10 overflow-auto w-full table-fixed">
        {products.map((product, index) => (
          <TableRow
            key={product.id}
            className="table-fixed border-t border-accent table h-48 w-full"
          >
            <TableCell className="relative cursor-pointer flex justify-center">
              <Image
                src={product.image}
                alt={product.altText}
                width={250}
                height={250}
                className="h-32 w-auto z-0"
                onClick={() => imageInput.current[index]?.click()}
              />
              <Input
                ref={(el) =>
                  (imageInput.current[index] = el as HTMLInputElement)
                }
                type="file"
                className="hidden"
                onChange={(e) => {
                  setImages((oldImages) => {
                    oldImages[index] = (
                      e.target.files ? e.target.files[0] : undefined
                    ) as Blob;
                    return oldImages;
                  });
                }}
              />
              {images[index] && (
                <Image
                  src={images[index] ? URL.createObjectURL(images[index]) : ""}
                  width={100}
                  height={100}
                  alt="new image"
                  className="max-h-[50%] max-w-[50%] absolute top-0 right-0"
                />
              )}
            </TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell><div className="h-32 overflow-auto">{product.description}</div></TableCell>
            <TableCell>{product.price.toFixed(2)}</TableCell>
            <TableCell>{product.altText}</TableCell>
            <TableCell className="h-full">
                <Button className="m-1" onClick={() => {setEditProduct(product); setIsOpen(true)}}>Edit</Button>
                <Button className="m-1 bg-red-500 hover:bg-red-500/90" onClick={() => handleDelete(product.id)}>Delete</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProductsTable;
