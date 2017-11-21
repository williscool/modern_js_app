import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./components/App";
import { APP_CONTAINER_SELECTOR } from "./config";
import "./styles/main.css";

/**
 * Entry point for the application
 */
ReactDOM.render(<App />, document.querySelector(
  APP_CONTAINER_SELECTOR
) as HTMLElement);
