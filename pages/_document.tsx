import { Html, Head, Main, NextScript } from "next/document";
import { ThemeProvider } from "@/components/theme-provider";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="text-text bg-background min-h-screen">
          <Main />
          <NextScript />
      </body>
    </Html>
  );
}
