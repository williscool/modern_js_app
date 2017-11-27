import { GdaxOrderBook, generateQuote } from "../../src/utils/generateQuote";
import { Actions, QuoteCurrency } from "../../src/utils/utilities";
// import * as orderBookMock from "../mocks/btc-usd-order-book-level-2.json";

/**
 * tests our quote creator works correctly
 */

// TODO: inline test sells, do both with the mock

describe("generateQuote", () => {
  describe("Inline BTC-USD", () => {
    describe("Quote, Buy", () => {
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
    describe("Base, Buy", () => {
      it("Buy, 705.4", () => {
        const orderBook: GdaxOrderBook = {
          sequence: 1,
          bids: [["705.40", "1", 1]],
          asks: [["8179", "0.09125942", 1]]
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
          bids: [["705.40", "1", 1], ["805.41", "1", 1]],
          asks: [["8179", "0.09125942", 1]]
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
      it("Buy, 10000", () => {
        const orderBook: GdaxOrderBook = {
          sequence: 1,
          bids: [["705.40", "1", 1], ["805.41", "1", 1]],
          asks: [["8179", "0.09125942", 1]]
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
    describe("Quote, Sell", () => {
      it("Sell, 10", () => {
        const orderBook: GdaxOrderBook = {
          sequence: 1,
          bids: [["705.40", "10", 1]],
          asks: [["8179", "0.09125942", 1]]
        };

        const output = generateQuote(
          orderBook,
          QuoteCurrency.QUOTE,
          Actions.SELL,
          10
        );

        expect(output.quotePrice).toBeCloseTo(705.4);
        expect(output.total).toBeCloseTo(7054);
      });
      it("Sell, 15", () => {
        const orderBook: GdaxOrderBook = {
          sequence: 1,
          bids: [["705.40", "10", 1], ["805.40", "10", 1]],
          asks: [["8179", "0.09125942", 1]]
        };

        const output = generateQuote(
          orderBook,
          QuoteCurrency.QUOTE,
          Actions.SELL,
          15
        );

        expect(output.quotePrice).toBeCloseTo(738.73);
        expect(output.total).toBeCloseTo(11081);
      });
      it("Sell, 25", () => {
        const orderBook: GdaxOrderBook = {
          sequence: 1,
          bids: [["705.40", "10", 1], ["805.40", "10", 1]],
          asks: [["8179", "0.09125942", 1]]
        };

        const output = generateQuote(
          orderBook,
          QuoteCurrency.QUOTE,
          Actions.SELL,
          25
        );

        expect(output.fillable).toBeFalsy();
      });
    });
    describe("Base, Sell", () => {
      it("Sell, 704.5 aka exact", () => {
        const orderBook: GdaxOrderBook = {
          sequence: 1,
          bids: [["8179", "0.09125942", 1]],
          asks: [["705.40", "10", 1]]
        };

        const output = generateQuote(
          orderBook,
          QuoteCurrency.BASE,
          Actions.SELL,
          705.4,
          8
        );

        expect(output.quotePrice).toBeCloseTo(0.00141764);
        expect(output.total).toBeCloseTo(1);
      });
      it("Sell, 1108.11, aks uses a fraction of last order", () => {
        const orderBook: GdaxOrderBook = {
          sequence: 1,
          bids: [["8179", "0.09125942", 1]],
          asks: [["705.40", "1", 1], ["805.41", "1", 1]]
        };

        const output = generateQuote(
          orderBook,
          QuoteCurrency.BASE,
          Actions.SELL,
          1108.11,
          8
        );

        expect(output.quotePrice).toBeCloseTo(0.00135366);
        expect(output.total).toBeCloseTo(1.50000733);
      });
      it("Sell, 10000, aka not fillable", () => {
        const orderBook: GdaxOrderBook = {
          sequence: 1,
          bids: [["8179", "0.09125942", 1]],
          asks: [["705.40", "1", 1], ["805.41", "1", 1]]
        };

        const output = generateQuote(
          orderBook,
          QuoteCurrency.BASE,
          Actions.SELL,
          10000,
          8
        );

        expect(output.fillable).toBeFalsy();
      });
    });
  });
});
