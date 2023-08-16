import React, { Dispatch, useRef, useState } from "react";
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

type ProductsTableProps = {
  products: Product[];
  setProducts: Dispatch<Product[]>;
};

const ProductsTable = ({ products, setProducts }: ProductsTableProps) => {
//   const { register } = useForm<Product>({
//     defaultValues: {
//       name: "",
//       description: "",
//       price: 0,
//       altText: "",
//     },
//     // resolver: zodResolver(productSchema),
//   });
  const imageInput = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<Blob>();
//   const router = useRouter();

//   const handleDelete = async (productId: string) => {
//     const res = await fetch(`http://127.0.0.1:3000/api/product/${productId}`, {
//       method: "DELETE",
//     });
//     if (res.status === 204) router.reload();
//   };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead colSpan={2}>Product</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Accessability Text</TableHead>
            <TableHead>Edit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} className="h-10">
              <TableCell> hello
              {/* <Image
                  src={product.image}
                  alt={product.altText}
                  width={250}
                  height={250}
                  onClick={() => imageInput.current?.click()}
                /> */}
                {/* <Input
                  ref={imageInput}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    setImage(e.target.files ? e.target.files[0] : undefined);
                  }}
                />
                {image && (
                  <Image
                    src={image ? URL.createObjectURL(image) : ""}
                    width={100}
                    height={100}
                    alt="new image"
                    className="max-h-[50%] max-w-[50%] absolute top-0 right-0"
                  />
                )} */}
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.altText}</TableCell>
              {/* <TableCell>
                <>
                <Image
                  src={product.image}
                  alt={product.altText}
                  width={250}
                  height={250}
                  onClick={() => imageInput.current?.click()}
                />
                <Input
                  ref={imageInput}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    setImage(e.target.files ? e.target.files[0] : undefined);
                  }}
                />
                {image && (
                  <Image
                    src={image ? URL.createObjectURL(image) : ""}
                    width={100}
                    height={100}
                    alt="new image"
                    className="max-h-[50%] max-w-[50%] absolute top-0 right-0"
                  />
                )}</>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductsTable;
