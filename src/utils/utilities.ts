/**
 * Delinates the action for the currencies
 *
 * Done this way you could add new Actions easily
 *
 * https://stackoverflow.com/questions/36633033/how-to-organize-typescript-interfaces/36636368#36636368
 *
 * @enum {string}
 */
export enum Actions {
  BUY = "Buy",
  SELL = "Sell"
}

/**
 * Enum to signify based on the product from gdax if this currency is the base or quote
 *
 * I use to to signify which currency to generate a quote in
 *
 * @export
 * @enum {string}
 */
export enum OrderBookOutputCurrency {
  BASE = "base",
  QUOTE = "quote"
}

// tslint:disable:strict-boolean-expressions
// tslint:disable:no-parameter-reassignment
/**
 * Decimal adjustment of a number.
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor
 *
 * @param {String}  type  The type of adjustment.
 * @param {Number}  value The number.
 * @param {Number} exp   The exponent (the 10 logarithm of the adjustment base).
 * @returns {Number} The adjusted value.
 */
function decimalAdjust(kind: string, value: number, exp?: number) {
  // If the exp is undefined or zero...
  if (!exp) {
    return Math[kind](value);
  }
  value = +value;
  exp = +exp;

  // dont need this check because we can be sure our input will be a number.
  // YAY typescript
  // If the value is not a number or the exp is not an integer...
  // if (isNaN(value) || !(typeof exp === "number" && exp % 1 === 0)) {
  //   return NaN;
  // }
  // Shift
  let valueStr = value.toString().split("e");
  value = Math[kind](
    +`${valueStr[0]}e${valueStr[1] ? +valueStr[1] - exp : -exp}`
  );

  valueStr = value.toString().split("e");

  // Shift back
  return +`${valueStr[0]}e${valueStr[1] ? +valueStr[1] + exp : exp}`;
}

/**
 * Decimal round
 *
 * @export
 * @param {number} value
 * @param {number} exp
 * @returns {number} rounded to nearest 10s place
 */
export function round10(value: number, exp: number) {
  return decimalAdjust("round", value, exp);
}

/**
 *  Decimal floor
 *
 * @export
 * @param {number} value
 * @param {number} exp
 * @returns {number} floored to nearest 10s place
 */
export function floor10(value: number, exp: number) {
  return decimalAdjust("floor", value, exp);
}

/**
 * Decimal ceil
 *
 * @export
 * @param {number} value
 * @param {number} exp
 * @returns {number} ceiling to nearest 10s place
 */
export function ceil10(value: number, exp: number) {
  return decimalAdjust("ceil", value, exp);
}

// tslint:enable:no-parameter-reassignment
// tslint:enable:strict-boolean-expressions
