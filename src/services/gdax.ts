// URL from url works for types and stuff in test but does not work correctly once built in dev
// import { URL } from "url";
import { URL } from "whatwg-url";
import {
  enumerateProducts,
  GdaxProduct,
  getOrderBookOutputCurrencyType,
  getProductName
} from "../utils/enumerateProducts";
import { generateQuote } from "../utils/generateQuote";
import { Actions, OrderBookOutputCurrency } from "../utils/utilities";
import { validateGdaxOrder } from "../utils/validateGdaxOrder";

/**
 * Constructs api error objects
 *
 * @param {Response} response
 * @returns {GdaxExchangeErrorContainer}
 */
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
    this.baseUrl = new URL(`${API_URL}${ENDPOINTS.products}`);
  }
  /**
   * Lets you get the json for a specific product
   *
   * @param {string} productName
   * @memberof GdaxService
   */
  public getProductJSONByName(productName: string) {
    return this.productsJson.filter(
      (obj: GdaxProduct) => obj.id === productName
    )[0];
  }
  /**
   * Call to fetch to actually get stuff from server
   *
   * @private
   * @param {URL} url
   * @returns {Promise}
   * @memberof GdaxService
   */
  private async fetcher(url: URL) {
    this.ok = false;
    this.errorObj = {};
    let response = null;
    let data;

    try {
      response = await fetch(url.toString());
      this.ok = response.ok;
      if (response.status >= 400 && response.status <= 599) {
        this.ok = false;
        // request error
        this.errorObj = buildApIErrorContainer(response);
      }
      data = await response.json();

      if (!this.ok) {
        this.errorObj.message = data.message;
        this.errorObj.error = new Error(this.errorObj.message);
        throw this.errorObj.error;
      }
    } catch (error) {
      this.ok = false;

      // malformed content error most likely server can return json
      // whatever it is pass it along
      if (this.errorObj && !this.errorObj.message) {
        this.errorObj.error = error;
      }

      if (!this.errorObj) {
        // unknown error likely a connection error. or something
        this.errorObj = {};
        this.errorObj.kind = "unknown";
        this.errorObj.error = error;
      }

      throw this.errorObj.error;
    }

    return data;
  }
  // get the product types has and store them and associate them with their url
  /**
   * Initialize the gdax service
   *
   * @returns
   * @memberof GdaxService
   */
  public async init() {
    let response: [GdaxProduct];

    response = await this.fetcher(this.baseUrl);
    this.productsJson = response;
    this.productExchangeHash = enumerateProducts(this.productsJson);

    return response;
  }

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
  public async getQuote(
    base: string,
    quote: string,
    action: Actions,
    amount: number
  ) {
    // use productExchangeHash to figure out url
    const productName = getProductName(this.productExchangeHash, base, quote);

    if (!productName) {
      throw new Error(
        `currency exchange product ${base}-${quote} does not exist.`
      );
    }

    const obQutputType = getOrderBookOutputCurrencyType(productName, base);

    const currentProductJson = this.getProductJSONByName(productName);

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
    const quoteURL = new URL(`${this.baseUrl.toString()}/${productName}/book`);
    // set query params
    // tslint:disable-next-line:no-backbone-get-set-outside-model
    quoteURL.searchParams.set("level", "2");

    const orderBook = await this.fetcher(quoteURL);

    // generate a quote for the amount
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

      throw this.errorObj.error;
    }

    // if after all of that validation we get then return successful resolve with order
    return output;
  }
}
