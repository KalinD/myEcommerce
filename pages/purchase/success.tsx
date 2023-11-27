import { useCart } from "@/context/CartContext";
import React, { useEffect, useState } from "react";
import Head from "next/head";

const Success = () => {
  const { confirmPurchase, clearCart } = useCart();
  const [response, setResponse] = useState<null | {
    message?: string;
    error?: string;
  }>(null);

  useEffect(() => {
    async function confirm() {
      try {
        const data: { message?: string; error?: string } = await confirmPurchase();
        setResponse(data);
        if(!data.error){
          clearCart()
        }
      } catch (e) {
        console.log(e);
      }
    }
    confirm();
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
        <meta
          property="og:url"
          content="https://kalind-ecommerce.com/success"
        />
        <meta name="keywords" content="purchase, ecommrce, demo" />
        <link rel="canonical" href="https://kalind-ecommerce.com/success" />
      </Head>
      <div className="p-4">
        {!response && <div className="text-red-600">Loading...</div>}
        {response && (
          <div>
            {response.error && (
              <span className="text-red-600">{response.error}</span>
            )}
            {response.message && <span>{response.message}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Success;
