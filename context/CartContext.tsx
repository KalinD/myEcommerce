import {
  ReactElement,
  createContext,
  useState,
  useContext,
  useEffect,
  MouseEventHandler,
} from "react";

type Product = {
  id: string;
  name: string;
  image: string;
  altText: string;
  description: string;
  price: number;
  amount: number;
};

export interface CartState {
  products: Product[];
  count: number;
  addProduct: (product: Product) => void;
  removeOneProduct: (product: Product) => void;
  removeAllProduct: (product: Product) => void;
  clearCart: () => void;
  getTotalCost: () => number;
  handlePurchase: () => void;
}

const defaultState: CartState = {
  products: [],
  count: 0,
  addProduct: () => {},
  removeOneProduct: () => {},
  removeAllProduct: () => {},
  clearCart: () => {},
  getTotalCost: () => 0,
  handlePurchase: () => {},
};

const CartContext = createContext<CartState>(defaultState);
export default CartContext;

export const CartProvider = ({ children }: { children: ReactElement }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [count, setCount] = useState(0);

  const addProduct = (product: Product) => {
    if (products.find((p) => p.id === product.id)) {
      const productsCopy = [...products];
      const p = productsCopy.find((p) => (p.id === product.id));

      if (p) {
        p.amount += 1;
        setProducts(productsCopy);
      }
    } else {
      setProducts((oldProducts) => [...oldProducts, product]);
    }
    setCount((oldCount) => oldCount + 1);
  };

  const handlePurchase = async () => {
    const res = await fetch('/api/purchase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(products.map(p => ({id: p.id})))
    })
  }

  const removeOneProduct = (product: Product) => {
    if (products.filter((p) => p.id === product.id)) {
      const productsCopy = [...products];
      const p = productsCopy.find((p) => (p.id = product.id));
      if (p) {
        p.amount -= 1;
        if (p.amount <= 0) {
          setProducts(productsCopy.filter((p) => p.id !== product.id));
        } else {
          setProducts(productsCopy);
        }
      }
      setCount((oldCount) => oldCount - 1);
    }
  };

  const getTotalCost = () => {
    let sum = 0;
    products.forEach((p) => (sum += p.price * p.amount));
    return sum;
  };

  const removeAllProduct = (product: Product) => {
    setCount((prevCount) => prevCount - product.amount);
    setProducts((prevProducts) => prevProducts.filter((p) => p != product));
  };

  const clearCart = () => {
    setProducts([]);
    setCount(0);
  };

  const contextData: CartState = {
    products,
    count,
    addProduct,
    removeOneProduct,
    removeAllProduct,
    clearCart,
    getTotalCost,
    handlePurchase
  };

  return (
    <CartContext.Provider value={contextData}>{children}</CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
