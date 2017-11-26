import { Actions, QuoteCurrency, round10 } from "./utilities";

// https://github.com/Microsoft/TypeScript/issues/5259
interface GdaxOrderBookEntry extends Array<number | string> {
  0: string;
  1: string;
  2: number;
}

export interface GdaxOrderBook {
  sequence: number;
  // price, size, num-orders
  bids: [GdaxOrderBookEntry];
  asks: [GdaxOrderBookEntry];
}

interface OrderSanityCheck {
  fillable: boolean;
  priceIndicies: number[];
  remainingAmount: number;
}

/**
 * Checks to see that give an amount and an order book we can fill the input order with said book
 *
 * @param {number} amount amount desired
 * @param {[GdaxOrderBookEntry]} openOrders asks or bids
 * @returns {Object} if the quote is fillable, the indicies in the orderbook of prices used, and the amount remaining
 */
function orderIsFillable(
  qc: QuoteCurrency,
  openOrders: [GdaxOrderBookEntry],
  amount: number
) {
  // start off assuming we cannot cover the whole desired amount
  let fillable = false;
  const priceIndicies: number[] = [];
  let remainingAmount = amount;

  for (let i = 0; i <= openOrders.length - 1; i += 1) {
    priceIndicies.push(i);
    const [price, size] = openOrders[i];

    const numSize = parseFloat(size);
    let subtractor = numSize;

    if (qc === QuoteCurrency.BASE) {
      // quote will be in BTC in our example so input is USD
      // so we we need to convert the open amount in this order to USD
      // by multipling the USD price for 1 BTC on this order by the amount out (size)
      subtractor = numSize * parseFloat(price);
    }

    remainingAmount -= subtractor;

    if (remainingAmount <= 0) {
      // stop once we've seen enough currency to cover the order
      break;
    }
  }

  if (remainingAmount <= 0) {
    fillable = true;
  }

  return {
    fillable,
    priceIndicies,
    remainingAmount
  };
}

/**
 * Weighted avg of the prices
 * https://www.investopedia.com/terms/w/weightedaverage.asp
 *
 * @param {number[]} priceIndicies indices in order book of prices used to cover order
 * @param {GdaxOrderBookEntry[]} openOrders asks or bids
 * @param {number} remainingAmount amount remaining that needs to be covered partially by the last order
 * @returns {number} weighted avg quote of prices
 */
function calculateWeightedAvgPrice(
  qc: QuoteCurrency,
  priceIndicies: number[],
  openOrders: GdaxOrderBookEntry[],
  remainingAmount: number
) {
  let totalOrders = 0;

  let numQuote = priceIndicies
    .map((priceIndex, i, arr) => {
      const [price, size, orders] = openOrders[priceIndex];
      const numSize = parseFloat(size);
      const numPrice = parseFloat(price);
      let numOrders = orders;

      if (i === arr.length - 1 && remainingAmount !== 0) {
        // we only used a fraction of the orders out at the last price
        // https://www.mathsisfun.com/definitions/decimal-fraction.html

        let divisor = numSize;

        if (qc === QuoteCurrency.BASE) {
          // we need to use price to get the total currency out in quote currency
          divisor = numSize * numPrice;
        }

        // also remainingAmount is negative since we subtract the size from it
        // so we negate it to get a positive
        const decmialFraction = -remainingAmount / divisor;
        numOrders = numOrders * decmialFraction;
      }

      totalOrders += numOrders;

      return numPrice * numOrders;
    })
    .reduce((prev, num) => prev + num);

  return (numQuote /= totalOrders);
}

/**
 * The application should use the orderbook to determine the best price
 *
 * So the function is calculating the price at which they would buy... NOT the total amount they would pay!
 *
 * We then use that weighted avg price to calculate the total based on the amount
 *
 * Input order book json for a product, which currency to base, to buy or sell, and the amount
 *
 * Output: a quote to buy one currency in the other
 *
 * @export
 * @param {GdaxOrderBook} ob
 * @param {QuoteCurrency} qc
 * @param {Actions} action
 * @param {number} amount
 *
 * @returns {Object} members tell if the order is fillable, quote price, and the total amount
 */
export function generateQuote(
  ob: GdaxOrderBook,
  qc: QuoteCurrency,
  action: Actions,
  amount: number,
  quoteIncrementPlaces: number = 2
) {
  /**
   * examples in the comments use the BTC-USD order book
   * default base of that book
   * BTC === base
   * USD === quote
   * so you could read the name of the book as Quotes for buying and selling BTC in USD
   *
   * There are 3 cases when generating a quote
   *
   * 1. we CANNOT FILL the order with the open asks or bids
   * 2. we can EXACTLY fill the order with the open asks or bids
   * 3. we can fill the order but only use a fraction of the orders out at the last price.
   */
  let orderSanityCheck: OrderSanityCheck = {
    fillable: false,
    priceIndicies: [-1],
    remainingAmount: 0
  };
  let quotePrice = 0;
  let total = 0;

  /**
   * Aggregated levels return only one size for each active price
   * (as if there was only a single order for that size at the level).
   *
   * so I read this as there are X orders of varying sizes out to sell bitcoin at Y price
   * which means whenever we've looked at enough prices to cover the order we are done.
   *
   * you end up using a weighted avg of all of the prices you have to use fill the quote
   */

  if (action === Actions.BUY) {
    // user request quote for a BUY for the base currency (BTC in the mock) in the quote currency (in the mock USD)
    // this means the input amount will be BTC and the quote amount will be USD
    //
    // so we go through asks until we can fill the order
    // ob.asks do some stuff
    orderSanityCheck = orderIsFillable(qc, ob.asks, amount);

    // after orderIsFillable several cases can be true

    // remainingAmount > 0
    // ^ this means there was not enough open asks to cover the quote
    // which mean fillable will be false

    if (orderSanityCheck.fillable) {
      // remainingAmount <= 0
      // ^ this means we covered the whole amount the user wanted to get quoted
      // so now we can calculate a weighted average for a quote price
      quotePrice = calculateWeightedAvgPrice(
        qc,
        orderSanityCheck.priceIndicies,
        ob.asks,
        orderSanityCheck.remainingAmount
      );

      if (qc === QuoteCurrency.BASE) {
        // a BUY for the quote cur (USD) in the base (BTC)
        // input amount === USD output === BTC
        // here we use the orig algoritm to get the weight avg BTC price.
        // since the order book is BTC->USD we can do 1/Price to get the price per dollar of btc.
        // that is the quote price. multple that by the desired input amount and bang ur done.

        quotePrice = 1 / quotePrice;
      }

      total = quotePrice * amount;
    }
  }

  if (qc === QuoteCurrency.QUOTE && action === Actions.SELL) {
    // SELL for base cur (BTC) in quote cur (USD)
    // then we go through bids until we can fill the order
    // ob.bids do some stuff
  }

  if (qc === QuoteCurrency.BASE && action === Actions.SELL) {
    // if this is a SELL order for base cur (in the mock BTC) then we go through bids until we can fill the order
    // a SELL for the quote cur (USD) in the base (BTC)
    // ob.bids do some stuff
  }

  return {
    fillable: orderSanityCheck.fillable,
    quotePrice: round10(quotePrice, -quoteIncrementPlaces), // TODO: change based on the quote increment
    total: round10(total, -quoteIncrementPlaces)
  };
}
