import { useRouter } from "next/router";
import {
  ReactElement,
  createContext,
  useState,
  useContext,
  useEffect
} from "react";
import { useCookies } from "react-cookie";

export type Product = {
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
  tryToLoadFromCookies: () => void;
  confirmPurchase: () => Promise<{
    message?: string | undefined;
    error?: string | undefined;
}>;
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
  tryToLoadFromCookies: () => {},
  confirmPurchase: () => new Promise(() => ({message: "", error: ""})),
};

const CartContext = createContext<CartState>(defaultState);
export default CartContext;

export const CartProvider = ({ children }: { children: ReactElement }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["products", "stripeSessionId"]);
  const [products, setProducts] = useState<Product[]>([]);
  const [count, setCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    tryToLoadFromCookies()
  }, [products])

  const tryToLoadFromCookies = async () => {
    if (cookies.products && count === 0) {
      setProducts(cookies.products);
      setCount(products.reduce((acc, curP) => acc + curP.amount, 0));
    }
  };

  const addProduct = (product: Product) => {
    if (products.find((p) => p.id === product.id)) {
      const productsCopy = [...products];
      const p = productsCopy.find((p) => p.id === product.id);

      if (p) {
        p.amount += 1;
        setProducts(productsCopy);
        setCookie("products", productsCopy);
      }
    } else {
      setProducts((oldProducts) => {
        const res = [...oldProducts, product];
        setCookie("products", res);
        return res;
      });
    }
    setCount((oldCount) => oldCount + 1);
  };

  const handlePurchase = async () => {
    const res = await fetch("/api/purchase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        products.map((p) => ({ id: p.id, amount: p.amount }))
      ),
    });

    if (res.status === 201) {
      // created
      const body: {stripeSessionId: string, redirectUrl: string} = await res.json();
      removeCookie("stripeSessionId")
      setCookie("stripeSessionId", body.stripeSessionId)
      router.push(body.redirectUrl);
    }
  };

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
      setCookie("products", products);
      setCount((oldCount) => oldCount - 1);
    }
  };

  const getTotalCost = () => {
    let sum = 0;
    products.forEach((p) => (sum += p.price * p.amount));
    return sum;
  };

  const confirmPurchase = async () => {
    const res = await fetch("/api/purchase/success", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({stripeSessionId: cookies.stripeSessionId})
    });
    const data: { message?: string, error?: string} = await res.json();
    return data
  };

  const removeAllProduct = (product: Product) => {
    setCount((prevCount) => prevCount - product.amount);
    setProducts((prevProducts) => prevProducts.filter((p) => p != product));
    setCookie("products", products);
  };

  const clearCart = () => {
    setProducts([]);
    removeCookie("products")
    setCookie("products", []);
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
    handlePurchase,
    tryToLoadFromCookies,
    confirmPurchase,
  };

  return (
    <CartContext.Provider value={contextData}>{children}</CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
