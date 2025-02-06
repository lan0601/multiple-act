import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
          integrity="sha384-whatever-hash"
          crossOrigin="anonymous"
        />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
