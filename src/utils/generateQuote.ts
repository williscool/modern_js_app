import { Actions, QuoteCurrency } from "./utilities";

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
   */
  let quote = "";

  /**
   * Aggregated levels return only one size for each active price
   * (as if there was only a single order for that size at the level).
   *
   * so I read this as there are X orders of varying sizes out to sell bitcoin at Y price
   * which means whenever we've looked at enough prices to cover the order we are done.
   *
   * and we don't have to subdivide based on the number of orders out at this point
   *
   * also remember also you end up using a weighted avg of all of the prices you have to use fill the quote
   */

  if (tb === QuoteCurrency.QUOTE && action === Actions.BUY) {
    // user request quote for a BUY for the base currency (BTC in the mock) in the quote currency (in the mock USD)
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

    // after the for loop several cases can be true
    // priceIndicies.length >= ob.asks.length - 1 && remainingAmount > 0
    // ^ this means there was not enough open asks to cover the quote

    // TODO: show some kinda error or show a quote for as much as possible and the short fall

    // priceIndicies.length - 1 <= ob.asks.length - 1 && remainingAmount <= 0
    // ^ this means we covered the whole amount the user wanted to get quoted
    // so now we are returning them a weighted average as a quote
    //
    // https://www.investopedia.com/terms/w/weightedaverage.asp

    let totalOrders = 0;

    quote = priceIndicies
      .map((priceIndex, i) => {
        const [price, , numOrders] = ob.asks[priceIndex];
        totalOrders += numOrders;

        return parseFloat(price) * numOrders;
      })
      // tslint:disable-next-line:no-parameter-reassignment
      .reduce((prev, num) => (prev += (prev + num) / totalOrders), 0)
      .toFixed(quoteIncrementPlaces); // TODO: change the fixed based on the quote increment
  }

  if (tb === QuoteCurrency.BASE && action === Actions.BUY) {
    // a BUY for the quote cur (USD) in the base (BTC)
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

function()
