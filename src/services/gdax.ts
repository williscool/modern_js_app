import { URL } from "url";
import {
  enumerateProducts,
  GdaxProduct,
  getOrderBookOutputCurrencyType,
  getProductName
} from "../utils/enumerateProducts";
import { GdaxOrderBook, generateQuote } from "../utils/generateQuote";
import { Actions, OrderBookOutputCurrency } from "../utils/utilities";
import { validateGdaxOrder } from "../utils/validateGdaxOrder";

function buildApIErrorContainer(response: Response) {
  const errorObj: GdaxExchangeErrorContainer = {};
  errorObj.statusCode = response.status;
  errorObj.statusText = response.statusText;
  // default to client error
  errorObj.kind = "client";

  if (response.status >= 500 && response.status <= 599) {
    errorObj.kind = "server";
  }

  return errorObj;
}

export interface GdaxExchangeErrorContainer {
  kind?: string;
  statusCode?: number;
  statusText?: string;
  message?: string;
  error?: Error;
}

/**
 * Gdax url
 */
export const API_URL = "https://api.gdax.com";

/**
 * endpoints on url
 */
export const ENDPOINTS = {
  products: "/products"
};

/**
 * Service used to communicate with the gdax api
 *
 * get all the products
 * associate them with there url i.e.
 * for BTC->USD and USD->BTC /BTC-USD/book?level=2
 *
 * @export
 * @class GdaxService
 */
export class GdaxService {
  /**
   * URL object of url for requesting quotes from the gdax api
   *
   * @type {URL}
   * @memberof GdaxService
   */
  public baseUrl: URL;
  /**
   * After init is called. Was the gdax service setup correctly
   *
   * @type {boolean}
   * @memberof GdaxService
   */
  public ok: boolean;
  /**
   * Internal cache of json for product types
   *
   * @type {[{}]}
   * @memberof GdaxService
   */
  public productsJson: [GdaxProduct];
  /**
   * Hash used to tell which currencies can be exchanged for each other
   *
   * @type {{}}
   * @memberof GdaxService
   */
  public productExchangeHash: {};
  /**
   * Object used to store error information for communincating with the gdax api
   *
   * @type {GdaxExchangeErrorContainer}
   * @memberof GdaxService
   */
  public errorObj: GdaxExchangeErrorContainer;
  constructor() {
    this.productExchangeHash = {};
    this.baseUrl = new URL(`${API_URL}${ENDPOINTS.products}`);
  }
  /**
   * Call to fetch to actually get stuff from server
   *
   * @private
   * @param {URL} url
   * @returns {Promise}
   * @memberof GdaxService
   */
  private fetcher(url: URL) {
    this.ok = true;
    this.errorObj = {};

    return new Promise((resolve, reject) => {
      fetch(url.toString())
        .then(response => {
          this.ok = response.ok;

          if (response.status >= 400 && response.status <= 599) {
            this.ok = false;
            // request error
            this.errorObj = buildApIErrorContainer(response);
          }

          return response.json();
        })
        .then(response => {
          if (this.ok) {
            return resolve(response);
          }
          // response not ok add the message from the json
          this.errorObj.message = response.message;
          this.errorObj.error = new Error(this.errorObj.message);

          return reject(this.errorObj.error);
        })
        .catch(error => {
          this.ok = false;
          // likely either a network error or a parsing error
          this.errorObj.kind = "unknown";
          this.errorObj.error = error;

          reject(this.errorObj.error);
        });
    });
  }
  // get the product types has and store them and associate them with their url
  /**
   * Initialize the gdax service
   *
   * @returns
   * @memberof GdaxService
   */
  public init() {
    return this.fetcher(this.baseUrl).then((response: [GdaxProduct]) => {
      this.productsJson = response;
      this.productExchangeHash = enumerateProducts(this.productsJson);
    });
  }

  // use generateQuote util
  // to make sure to start loading animation before this
  /**
   * Get the quote
   *
   * @param {string} base
   * @param {string} quote
   * @param {Actions} action
   * @param {number} amount
   * @returns
   * @memberof GdaxService
   */
  public getQuote(
    base: string,
    quote: string,
    action: Actions,
    amount: number
  ) {
    // use productExchangeHash to figure out url
    const productName = getProductName(this.productExchangeHash, base, quote);

    return new Promise((resolve, reject) => {
      if (!productName) {
        return reject(
          new Error(
            `currency exchange product ${base}-${quote} does not exist.`
          )
        );
      }

      const obQutputType = getOrderBookOutputCurrencyType(productName, base);

      const currentProductJson = this.productsJson.filter(
        (obj: GdaxProduct) => obj.id === productName
      )[0];

      const { quote_increment } = currentProductJson;

      // default to satoshi
      // https://en.bitcoin.it/wiki/Satoshi_(unit)
      let increment = 8;

      // if the quote currency is what we will output use its quote increment
      if (obQutputType === OrderBookOutputCurrency.QUOTE) {
        // decimal places
        increment = quote_increment.toString().split(".")[1].length;
      }

      // build orderbook url
      const quoteURL = new URL(
        `${this.baseUrl.toString()}/${productName}/book`
      );
      // set query params
      // tslint:disable-next-line:no-backbone-get-set-outside-model
      quoteURL.searchParams.set("level", "2");

      return this.fetcher(quoteURL)
        .then((response: GdaxOrderBook) => {
          // generate a quote for the amount

          const orderBook = response;
          const output = generateQuote(
            orderBook,
            obQutputType,
            action,
            amount,
            increment
          );

          const { isValid, errorObj: validationErrorObj } = validateGdaxOrder(
            output,
            obQutputType,
            currentProductJson,
            amount
          );

          if (!isValid) {
            this.errorObj = validationErrorObj;

            return reject(this.errorObj.error);
          }

          // if after all of that validation we get then return successful resolve with order
          return resolve(output);
        })
        .catch(err => {
          // pass along fetcher errors
          return reject(err);
        });
    });
  }
}
