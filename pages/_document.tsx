import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="text-text bg-background px-2 pt-1 md:px-4 md:pt-2 min-h-screen">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
