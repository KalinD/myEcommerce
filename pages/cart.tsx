import { useCart } from "@/context/CartContext";
import Image from "next/image";
import React, { useState, useEffect, MouseEventHandler } from "react";
import { Button } from "@/components/ui/button";
import CartTable from "@/components/CartTable";

export default function Cart() {
  const {
    products,
    clearCart,
    count,
    getTotalCost,
    handlePurchase,
  } = useCart();
  const [totalAmount, setTotalAmount] = useState(getTotalCost());

  useEffect(() => {
    setTotalAmount(getTotalCost());
  }, [count]);

  return (
    <div className="pt-10 pb-20 h-full px-10">
      <div className="flex flex-row justify-end">
        <div>
          <button onClick={clearCart}>Empty Cart</button>
        </div>
      </div>
      {count > 0 ? (
        <div className="flex flex-col h-full">
          <div className="h-full">
            <CartTable products={products} />
          </div>
          <div className="flex justify-end flex-row w-full h-fit self-end gap-2 mg:gap-3 lg:gap-4">
            <div className="flex justify-center flex-col text-center text-lg">
              Total amount: {(totalAmount / 100).toFixed(2)}€
            </div>
            <div>
              <Button onClick={handlePurchase}>Purchase</Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center pt-10 md:pt-16 ld:pt-20">
          Your Cart is empty
        </div>
      )}
    </div>
  );
}
