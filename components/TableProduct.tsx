import { Product } from "@prisma/client";
import React, { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image";
import Button from "./Button";
import { useRouter } from "next/router";

type TableProductProps = {
  p: Product;
  setProducts: Dispatch<SetStateAction<Product[]>>;
};

export const TableProduct = ({ p, setProducts }: TableProductProps) => {
  const [product, setProduct] = useState<Product>(p);
  const router = useRouter()

  const handleChange = async () => {
    const res = await fetch(``)
  };

  const handleDelete = async () => {
    const res = await fetch(`http://127.0.0.1:3000/api/product/${product.id}`, {
        method: 'DELETE'
    })
    if(res.status === 204) router.reload()
  };

  return (
    <tr className="table-fixed border-t border-accent table h-48 w-full">
      <td><Image src={product.image} alt={product.altText} width={250} height={250} /></td>
      <td>{product.name}</td>
      <td>
        <div className="block w-full h-full overflow-y-auto flex flex-col justify-center">
          {product.description}
        </div>
      </td>
      <td>{product.price}</td>
      <td>{product.altText}</td>
      <td>
        <div className="flex flex-row justify-evenly">
          <Button onClick={handleChange}>Save Changes</Button>
          <Button onClick={handleDelete}>Delete</Button>
        </div>
      </td>
    </tr>
  );
};
