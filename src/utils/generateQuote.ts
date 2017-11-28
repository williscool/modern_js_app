import { Actions, OrderBookCurrency, round10 } from "./utilities";

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
  qc: OrderBookCurrency,
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

    if (qc === OrderBookCurrency.BASE) {
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
  qc: OrderBookCurrency,
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

        if (qc === OrderBookCurrency.BASE) {
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
 * examples in the comments in this code use the BTC-USD order book
 * default base of that book
 * BTC === base
 * USD === quote
 * so you could read the name of the book as Quotes for buying and selling BTC in USD
 *
 *
 * @export
 * @param {GdaxOrderBook} ob
 * @param {OrderBookCurrency} qc
 * @param {Actions} action
 * @param {number} amount
 *
 * @returns {Object} object members tell if the order is fillable, quote price, and the total amount
 */
// tslint:disable-next-line:max-func-body-length
export function generateQuote(
  ob: GdaxOrderBook,
  qc: OrderBookCurrency,
  action: Actions,
  amount: number,
  quoteIncrementPlaces: number = 2
) {
  /**
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
  let openOrders = ob.asks;

  /**
   * Seeking to action (buy/sell) base (BTC) in quote (USD)
   *
   * btc(base) -> usd(quote)
   *
   * input btc -> output usd
   *
   * (buying/selling BTC and expecting a quote in USD) qc === QUOTE
   *
   *   buy = buyer wants to buy BTC with USD = asks | aka action === BUY
   *   sell = seller wants to sell BTC and wants to know how much USD they will get for it = bids | action === SELL
   *
   */

  /**
   * Seeking to action (buy/sell) quote (USD) in base (BTC)
   *
   * input usd -> output btc
   *
   * (buying/selling USD and expecting a quote in BTC) qc === BASE
   *
   *   buy = buyer wants to buy USD with BTC = bids | action === BUY
   *   sell = seller wants to sell USD and know how much BTC they will get = asks | action == SELL
   *
   */

  if (action === Actions.BUY) {
    // buy BTC with USD
    openOrders = ob.asks;

    if (qc === OrderBookCurrency.BASE) {
      // BUY USD with BTC
      openOrders = ob.bids;
    }
  }

  if (action === Actions.SELL) {
    // sell BTC for USD
    openOrders = ob.bids;

    if (qc === OrderBookCurrency.BASE) {
      // sell USD for BTC
      openOrders = ob.asks;
    }
  }

  orderSanityCheck = orderIsFillable(qc, openOrders, amount);
  // after orderIsFillable several cases can be true

  // remainingAmount > 0
  // ^ this means there was not enough open asks to cover the quote
  // which meana fillable will be false

  if (orderSanityCheck.fillable) {
    // remainingAmount <= 0
    // ^ this means we covered the whole amount the user wanted to get quoted
    // so now we can calculate a weighted average for a quote price

    /**
     * Aggregated levels return only one size for each active price
     * (as if there was only a single order for that size at the level).
     *
     * so I read this as there are X orders of varying sizes out to sell bitcoin at Y price
     * which means whenever we've looked at enough prices to cover the order we are done.
     *
     * you end up using a weighted avg of all of the prices you have to use fill the quote
     */
    quotePrice = calculateWeightedAvgPrice(
      qc,
      orderSanityCheck.priceIndicies,
      openOrders,
      orderSanityCheck.remainingAmount
    );

    if (qc === OrderBookCurrency.BASE) {
      // since the order book is BTC->USD we can do 1/Price to get the price per dollar of btc.
      // that is the quote price. multple that by the desired input amount and bang ur done.
      //
      quotePrice = 1 / quotePrice;
    }

    total = quotePrice * amount;
  }
  // I would have the quote increment be dictacted by what is returned from the api but I will stick to to making
  // the i/o decimal places similar to the examples from the problem statement

  return {
    fillable: orderSanityCheck.fillable,
    quotePrice: round10(quotePrice, -quoteIncrementPlaces),
    total: round10(total, -quoteIncrementPlaces)
  };
}
