import React, { useState, MouseEvent } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
// import Button from "./Button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
  const [transform, setTransform] = useState("");
  const THRESHOLD = 3;
  const router = useRouter();

  function handleHover(e: MouseEvent<HTMLDivElement>) {
    const { clientX, clientY, currentTarget } = e;
    const { clientWidth, clientHeight, offsetLeft, offsetTop } = currentTarget;

    const horizontal = (clientX - offsetLeft) / clientWidth;
    const vertical = (clientY - offsetTop) / clientHeight;
    const rotateX = (THRESHOLD / 2 - horizontal * THRESHOLD).toFixed(2);
    const rotateY = (vertical * THRESHOLD - THRESHOLD / 2).toFixed(2);
    setTransform(
      `perspective(${clientWidth}px) rotateX(${rotateY}deg) rotateY(${rotateX}deg) scale3d(1, 1, 1)`
    );
  }

  function resetStyles(e: MouseEvent<HTMLDivElement>) {
    setTransform(
      `perspective(${e.currentTarget.clientWidth}px) rotateX(0deg) rotateY(0deg)`
    );
  }

  return (
    <Card
      className="hover:translate-z product cursor-pointer flex flex-col justify-between text-center"
      onMouseMove={handleHover}
      onMouseLeave={resetStyles}
      style={{ transform: transform }}
      onClick={() => router.push(`product/${id}`)}
    >
      <CardHeader>
        <h1>{name.substring(0, 30) + (name.length > 30 ? "..." : "")}</h1>
      </CardHeader>
      <CardContent>
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
