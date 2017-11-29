import { GdaxProduct } from "../../src/utils/enumerateProducts";
import { GdaxOrderBookQuote } from "../../src/utils/generateQuote";
import { OrderBookOutputCurrency } from "../../src/utils/utilities";
import { validateGdaxOrder } from "../../src/utils/validateGdaxOrder";

/**
 * Test order validator
 */

describe("validateGdaxOrder", () => {
  it("validates order fillable", () => {
    const product: GdaxProduct = {
      id: "BTC-USD",
      base_currency: "BTC",
      quote_currency: "USD",
      base_min_size: 0.01,
      base_max_size: 250,
      quote_increment: 0.01,
      display_name: "BTC/USD",
      status: "online",
      margin_enabled: false,
      status_message: null
    };

    const order: GdaxOrderBookQuote = {
      fillable: false,
      bookUsed: "asks"
    };

    const { isValid, errorObj } = validateGdaxOrder(
      order,
      OrderBookOutputCurrency.QUOTE,
      product,
      85
    );

    expect(isValid).toBeFalsy();
    expect(errorObj).toBeDefined();
    expect(errorObj.kind).toBe("validation");
    expect(errorObj.message).toMatch(/open asks/);
    expect(errorObj.error && errorObj.error.toString()).toMatch(/open asks/);
  });

  describe("validates order", () => {
    it("OrderBookOutputCurrency.QUOTE base_min", () => {
      const product: GdaxProduct = {
        id: "BTC-USD",
        base_currency: "BTC",
        quote_currency: "USD",
        base_min_size: 0.01,
        base_max_size: 250,
        quote_increment: 0.01,
        display_name: "BTC/USD",
        status: "online",
        margin_enabled: false,
        status_message: null
      };

      const order: GdaxOrderBookQuote = {
        fillable: true,
        bookUsed: "asks",
        quotePrice: 705.4,
        total: 0.07054
      };

      const { isValid, errorObj } = validateGdaxOrder(
        order,
        OrderBookOutputCurrency.QUOTE,
        product,
        0.0001
      );

      expect(isValid).toBeFalsy();
      expect(errorObj).toBeDefined();
      expect(errorObj.kind).toBe("validation");
      expect(errorObj.message).toMatch(/Too Small/);
      expect(errorObj.error && errorObj.error.toString()).toMatch(/Too Small/);
    });

    it("OrderBookOutputCurrency.QUOTE base_max", () => {
      const product: GdaxProduct = {
        id: "BTC-USD",
        base_currency: "BTC",
        quote_currency: "USD",
        base_min_size: 0.01,
        base_max_size: 250,
        quote_increment: 0.01,
        display_name: "BTC/USD",
        status: "online",
        margin_enabled: false,
        status_message: null
      };

      const order: GdaxOrderBookQuote = {
        fillable: true,
        bookUsed: "asks",
        quotePrice: 705.4,
        total: 0.07054
      };

      const { isValid, errorObj } = validateGdaxOrder(
        order,
        OrderBookOutputCurrency.QUOTE,
        product,
        255
      );

      expect(isValid).toBeFalsy();
      expect(errorObj).toBeDefined();
      expect(errorObj.kind).toBe("validation");
      expect(errorObj.message).toMatch(/Too Large/);
      expect(errorObj.error && errorObj.error.toString()).toMatch(/Too Large/);
    });

    it("OrderBookOutputCurrency.BASE base_min", () => {
      const product: GdaxProduct = {
        id: "BTC-USD",
        base_currency: "BTC",
        quote_currency: "USD",
        base_min_size: 0.01,
        base_max_size: 250,
        quote_increment: 0.01,
        display_name: "BTC/USD",
        status: "online",
        margin_enabled: false,
        status_message: null
      };

      const order: GdaxOrderBookQuote = {
        fillable: true,
        quotePrice: 0.00141764, // number of BTC to buy 1 USD
        total: 1
      };

      const { isValid, errorObj } = validateGdaxOrder(
        order,
        OrderBookOutputCurrency.BASE,
        product,
        5 // 5 dollars
      );

      expect(isValid).toBeFalsy();
      expect(errorObj).toBeDefined();
      expect(errorObj.kind).toBe("validation");
      expect(errorObj.message).toMatch(/Too Small/);
      expect(errorObj.error && errorObj.error.toString()).toMatch(/Too Small/);
    });

    it("OrderBookOutputCurrency.BASE base_max", () => {
      const product: GdaxProduct = {
        id: "BTC-USD",
        base_currency: "BTC",
        quote_currency: "USD",
        base_min_size: 0.01,
        base_max_size: 250,
        quote_increment: 0.01,
        display_name: "BTC/USD",
        status: "online",
        margin_enabled: false,
        status_message: null
      };

      const order: GdaxOrderBookQuote = {
        fillable: true,
        quotePrice: 0.00141764, // number of BTC to buy 1 USD
        total: 1
      };

      const { isValid, errorObj } = validateGdaxOrder(
        order,
        OrderBookOutputCurrency.BASE,
        product,
        200000
      );

      expect(isValid).toBeFalsy();
      expect(errorObj).toBeDefined();
      expect(errorObj.kind).toBe("validation");
      expect(errorObj.message).toMatch(/Too Large/);
      expect(errorObj.error && errorObj.error.toString()).toMatch(/Too Large/);
    });
  });
});
