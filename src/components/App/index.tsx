import * as React from "react";
import { Hello } from "../Hello";

/**
 * Entry Point of the application
 *
 * @export
 * @function App
 * @returns {React.SFC}
 */
// tslint:disable:variable-name
export const App: React.SFC = props => (
  <div className="App">
    <Hello name="Webpack and TypeScript" enthusiasmLevel={25} />,
  </div>
);
