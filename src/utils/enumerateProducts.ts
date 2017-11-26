import { QuoteCurrency } from "./utilities";

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
      output[baseCurrency][quoteCurrency] = QuoteCurrency.BASE;
    }

    if (!output[quoteCurrency]) {
      output[quoteCurrency] = {};
      output[quoteCurrency][baseCurrency] = QuoteCurrency.QUOTE;
    }

    if (!output[baseCurrency][quoteCurrency]) {
      output[baseCurrency][quoteCurrency] = QuoteCurrency.BASE;
    }

    if (!output[quoteCurrency][baseCurrency]) {
      output[quoteCurrency][baseCurrency] = QuoteCurrency.QUOTE;
    }
  });

  return output;
}
