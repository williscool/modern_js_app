import { GdaxOrderBook, generateQuote } from "../../src/utils/generateQuote";
import { Actions, QuoteCurrency } from "../../src/utils/utilities";
// import * as orderBookMock from "../mocks/btc-usd-order-book-level-2.json";

/**
 * tests our quote creator works correctly
 */

describe("generateQuote", () => {
  describe("Inline BTC-USD", () => {
    describe("Quote", () => {
      // TODO: test each of the three cases
      // 1. not enough
      // 2. exactly enough
      // 3. using a fraction
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
      it("Buy, 1.5 ", () => {
        const orderBook: GdaxOrderBook = {
          sequence: 1,
          bids: [["8179", "0.09125942", 1]],
          asks: [["705.40", "1", 1], ["805.41", "1", 1]]
        };

        expect(
          generateQuote(orderBook, QuoteCurrency.QUOTE, Actions.BUY, 1.5)
        ).toBeCloseTo(738.74);
      });
    });
    describe("Base", () => {
      // stuff
    });
  });
});
