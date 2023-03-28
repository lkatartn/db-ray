import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { EditorProvider } from "@/common/hooks/useEditor";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <EditorProvider>
        <Component {...pageProps} />
      </EditorProvider>
    </ChakraProvider>
  );
}
