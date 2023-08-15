import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import {
  GetServerSideProps,
  GetStaticProps,
  InferGetServerSidePropsType,
} from "next";

type Cart = {
  products: Product[];
};

type Product = {
  id: string;
  name: string;
  image: string;
  altText: string;
  description: string;
  price: number;
};

type ProductToOrder = {
  orderId: string;
  productId: string;
  product: Product;
  amount: number;
}

type Order = {
  id: string;
  products: ProductToOrder[];
};

type User = {
  id: string;
  name?: string;
  username?: string;
  password?: string;
  email?: string;
  emailVerified?: Date;
  image?: string;
  carts: Cart[];
  orders: Order[];
};

const User = ({ user, order }: { user: User, order: Order }) => {
  return (
    <div className="mt-20">
      <div className="border border-accent w-fit h-fit">{user?.name}</div>
      <div className="border border-accent w-fit h-fit">{user?.username}</div>
      <div className="border border-accent w-fit h-fit">{user?.email}</div>
      <div>
        {user.orders.map((order, index) => 
          <div key={`order-${order.id}-${order.products.length}`} className="border border-accent">
            {order.products.map((p, pIndex) => 
              <div key={`product-${index}-${p.productId}`} className="border border-primary">
                {p.product.name} - {p.amount}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default User;

export const getStaticProps = async ({
  params: { username },
}: {
  params: { username: string };
}) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        {
          username: username,
        },
        { name: username },
        { email: username },
      ],
    },
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      image: true,
      orders: {
        include: {
          products: {
            include:{
              product: true
            }
          }
        }
      }
    },
  });
  console.log(user)

  return {
    props: { user },
  };
};

export async function getStaticPaths() {
  const users = await prisma.user.findMany({
    select: {
      username: true,
      name: true,
      email: true,
    },
  });
  const paths = users.map((user) => ({
    params: { username: user.username || user.name || user.email },
  }));

  return {
    paths,
    fallback: false,
  };
}
