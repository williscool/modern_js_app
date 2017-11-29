import { OrderBookOutputCurrency } from "./utilities";

export interface GdaxProduct {
  readonly id: string;
  readonly base_currency: string;
  readonly quote_currency: string;
  readonly base_min_size: number;
  readonly base_max_size: number;
  readonly quote_increment: number;
  readonly display_name: string;
  readonly status: string;
  readonly margin_enabled: boolean;
  readonly status_message: string | null;
}

/**
 * Input products json.
 *
 * Output: object with currency exchangability that is an object where the keys
 * are the currencies and their values are object of currencies you can exchange them to
 *
 * you can call Object.keys on the values to get a list of all the exchange keys
 *
 * @export
 * @param {string} p
 *
 * @returns {{}} currency exchange object
 */
export function enumerateProducts(p: [{}]) {
  const output = {};

  p.forEach((obj: GdaxProduct) => {
    const id = obj.id;

    const baseCurrency = id.split("-")[0];
    const quoteCurrency = id.split("-")[1];

    if (!output[baseCurrency]) {
      output[baseCurrency] = {};
      output[baseCurrency][quoteCurrency] = OrderBookOutputCurrency.BASE;
    }

    if (!output[quoteCurrency]) {
      output[quoteCurrency] = {};
      output[quoteCurrency][baseCurrency] = OrderBookOutputCurrency.QUOTE;
    }

    if (!output[baseCurrency][quoteCurrency]) {
      output[baseCurrency][quoteCurrency] = OrderBookOutputCurrency.BASE;
    }

    if (!output[quoteCurrency][baseCurrency]) {
      output[quoteCurrency][baseCurrency] = OrderBookOutputCurrency.QUOTE;
    }
  });

  return output;
}

/**
 * Return the name of the product for a given base and quote currency.
 *
 * based on their gdax orderbook product name
 *
 * @export
 * @param {{}} ph hash of product names
 * @param {string} baseCurrencyName
 * @param {string} OrderBookOutputCurrencyName
 * @returns
 */
export function getProductName(
  ph: {},
  baseCurrencyName: string,
  quoteCurrency: string
) {
  if (!ph[baseCurrencyName] || !ph[baseCurrencyName][quoteCurrency]) {
    return false;
  }

  let pName = "";

  if (ph[baseCurrencyName][quoteCurrency] === OrderBookOutputCurrency.BASE) {
    pName = `${baseCurrencyName}-${quoteCurrency}`;
  } else if (
    ph[baseCurrencyName][quoteCurrency] === OrderBookOutputCurrency.QUOTE
  ) {
    pName = `${quoteCurrency}-${baseCurrencyName}`;
  }

  return pName;
}

/**
 * Get the type of currency the input base is in the product orderbook
 *
 * @export
 * @param {string} productName
 * @param {string} base
 * @returns {OrderBookOutputCurrency}
 */
export function getOrderBookOutputCurrencyType(
  productName: string,
  base: string
) {
  const [productBase] = productName.split("-");

  return productBase === base
    ? OrderBookOutputCurrency.QUOTE
    : OrderBookOutputCurrency.BASE;
}
