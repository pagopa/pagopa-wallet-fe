import * as dotenv from "dotenv";
import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

const container = document.getElementById("root");
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
dotenv.config({ path: __dirname + `/.env.${process.env.NODE_ENV}` });
root.render(
  <>
    <React.StrictMode>
      <App></App>
    </React.StrictMode>
  </>
);
