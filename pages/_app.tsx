import { CartProvider } from "@/context/CartContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SessionProvider } from "next-auth/react"

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  
  return (
    <SessionProvider session={session}>
      <CartProvider>
        <>
          <Navbar />
          <Component {...pageProps} />
          <Footer />
        </>
      </CartProvider>
    </SessionProvider>
  );
}
