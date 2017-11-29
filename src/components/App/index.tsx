import { lightBaseTheme, MuiThemeProvider } from "material-ui/styles";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import * as React from "react";
// tslint:disable-next-line:import-name
import * as injectTapEventPlugin from "react-tap-event-plugin";

import { Form } from "../Form";

const lightMuiTheme = getMuiTheme(lightBaseTheme);

injectTapEventPlugin();

/**
 * Entry Point of the application
 *
 * @export
 * @function App
 * @returns {React.SFC}
 */
// tslint:disable:variable-name
export const App: React.SFC = props => (
  <MuiThemeProvider muiTheme={lightMuiTheme}>
    <div className="App">
      <Form />
    </div>
  </MuiThemeProvider>
);
