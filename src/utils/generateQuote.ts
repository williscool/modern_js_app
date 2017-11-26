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
 * @param {QuoteCurrency} tb
 * @param {Actions} action
 * @param {number} amount
 *
 * @returns {number} quote
 */
// tslint:disable-next-line:max-func-body-length
export function generateQuote(
  ob: GdaxOrderBook,
  tb: QuoteCurrency,
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
  let quote = "";

  /**
   * Aggregated levels return only one size for each active price
   * (as if there was only a single order for that size at the level).
   *
   * so I read this as there are X orders of varying sizes out to sell bitcoin at Y price
   * which means whenever we've looked at enough prices to cover the order we are done.
   *
   * you end up using a weighted avg of all of the prices you have to use fill the quote
   */

  if (tb === QuoteCurrency.QUOTE && action === Actions.BUY) {
    // user request quote for a BUY for the base currency (BTC in the mock) in the quote currency (in the mock USD)
    // this means the input amount will be BTC and the quote amount will be USD
    //
    // so we go through asks until we can fill the order
    // ob.asks do some stuff

    // start off assuming we can cover the whole desired amount
    // with total amount of base cur (BTC) availble at the first price
    const priceIndicies = [];
    let remainingAmount = amount;

    for (let i = 0; i <= ob.asks.length - 1; i += 1) {
      priceIndicies.push(i);
      const [, size] = ob.asks[i];

      const numSize = parseFloat(size);

      remainingAmount -= numSize;
      if (remainingAmount <= 0) {
        break;
      }
    }

    // after the initial for loop several cases can be true

    // remainingAmount > 0
    // ^ this means there was not enough open asks to cover the quote
    // TODO: show some kinda error or show a quote for as much as possible and the short fall

    // remainingAmount <= 0
    // ^ this means we covered the whole amount the user wanted to get quoted
    // so now we are returning them a weighted average as a quote
    //
    // https://www.investopedia.com/terms/w/weightedaverage.asp

    let totalOrders = 0;

    let numQuote = priceIndicies
      .map((priceIndex, i, arr) => {
        const [price, size, orders] = ob.asks[priceIndex];
        const numSize = parseFloat(size);
        const numPrice = parseFloat(price);
        let numOrders = orders;

        if (i === arr.length - 1 && remainingAmount !== 0) {
          // we only used a fraction of the orders out at the last price
          // https://www.mathsisfun.com/definitions/decimal-fraction.html
          //
          // also remainingAmount is negative since we subtract the size from it
          // so we negate it to get a positive
          const decmialFraction = -remainingAmount / numSize; //
          numOrders = numOrders * decmialFraction;
        }

        totalOrders += numOrders;

        return numPrice * numOrders;
      })
      .reduce((prev, num) => prev + num);

    numQuote /= totalOrders;

    quote = round10(numQuote, -2).toFixed(quoteIncrementPlaces); // TODO: change based on the quote increment
  }

  if (tb === QuoteCurrency.BASE && action === Actions.BUY) {
    // a BUY for the quote cur (USD) in the base (BTC)
    // input amount === USD output === BTC
    // here we use the orig algoritm to get the weight avg BTC price.
    // since the order book is BTC->USD we can do 1/Price to get the price per dollar of btc.
    // that is the quote price. multple that by the desired input amount and bang ur done.
    // ob.asks do some stuff
  }

  if (tb === QuoteCurrency.QUOTE && action === Actions.SELL) {
    // SELL for base cur (BTC) in quote cur (USD)
    // then we go through bids until we can fill the order
    // ob.bids do some stuff
  }

  if (tb === QuoteCurrency.BASE && action === Actions.SELL) {
    // if this is a SELL order for base cur (in the mock BTC) then we go through bids until we can fill the order
    // a SELL for the quote cur (USD) in the base (BTC)
    // ob.bids do some stuff
  }

  return parseFloat(quote);
}
