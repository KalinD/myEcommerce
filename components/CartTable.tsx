import { Product, useCart } from "../context/CartContext";
import React from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";

const CartTable = ({ products }: { products: Product[] }) => {
  const { addProduct, removeOneProduct, removeAllProduct } = useCart();

  return (
    <Table className="w-full h-full border-collapse text-center overflow-clip">
      <TableHeader className="w-full table-fixed table">
        <TableRow>
          <TableHead colSpan={2} className="text-center">
            Item
          </TableHead>
          <TableHead className="text-center">Single Price</TableHead>
          <TableHead className="text-center">Total Price</TableHead>
          <TableHead className="text-center">Amount</TableHead>
          <TableHead className="text-center"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="block h-full pb-10 overflow-auto w-full table-fixed">
        {products.map((product) => (
          <TableRow key={`product-${product.id}`} className="table-fixed border-t border-accent table h-48 w-full">
            <TableCell>
              <div className="flex flex-col justify-center">
                <Image
                  src={product.image}
                  width={100}
                  height={100}
                  alt={product.altText}
                  unoptimized={true}
                />
              </div>
            </TableCell>
            <TableCell>
              {product.name.slice(0, 25) +
                (product.name.length > 25 ? "..." : "")}
            </TableCell>
            <TableCell>{(product.price / 100).toFixed(2)}€</TableCell>
            <TableCell>
              {((product.price * product.amount) / 100).toFixed(2)}€
            </TableCell>
            <TableCell>
              <Button onClick={() => addProduct(product)}>+</Button>
              {` ${product.amount} `}
              <Button onClick={() => removeOneProduct(product)}>-</Button>
            </TableCell>
            <TableCell>
              <Button onClick={() => removeAllProduct(product)}>Remove</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CartTable;
