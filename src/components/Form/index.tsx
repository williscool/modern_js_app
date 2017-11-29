import CircularProgress from "material-ui/CircularProgress";
import MenuItem from "material-ui/MenuItem";
import RaisedButton from "material-ui/RaisedButton";
import SelectField from "material-ui/SelectField";
import TextField from "material-ui/TextField";
import * as React from "react";
import { GdaxService } from "../../services/gdax";
import { amountIsValid } from "../../utils/amountIsValid";
import { getProductName } from "../../utils/enumerateProducts";
import { GdaxOrderBookQuote } from "../../utils/generateQuote";
import { Actions } from "../../utils/utilities";

// tslint:disable:no-single-line-block-comment

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
 * and the default base and quote currency
 *
 * @export
 * @class Form
 * @extends {React.Component}
 */
export class Form extends React.Component {
  /**
   * Service used to communicate with Gdax Api
   *
   * @type {GdaxService}
   * @memberof Form
   */
  public gdax: GdaxService;
  /**
   * State of the component
   *
   * @memberof Form
   */
  public state = {
    isLoaded: false,
    actions: Object.keys(Actions).map(k => Actions[k]),
    current_action: Actions.BUY,
    base_curriences: [],
    quote_curriences: [],
    base: "",
    quote: "",
    amount: "",
    price: "",
    total: "",
    actionErrorText: "",
    baseErrorText: "",
    quoteErrorText: "",
    amountErrorText: ""
  };

  /**
   * Callback for component in dom
   *
   * https://reactjs.org/docs/react-component.html#componentdidmount
   *
   * @memberof Form
   */
  public componentDidMount() {
    // init the gdax service
    this.gdax = new GdaxService();

    // would store this in like local storage and not need to do it on every load

    this.gdax
      .init()
      .then(() => {
        const baseCurriences = Object.keys(this.gdax.productExchangeHash);
        const initBaseCurrency = baseCurriences.filter(k => k === "BTC")[0];

        const quoteCurriences = Object.keys(
          this.gdax.productExchangeHash[initBaseCurrency]
        );
        const initQuoteCurrency = quoteCurriences.filter(k => k === "USD")[0];

        this.setState({
          ...this.state,
          isLoaded: true,
          base: initBaseCurrency,
          quote: initQuoteCurrency,
          base_curriences: baseCurriences,
          quote_curriences: quoteCurriences
        });
      })
      .catch(err => {
        this.handleErrors(err);
      });
  }

  /**
   * Returns the range a quote can be in
   *
   * @returns
   * @memberof Form
   */
  public rangeText() {
    let output = "";

    if (this.state.isLoaded) {
      const productName = getProductName(
        this.gdax.productExchangeHash,
        this.state.base,
        this.state.quote
      );

      if (productName) {
        const [productBase] = productName.split("-");
        const currentProductJson = this.gdax.getProductJSONByName(productName);
        const { base_max_size, base_min_size } = currentProductJson;

        output = ` (${base_min_size} - ${base_max_size} in ${productBase})`;
      }
    }

    return output;
  }

  /**
   * deal with promise errors
   *
   * @private
   * @memberof Form
   */
  private handleErrors(error: Error) {
    // default to assuming its an error the gdax service handled;
    let amountErrorText =
      this.gdax.errorObj.error && this.gdax.errorObj.error.toString();

    if (!amountErrorText) {
      amountErrorText = error.toString();
    }

    this.setState({
      amountErrorText
    });
  }
  /**
   * clear the form and gdax service of errors
   *
   * @private
   * @memberof Form
   */
  private clearErrors() {
    this.gdax.errorObj = {};
    this.setState({
      amountErrorText: ""
    });
  }
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
    if (keyName === "base" && value) {
      // need to update the possible quote currencies
      const newQuoteCurs = Object.keys(this.gdax.productExchangeHash[value]);
      this.setState({
        quote_curriences: newQuoteCurs,
        quote: newQuoteCurs[0]
      });
    }

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
   * On submit I use parseFloat to strip out any leading zeros
   *
   * @private
   * @memberof Form
   */
  private handleAmountTextFieldChange = (
    e: React.FormEvent<{}>,
    value: string
  ) => {
    if (value === "") {
      // if they clear the amount clear the error
      this.clearErrors();
    }
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

    // clear old errors and quote
    this.clearErrors();
    this.setState({
      price: "",
      total: ""
    });

    // put form into loading start again
    this.setState({
      isLoaded: false
    });

    let inputAmount = 0;

    if (this.state.amount !== "") {
      inputAmount = parseFloat(this.state.amount);
    }

    this.setState({
      amount: inputAmount
    });

    this.gdax
      .getQuote(
        this.state.base,
        this.state.quote,
        this.state.current_action,
        inputAmount
      )
      .then((output: GdaxOrderBookQuote) => {
        this.setState({
          isLoaded: true,
          price: output.quotePrice,
          total: output.total
        });
      })
      .catch(err => {
        // here you could use the error object kind to display the error in different place
        // i.e. client or server errors could be an overlay
        // this app is simple enough though that just showing in the amount area area under form works fine
        this.handleErrors(err);

        // let user try again
        this.setState({
          isLoaded: true
        });
      });
  }

  /**
   * Just generates the markup for the loading spinner
   *
   * @private
   * @returns
   * @memberof Form
   */
  private loadingMarkup() {
    return (
      <div className="form_loading_indicator">
        loading... <CircularProgress />
      </div>
    );
  }

  /**
   * Standard return of jsx component
   *
   * @returns
   * @memberof Form
   */
  public render() {
    let loader = null;

    if (!this.state.isLoaded) {
      loader = this.loadingMarkup();
    }

    return (
      <form>
        <h2>Gdax Crypto Currency Exchange Quoter</h2>
        <p className="subtitle">
          Pick your currencies, input your amount, and find your prices!
        </p>
        {loader}
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
          disabled={!this.state.isLoaded}
        >
          {this.state.base_curriences.map((v, i) => {
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
          disabled={!this.state.isLoaded}
        >
          {this.state.quote_curriences.map((v, i) => {
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
          floatingLabelText={`Amount${this.rangeText()}`}
          floatingLabelFixed={true}
          errorText={this.state.amountErrorText}
        />
        <br />
        <br />
        <RaisedButton
          label="Submit"
          onClick={e => this.onSubmit(e)}
          primary={true}
          disabled={!this.state.isLoaded}
        />
        <p> Currency: {this.state.quote} </p>
        <p> Price: {this.state.price} </p>
        <p> Total: {this.state.total} </p>

        {/* <p> {JSON.stringify(this.state, null, 2)} </p> */}
      </form>
    );
  }
}
