import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root.tsx";
import Connect from "./routes/connect.tsx";
import Database from "./routes/database/index.tsx";
import TableWithSchema from "./routes/database/tableWithSchema.tsx";
import ErrorPage from "./error-page";
import { ChakraProvider } from "@chakra-ui/react";
import "./styles/globals.css";
import { EditorProvider } from "./common/hooks/useEditor.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [],
  },
  { path: "/connect", element: <Connect /> },
  {
    path: "/:database",
    element: <Database />,
    children: [{ path: ":tableWithSchema", element: <TableWithSchema /> }],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider>
      <EditorProvider>
        <RouterProvider router={router} />
      </EditorProvider>
    </ChakraProvider>
  </React.StrictMode>
);
