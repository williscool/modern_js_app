import { GdaxOrderBook, generateQuote } from "../../src/utils/generateQuote";
import { Actions, QuoteCurrency } from "../../src/utils/utilities";
// import * as orderBookMock from "../mocks/btc-usd-order-book-level-2.json";

/**
 * tests our quote creator   works correctly
 */

describe("generateQuote", () => {
  it("Inline BTC-USD", () => {
    it("Quote", () => {
      it("Buy, 1 ", () => {
        const orderBook: GdaxOrderBook = {
          sequence: 1,
          bids: [["8179", "0.09125942", 1]],
          asks: [["705.40", "1", 1]]
        };

        expect(
          generateQuote(orderBook, QuoteCurrency.QUOTE, Actions.BUY, 1)
        ).toBeCloseTo(705.4);
      });
    });
    it("Base", () => {
      it("Buy, 1 ", () => {
        const orderBook: GdaxOrderBook = {
          sequence: 1,
          bids: [["8179", "0.09125942", 1]],
          asks: [["705.40", "1", 1]]
        };

        expect(
          generateQuote(orderBook, QuoteCurrency.BASE, Actions.BUY, 750.4)
        ).toBeCloseTo(1);
      });
    });
  });
});
