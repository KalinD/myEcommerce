import React from "react";
import prisma from "@/lib/prisma";
import Head from "next/head";

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

const UserPage = ({ user, username }: { user: User; username: string }) => {
  return (
    <div className="mt-20 px-10">
      <Head>
        <title>{username}</title>
        <meta
          name="description"
          content="Here you can view your previous orders."
        />
        <meta property="og:title" content={username} />
        <meta
          property="og:description"
          content="Here you can view your previous orders."
        />
        <meta property="og:image" content="https://www.kalind-ecommerce.com/" />
        <meta
          property="og:image:secure"
          content="https://www.kalind-ecommerce.com/"
        />
        <meta
          property="og:url"
          content={`https://www.kalind-ecommerce.com/${username}`}
        />
        <meta name="keywords" content="user, orders, ecommrce, demo" />
        <link
          rel="canonical"
          href={`https://www.kalind-ecommerce.com/${username}`}
        />
      </Head>
      <ul>
        {user &&
          user.orders.map((order, index) => (
            <li className=" list-item" key={`order-${index}`}>
              <ul key={`order-${order.id}-${order.products.length}`}>
                {order.products.map((p, pIndex) => (
                  <li
                    key={`product-${order.id}-${p.productId}`}
                    className=" list-item"
                  >
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

export const getServerSideProps = async ({
  params: { username },
}: {
  params: { username: string };
}) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: username }, { name: username }, { email: username }],
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
    props: { user, username },
  };
};
