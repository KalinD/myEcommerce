import React from "react";
import prisma from "@/lib/prisma";
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
};

type Order = {
  id: string;
  orderedOn: Date;
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

const UserPage = ({ user, order }: { user: User; order: Order }) => {
  return (
    <div className="mt-20">
      <ul>
        {user && user.orders.map((order, index) => (
          <li className=" list-item" key={`order-${index}`}>
            <ul key={`order-${order.id}-${order.products.length}`}>
              {order.products.map((p, pIndex) => (
                <li key={`product-${order.id}-${p.productId}`} className=" list-item">
                  {p.product.name} - {p.amount}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserPage;

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
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

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
