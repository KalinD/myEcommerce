import React, { useState, MouseEvent } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
// import Button from "./Button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card } from "./ui/card";

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
    <div
      className="hover:translate-z product p-4"
      onMouseMove={handleHover}
      onMouseLeave={resetStyles}
      style={{ transform: transform }}
    >
      <div className="content h-full flex justify-between flex-col">
        <Link href={`product/${id}`}>
          <div>
            <div className="text-center font-bold text-lg md:text-xl">
              <h1>{name.substring(0, 30) + (name.length > 30 ? "..." : "")}</h1>
            </div>
            <div className="flex justify-center">
              <div className="relative h-60 w-60">
                <Image
                  src={image}
                  alt={altText}
                  fill
                  unoptimized={true}
                  className="object-contain"
                />
              </div>
            </div>
            <div>
              <p>
                {description.substring(0, 100) +
                  (description.length > 100 ? "..." : "")}
              </p>
            </div>
          </div>
        </Link>
        <div className="flex flex-row justify-around">
          <div className="flex flex-col text-accent justify-center">
            <div>{price.toFixed(2)}€</div>
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
      </div>
    </div>
  );
};

export default Product;
