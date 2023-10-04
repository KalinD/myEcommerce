import { useCart } from "@/context/CartContext";
import React, { useEffect } from "react";
import Head from "next/head";

const Success = () => {
  const { confirmPurchase, clearCart } = useCart();

  useEffect(() => {
    try {
      confirmPurchase();
      clearCart();
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <div className="py-20">
      <Head>
        <title>Purchase Successful!</title>
        <meta
          name="description"
          content="This page is visible if the purchase was successful."
        />
        <meta property="og:title" content="Purchase Successful!" />
        <meta
          property="og:description"
          content="This page is visible if the purchase was successful."
        />
        <meta property="og:image" content="https://kalind-ecommerce.com/" />
        <meta
          property="og:image:secure"
          content="https://kalind-ecommerce.com/"
        />
        <meta property="og:url" content="https://kalind-ecommerce.com/success" />
        <meta name="keywords" content="purchase, ecommrce, demo" />
        <link rel="canonical" href="https://kalind-ecommerce.com/success" />
      </Head>
      Thank you for your purchase!
    </div>
  );
};

export default Success;
