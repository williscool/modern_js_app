import {
  enumerateProducts,
  getOrderBookOutputCurrencyType,
  getProductName
} from "../../src/utils/enumerateProducts";
import { OrderBookOutputCurrency } from "../../src/utils/utilities";
// typescript module import doesn't support json :/
// tslint:disable
const productsJson = require("../mocks/products.json");
// tslint:enable
/**
 * Tests our product enumerator works correctly
 *
 * Also this could just be used to validate which currencies exchanges can actually happen with
 *
 * The UI could let you pick whichever to whatever and say
 * "hey we dont have that one yet but upvote this post if you want us to!" and send them to a post somewhere
 */

describe("enumerateProducts", () => {
  it("should generate product exchange map", () => {
    const products = enumerateProducts(productsJson);
    expect(products).toEqual({
      LTC: {
        EUR: OrderBookOutputCurrency.BASE,
        BTC: OrderBookOutputCurrency.BASE,
        USD: OrderBookOutputCurrency.BASE
      },
      EUR: {
        LTC: OrderBookOutputCurrency.QUOTE,
        ETH: OrderBookOutputCurrency.QUOTE,
        BTC: OrderBookOutputCurrency.QUOTE
      },
      BTC: {
        LTC: OrderBookOutputCurrency.QUOTE,
        ETH: OrderBookOutputCurrency.QUOTE,
        USD: OrderBookOutputCurrency.BASE,
        EUR: OrderBookOutputCurrency.BASE,
        GBP: OrderBookOutputCurrency.BASE
      },
      USD: {
        LTC: OrderBookOutputCurrency.QUOTE,
        ETH: OrderBookOutputCurrency.QUOTE,
        BTC: OrderBookOutputCurrency.QUOTE
      },
      ETH: {
        USD: OrderBookOutputCurrency.BASE,
        EUR: OrderBookOutputCurrency.BASE,
        BTC: OrderBookOutputCurrency.BASE
      },
      GBP: { BTC: OrderBookOutputCurrency.QUOTE }
    });
  });
  it("should enumerate the currencies you can exchange", () => {
    const products = enumerateProducts(productsJson);

    // tslint:disable-next-line:no-string-literal
    expect(Object.keys(products["GBP"])).toEqual(["BTC"]);
  });
});

describe("getProductName", () => {
  it("should return correct product name", () => {
    const products = enumerateProducts(productsJson);
    expect(getProductName(products, "BTC", "USD")).toBe("BTC-USD");
    expect(getProductName(products, "USD", "BTC")).toBe("BTC-USD");
    expect(getProductName(products, "GBP", "BTC")).toBe("BTC-GBP");
    expect(getProductName(products, "BTC", "GBP")).toBe("BTC-GBP");
    expect(getProductName(products, "NONSENSE", "CRAZYSTUFF")).toBeFalsy();
  });
});

describe("getOrderBookOutputCurrencyType", () => {
  it("should return correct OrderBookOutputCurrency type", () => {
    expect(getOrderBookOutputCurrencyType("BTC-USD", "BTC")).toBe(
      OrderBookOutputCurrency.QUOTE
    );
    expect(getOrderBookOutputCurrencyType("BTC-USD", "USD")).toBe(
      OrderBookOutputCurrency.BASE
    );
  });
});
