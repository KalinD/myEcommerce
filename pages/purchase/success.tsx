import { useCart } from "@/context/CartContext";
import React, { useEffect } from "react";

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

  return <div className="py-20">Thank you for your purchase!</div>;
};

export default Success;
