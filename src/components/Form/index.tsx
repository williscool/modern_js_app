import MenuItem from "material-ui/MenuItem";
import RaisedButton from "material-ui/RaisedButton";
import SelectField from "material-ui/SelectField";
import TextField from "material-ui/TextField";
import * as React from "react";
import { amountIsValid } from "../../utils/amountIsValid";
import { Actions } from "../../utils/utilities";

/**
 * Delinates the currency types.
 *
 * Will get moved to the discovery class that calls the api
 *
 * @enum {number}
 */
export enum Curriences {
  USD = "USD",
  BTC = "BTC",
  LTC = "LTC"
}

/**
 * Its a form in react
 *
 * TODO: need to update this so that part of the constructor input is an enum of the curriences
 *
 * and the default base and quote currency
 *
 * @export
 * @class Form
 * @extends {React.Component}
 */
export class Form extends React.Component {
  /**
   * State of the component
   *
   *
   * @memberof Form
   */

  public state = {
    actions: Object.keys(Actions).map(k => Actions[k]),
    current_action: Actions.BUY,
    curriences: Object.keys(Curriences).map(k => Curriences[k]),
    base: Curriences.USD,
    quote: Curriences.BTC,
    amount: "",
    actionErrorText: "",
    baseErrorText: "",
    quoteErrorText: "",
    amountErrorText: ""
  };

  /**
   * Change handler for select form inputs
   *
   * @private
   * @memberof Form
   */
  private handleSelectFieldChange = (
    e: __MaterialUI.TouchTapEvent,
    keyName: string,
    index?: number,
    value?: string
  ) => {
    this.setState({
      [keyName]: value
    });
  };

  /**
   * Validate the currency amount input
   *
   * I got a lot of my inspiration from how this input works from
   *
   * https://secure.ally.com/#/bank/transfer-funds
   *
   * I hate trying to type into text boxes that wont let you type intermediate somewhat invalid input
   * while you get to a valid value so I looked to a place that I feel has good UX around that
   *
   * On submit I will use parseFloat to strip out any leading zeros
   *
   * @private
   * @memberof Form
   */
  private handleAmountTextFieldChange = (
    e: React.FormEvent<{}>,
    value: string
  ) => {
    // allows the input to be empty, or optionally have a decimal as long as its a number
    if (amountIsValid(value)) {
      // now that we know we have a valid value remove
      this.setState({
        amount: value
      });
    }
  };
  /**
   * Submit handler for form
   *
   * @private
   * @param {React.MouseEvent<>} e
   * @memberof Form
   */
  private onSubmit(e: React.MouseEvent<{}>) {
    e.preventDefault();
    // console.log(this.state);
    // TODO: add form stuff here
  }

  /**
   * Standard return of jsx component
   *
   * @returns
   * @memberof Form
   */
  public render() {
    return (
      <form>
        <SelectField
          className="action"
          value={this.state.current_action}
          onChange={(e, i, v) =>
            this.handleSelectFieldChange(e, "current_action", i, v)
          }
          floatingLabelText="Action"
          floatingLabelFixed={true}
          errorText={this.state.actionErrorText}
        >
          {this.state.actions.map((v: string, i) => {
            return <MenuItem key={i} value={v} primaryText={v} />;
          })}
        </SelectField>
        <br />
        <SelectField
          className="base"
          value={this.state.base}
          onChange={(e, i, v) => this.handleSelectFieldChange(e, "base", i, v)}
          floatingLabelText="Base Currency"
          floatingLabelFixed={true}
          errorText={this.state.baseErrorText}
        >
          {this.state.curriences
            .filter(v => v !== this.state.quote)
            .map((v, i) => {
              return <MenuItem key={i} value={v} primaryText={v} />;
            })}
        </SelectField>
        <br />
        <SelectField
          className="quote"
          value={this.state.quote}
          onChange={(e, i, v) => this.handleSelectFieldChange(e, "quote", i, v)}
          floatingLabelText="Quote Currency"
          floatingLabelFixed={true}
          errorText={this.state.quoteErrorText}
        >
          {this.state.curriences
            .filter(v => v !== this.state.base)
            .map((v, i) => {
              return <MenuItem key={i} value={v} primaryText={v} />;
            })}
        </SelectField>
        <br />
        <TextField
          className="amount"
          name="amount"
          hintText="10.00"
          value={this.state.amount}
          onChange={(e, v) => this.handleAmountTextFieldChange(e, v)}
          floatingLabelText="Amount"
          floatingLabelFixed={true}
          errorText={this.state.amountErrorText}
        />
        <br />
        <br />
        <RaisedButton
          label="Submit"
          onClick={e => this.onSubmit(e)}
          primary={true}
        />
        <p> {JSON.stringify(this.state, null, 2)} </p>
      </form>
    );
  }
}
