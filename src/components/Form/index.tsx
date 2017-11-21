import MenuItem from "material-ui/MenuItem";
import RaisedButton from "material-ui/RaisedButton";
import SelectField from "material-ui/SelectField";
import TextField from "material-ui/TextField";
import * as React from "react";

/**
 * How is this not built into the language?
 * https://stackoverflow.com/a/21294925/511710
 * https://noahbass.com/posts/typescript-enum-iteration
 *
 * @param {{}} e
 * @returns
 */
function filterEnum(e: {}) {
  return Object.keys(e).filter(v => isNaN(Number(v)));
}

/**
 * Delinates the action for the currencies
 *
 * Done this way you could add new Actions easily
 *
 * @enum {number}
 */
enum Actions {
  Buy,
  Sell
}

const ACTION_TYPES = filterEnum(Actions);

/**
 * Delinates the currency types.
 *
 * Will get moved to the discovery class that calls the api
 *
 * @enum {number}
 */
enum Curriences {
  USD,
  BTC,
  LTC
}

const CURRENCY_TYPES = filterEnum(Curriences);

/**
 * Its a form in react
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
    actions: ACTION_TYPES,
    curriences: CURRENCY_TYPES,
    action_index: Actions.Buy,
    base_currency_index: Curriences.USD,
    quote_currency_index: Curriences.BTC,
    amount: 0.0
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
   * Take the value from the
   *
   * @private
   * @memberof Form
   */
  private handleAmountTextFieldChange = (
    e: React.FormEvent<{}>,
    value: string
  ) => {
    let amt = Number(value);

    if (isNaN(amt)) {
      amt = 0;
    }

    this.setState({
      amount: Number(value)
    });
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
          value={this.state.action_index}
          onChange={(e, i, v) =>
            this.handleSelectFieldChange(e, "action_index", i, v)
          }
          floatingLabelText="Action"
          floatingLabelFixed={true}
        >
          {this.state.actions.map((v, i) => {
            return <MenuItem key={i} value={i} primaryText={v} />;
          })}
        </SelectField>
        <br />
        <SelectField
          value={this.state.base_currency_index}
          onChange={(e, i, v) =>
            this.handleSelectFieldChange(e, "base_currency_index", i, v)
          }
          floatingLabelText="Base Currency"
          floatingLabelFixed={true}
        >
          {this.state.curriences.map((v, i) => {
            return <MenuItem key={i} value={i} primaryText={v} />;
          })}
        </SelectField>
        <br />
        <SelectField
          value={this.state.quote_currency_index}
          onChange={(e, i, v) =>
            this.handleSelectFieldChange(e, "quote_currency_index", i, v)
          }
          floatingLabelText="Quote Currency"
          floatingLabelFixed={true}
        >
          {this.state.curriences.map((v, i) => {
            return <MenuItem key={i} value={i} primaryText={v} />;
          })}
        </SelectField>
        <br />
        <br />
        <TextField
          name="amount"
          hintText="10.00"
          value={this.state.amount}
          onChange={(e, v) => this.handleAmountTextFieldChange(e, v)}
          floatingLabelText="Amount"
          floatingLabelFixed={true}
        />
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
