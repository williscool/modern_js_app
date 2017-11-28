import { URL } from "url";
import {
  enumerateProducts,
  getProductName,
  orderBookCurrencyType
} from "../utils/enumerateProducts";
import { generateQuote } from "../utils/generateQuote";
import { Actions } from "../utils/utilities";

interface GdaxEchangeErrorContainer {
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
  public productsJson: [{}];
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
   * @type {GdaxEchangeErrorContainer}
   * @memberof GdaxService
   */
  public errorObj: GdaxEchangeErrorContainer;
  constructor() {
    this.productExchangeHash = {};
    this.baseUrl = new URL(`${API_URL}${ENDPOINTS.products}`);
  }
  // get the product types has and store them and associate them with their url
  /**
   * Initialize the gdax service
   *
   * @returns
   * @memberof GdaxService
   */
  public init() {
    return new Promise((resolve, reject) => {
      fetch(this.baseUrl.toString())
        .then(response => {
          this.ok = response.ok;

          if (response.status >= 400 && response.status <= 599) {
            this.ok = false;
            // request error
            this.errorObj = {};
            this.errorObj.statusCode = response.status;
            this.errorObj.statusText = response.statusText;
            // default to client error
            this.errorObj.kind = "client";

            if (response.status >= 500 && response.status <= 599) {
              this.errorObj.kind = "server";
            }
          }

          return response.json();
        })
        .then(response => {
          if (this.ok) {
            // covers all 200 codes
            // now we can get products hash in rest of app
            this.productsJson = response;
            this.productExchangeHash = enumerateProducts(this.productsJson);

            return resolve();
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

    // TODO: test error handling for this and getting qutoes
    return new Promise((resolve, reject) => {
      if (!productName) {
        return reject(
          new Error(
            `currency exchange product ${base}-${quote} does not exist.`
          )
        );
      }

      // TODO: also reject here on stuff like base max or min being too high here

      const quoteURL = new URL(`${this.baseUrl.toString()}/${productName}`);

      const obType = orderBookCurrencyType(productName, base);
      // set query params
      // tslint:disable-next-line:no-backbone-get-set-outside-model
      quoteURL.searchParams.set("level", "2");

      fetch(quoteURL.toString())
        .then(response => {
          if (response.status === 200) {
            return response.json();
          }
          // TODO: throw differnt errors to catch based on api response
          throw new Error("Something went wrong on api server!");
        })
        .then(response => {
          // resolve with the quote amount here
          const orderBook = response;
          const output = generateQuote(orderBook, obType, action, amount);
          resolve(output); // now we can get products hash in rest of app
        })
        .catch(error => {
          // TODO: let UI know things went wrong
          reject(error);
        });
    });
  }
}
