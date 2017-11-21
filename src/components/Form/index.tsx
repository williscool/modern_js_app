import * as React from "react";

interface FormChangeEvent {
  target: {
    name: string;
    value: string;
  };
}

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
   * @memberof Form
   */
  public state = {
    action: "buy",
    base_currency: "",
    quote_currency: "",
    amount: ""
  };

  /**
   * Change handler for form inputs
   *
   * @private
   * @memberof Form
   */
  private handleChange = (e: FormChangeEvent) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  /**
   * Submit handler for form
   *
   * @private
   * @param {React.MouseEvent<HTMLButtonElement>} e
   * @memberof Form
   */
  private onSubmit(e: React.MouseEvent<HTMLButtonElement>) {
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
        <select
          name="action"
          value={this.state.action}
          onChange={e => this.handleChange(e)}
        >
          <option
            role="option"
            aria-selected={this.state.action === "buy"}
            value="buy"
          >
            Buy
          </option>
          <option
            role="option"
            aria-selected={this.state.action === "sell"}
            value="sell"
          >
            Sell
          </option>
        </select>
        <input
          name="base_currency"
          placeholder="Base Currency"
          value={this.state.base_currency}
          onChange={e => this.handleChange(e)}
        />
        <input
          name="quote_currency"
          placeholder="Quote Currency"
          value={this.state.quote_currency}
          onChange={e => this.handleChange(e)}
        />
        <input
          name="amount"
          placeholder="Amount"
          value={this.state.amount}
          onChange={e => this.handleChange(e)}
        />
        <button onClick={e => this.onSubmit(e)}> Submit </button>
        <p> {JSON.stringify(this.state, null, 2)} </p>
      </form>
    );
  }
}
