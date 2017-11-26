import { GdaxOrderBook, generateQuote } from "../../src/utils/generateQuote";
import { Actions, QuoteCurrency } from "../../src/utils/utilities";
// import * as orderBookMock from "../mocks/btc-usd-order-book-level-2.json";

/**
 * tests our quote creator works correctly
 */

describe("generateQuote", () => {
  describe("Inline BTC-USD", () => {
    describe("Quote", () => {
      // 1. exactly enough <-- need to do the multi scan version of this
      // 2. using a fraction
      // 3. NOT enough
      it("Buy, 1", () => {
        const orderBook: GdaxOrderBook = {
          sequence: 1,
          bids: [["8179", "0.09125942", 1]],
          asks: [["705.40", "1", 1]]
        };

        const output = generateQuote(
          orderBook,
          QuoteCurrency.QUOTE,
          Actions.BUY,
          1
        );

        expect(output.quotePrice).toBeCloseTo(705.4);
        expect(output.total).toBeCloseTo(705.4);
      });
      it("Buy, 1.5 ", () => {
        const orderBook: GdaxOrderBook = {
          sequence: 1,
          bids: [["8179", "0.09125942", 1]],
          asks: [["705.40", "1", 1], ["805.41", "1", 1]]
        };

        const output = generateQuote(
          orderBook,
          QuoteCurrency.QUOTE,
          Actions.BUY,
          1.5
        );

        expect(output.quotePrice).toBeCloseTo(738.74);
        expect(output.total).toBeCloseTo(1108.11);
      });
      it("Buy, 3.5", () => {
        const orderBook: GdaxOrderBook = {
          sequence: 1,
          bids: [["8179", "0.09125942", 1]],
          asks: [["705.40", "1", 1], ["805.41", "1", 1]]
        };

        const output = generateQuote(
          orderBook,
          QuoteCurrency.QUOTE,
          Actions.BUY,
          3.5
        );

        expect(output.fillable).toBeFalsy();
      });
    });
    describe("Base", () => {
      it("Buy, 705.4", () => {
        const orderBook: GdaxOrderBook = {
          sequence: 1,
          bids: [["8179", "0.09125942", 1]],
          asks: [["705.40", "1", 1]]
        };

        const output = generateQuote(
          orderBook,
          QuoteCurrency.BASE,
          Actions.BUY,
          705.4,
          8
        );

        expect(output.total).toBeCloseTo(1);
        expect(output.quotePrice).toBeCloseTo(0.00141763);
      });
      it("Buy, 1108.11", () => {
        const orderBook: GdaxOrderBook = {
          sequence: 1,
          bids: [["8179", "0.09125942", 1]],
          asks: [["705.40", "1", 1], ["805.41", "1", 1]]
        };

        const output = generateQuote(
          orderBook,
          QuoteCurrency.BASE,
          Actions.BUY,
          1108.11,
          8
        );

        expect(output.total).toBeCloseTo(1.5);
        expect(output.quotePrice).toBeCloseTo(0.00135366);
      });
      it("Buy, 1000", () => {
        const orderBook: GdaxOrderBook = {
          sequence: 1,
          bids: [["8179", "0.09125942", 1]],
          asks: [["705.40", "1", 1], ["805.41", "1", 1]]
        };

        const output = generateQuote(
          orderBook,
          QuoteCurrency.BASE,
          Actions.BUY,
          10000,
          8
        );

        expect(output.fillable).toBeFalsy();
      });
    });
  });
});
