import { OrderBookCurrency } from "./utilities";

export interface GdaxProduct {
  id: string;
  base_currency: string;
  quote_currency: string;
  base_min_size: number;
  base_max_size: number;
  quote_increment: number;
  display_name: string;
  status: string;
  margin_enabled: boolean;
  status_message: string;
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
      output[baseCurrency][quoteCurrency] = OrderBookCurrency.BASE;
    }

    if (!output[quoteCurrency]) {
      output[quoteCurrency] = {};
      output[quoteCurrency][baseCurrency] = OrderBookCurrency.QUOTE;
    }

    if (!output[baseCurrency][quoteCurrency]) {
      output[baseCurrency][quoteCurrency] = OrderBookCurrency.BASE;
    }

    if (!output[quoteCurrency][baseCurrency]) {
      output[quoteCurrency][baseCurrency] = OrderBookCurrency.QUOTE;
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
 * @param {string} OrderBookCurrencyName
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

  if (ph[baseCurrencyName][quoteCurrency] === OrderBookCurrency.BASE) {
    pName = `${baseCurrencyName}-${quoteCurrency}`;
  } else if (ph[baseCurrencyName][quoteCurrency] === OrderBookCurrency.QUOTE) {
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
 * @returns {OrderBookCurrency}
 */
export function orderBookCurrencyType(productName: string, base: string) {
  const [productBase] = productName.split("-");

  return productBase === base
    ? OrderBookCurrency.BASE
    : OrderBookCurrency.QUOTE;
}
