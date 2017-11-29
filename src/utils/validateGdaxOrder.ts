import { GdaxExchangeErrorContainer } from "../services/gdax";
import { GdaxProduct } from "./enumerateProducts";
import { GdaxOrderBookQuote } from "./generateQuote";
import { OrderBookOutputCurrency } from "./utilities";

/**
 * Validate order for things like if the amount is too large or it is not fillable
 *
 * @param {GdaxOrderBookQuote} order
 * @param {OrderBookOutputCurrency} obQutputType
 * @param {GdaxProduct} product
 * @param {number} amount
 * @returns {Object} i
 */
export function validateGdaxOrder(
  order: GdaxOrderBookQuote,
  obQutputType: OrderBookOutputCurrency,
  product: GdaxProduct,
  amount: number
) {
  let errorObj: GdaxExchangeErrorContainer = {};

  let { base_max_size, base_min_size } = product;

  // error if we cant fill order
  if (!order.fillable) {
    errorObj = buildValidationErrorContainer(
      `Could not fill order with open ${order.bookUsed}`
    );
  }

  if (order.quotePrice && obQutputType === OrderBookOutputCurrency.BASE) {
    // if the output is base adjust base min and max with quotePrice
    base_max_size *= 1 / order.quotePrice;
    base_min_size *= 1 / order.quotePrice;
  }

  // error if amount is too much
  if (amount < base_min_size || amount > base_max_size) {
    errorObj = buildAmountErrorContainer(amount, base_max_size);
  }

  return {
    errorObj,
    isValid: !errorObj.error
  };
}

/**
 * checks input amount of currency
 *
 * @param {number} amount
 * @param {number} baseMax
 * @returns
 */
function buildAmountErrorContainer(amount: number, baseMax: number) {
  let message = "Amount out of bounds.";

  if (amount > baseMax) {
    message = `Too Large. ${message}`;
  } else {
    message = `Too Small. ${message}`;
  }

  return buildValidationErrorContainer(message);
}

/**
 * Builds an error object for any validation errors
 *
 * @param {string} message
 * @returns
 */
function buildValidationErrorContainer(message: string) {
  const errorObj: GdaxExchangeErrorContainer = {};

  errorObj.kind = "validation";
  errorObj.message = message;
  errorObj.error = new Error(errorObj.message);

  return errorObj;
}
