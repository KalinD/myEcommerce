import { useCart } from "@/context/CartContext";
import Image from "next/image";
import React, { useState, useEffect, MouseEventHandler } from "react";
import { Button } from "@/components/ui/button";

export default function Cart() {
  const {
    products,
    clearCart,
    removeOneProduct,
    removeAllProduct,
    addProduct,
    count,
    getTotalCost,
    // handlePurchase
  } = useCart();
  const [totalAmount, setTotalAmount] = useState(getTotalCost());

  useEffect(() => {
    setTotalAmount(getTotalCost());
  }, [count]);

  const handlePurchase = async () => {
    const res = await fetch('/api/purchase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(products.map(p => p.id))
    })
  }
  

  return (
    <div className="py-10 h-full">
      <div className="flex flex-row justify-end">
        <div className="text-secondary">
          <button onClick={clearCart}>Empty Cart</button>
        </div>
      </div>
      {count > 0 ? (
        <div className="flex flex-col">
          <div>
            <table className="w-full border-collapse text-center">
              <thead className="w-full table-fixed table">
                <tr>
                  <th colSpan={2}>Item</th>
                  <th>Single Price</th>
                  <th>Total Price</th>
                  <th>Amount</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="block h-96 overflow-auto w-full table-fixed">
                {products.map((product) => {
                  return (
                    <tr
                      key={product.id}
                      className="h-14 table-fixed table w-full"
                    >
                      <td className="border-t border-accent flex justify-center">
                        <div className="relative h-24 w-24">
                          <Image
                            src={product.image}
                            fill
                            alt={product.altText}
                            unoptimized={true}
                          />
                        </div>
                      </td>
                      <td className="border-t border-accent">
                        {product.name.slice(0, 25) +
                          (product.name.length > 25 ? "..." : "")}
                      </td>
                      <td className="border-t border-accent">
                        {product.price.toFixed(2)}€
                      </td>
                      <td className="border-t border-accent">
                        {(product.price * product.amount).toFixed(2)}€
                      </td>
                      <td className="border-t border-accent">
                        <button onClick={() => addProduct(product)}>+</button>
                        {` ${product.amount} `}
                        <button onClick={() => removeOneProduct(product)}>
                          -
                        </button>
                      </td>
                      <td className="border-t border-accent">
                        <button onClick={() => removeAllProduct(product)}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end flex-row w-full self-end gap-2 mg:gap-3 lg:gap-4">
            <div className="flex justify-center flex-col text-center text-lg">
              Total amount: {totalAmount.toFixed(2)}€
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
