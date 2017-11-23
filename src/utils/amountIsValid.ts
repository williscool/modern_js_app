/**
 * Check if a decimal appears in the input 0 or 1 times
 *
 * How is this not built into a library?
 * @param {string} val
 * @returns {boolean}
 */
function optionallyContainsDecimal(val: string) {
  return val.split("").filter((char, i) => char === ".").length <= 1;
}

/**
 * Check for negative zero
 *
 * http://2ality.com/2012/03/signedzero.html
 * https://abdulapopoola.com/2016/12/19/why-javascript-has-two-zeros-0-and-0/
 *
 * @param {number} x
 * @returns
 */
function isNegativeZero(x: number) {
  return x === 0 && 1 / x < 0;
}

/**
 * Validates an input currency amount
 *
 * Allows the input to be empty and optionally have a decimal
 *
 * as long as its a nonnegative number
 *
 * Could change to regex but could get just as weird when you have limit the number of decmial places.
 *
 *
 * @export
 * @param {string} value
 */
export function amountIsValid(value: string | number) {
  if (value === "") return true;

  const valNum = Number(value);
  const valString = value.toString();

  return (
    !isNaN(valNum) &&
    !isNegativeZero(valNum) &&
    !valString.includes("-") &&
    optionallyContainsDecimal(valString)
  );
}
