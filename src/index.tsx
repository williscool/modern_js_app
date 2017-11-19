import * as React from "react";
import * as ReactDOM from "react-dom";
import Hello from "./components/Hello";
import { APP_CONTAINER_SELECTOR } from "./config";
import "./styles/main.css";

ReactDOM.render(
  <Hello name="Webpack and TypeScript" enthusiasmLevel={25} />,
  document.querySelector(APP_CONTAINER_SELECTOR) as HTMLElement
);
