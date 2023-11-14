import React from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
// import Button from "./Button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { useRouter } from "next/router";

type Product = {
  id: string;
  name: string;
  image: string;
  altText: string;
  description: string;
  price: number;
};

const Product = ({ id, name, image, description, altText, price }: Product) => {
  const { addProduct } = useCart();
  const router = useRouter();

  return (
    <Card className={`flex flex-col justify-between text-center animate-[fade-in_500ms_ease-in-out_1]`}>
      <CardHeader
        className="cursor-pointer"
        onClick={() => router.push(`/product/${id}`)}
      >
        <h1>{name.substring(0, 30) + (name.length > 30 ? "..." : "")}</h1>
      </CardHeader>
      <CardContent
        className="cursor-pointer"
        onClick={() => router.push(`/product/${id}`)}
      >
        <div className="relative h-60 w-full">
          <Image
            src={image}
            alt={altText}
            fill
            unoptimized={true}
            className="object-contain"
          />
        </div>
        <div>
          <p>
            {description.substring(0, 100) +
              (description.length > 100 ? "..." : "")}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-row justify-evenly w-full">
          <div className="flex flex-col justify-center">
            <div>{(price / 100).toFixed(2)}€</div>
          </div>
          <div>
            <Button
              onClick={() => {
                addProduct({
                  id,
                  name,
                  image,
                  altText,
                  description,
                  price,
                  amount: 1,
                });
              }}
            >
              Add to cart
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Product;
