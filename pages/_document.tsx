import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <body style={{ height: "100%" }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
