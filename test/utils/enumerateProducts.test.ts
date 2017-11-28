import {
  enumerateProducts,
  getProductName,
  orderBookCurrencyType
} from "../../src/utils/enumerateProducts";
import { OrderBookCurrency } from "../../src/utils/utilities";
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
        EUR: OrderBookCurrency.BASE,
        BTC: OrderBookCurrency.BASE,
        USD: OrderBookCurrency.BASE
      },
      EUR: {
        LTC: OrderBookCurrency.QUOTE,
        ETH: OrderBookCurrency.QUOTE,
        BTC: OrderBookCurrency.QUOTE
      },
      BTC: {
        LTC: OrderBookCurrency.QUOTE,
        ETH: OrderBookCurrency.QUOTE,
        USD: OrderBookCurrency.BASE,
        EUR: OrderBookCurrency.BASE,
        GBP: OrderBookCurrency.BASE
      },
      USD: {
        LTC: OrderBookCurrency.QUOTE,
        ETH: OrderBookCurrency.QUOTE,
        BTC: OrderBookCurrency.QUOTE
      },
      ETH: {
        USD: OrderBookCurrency.BASE,
        EUR: OrderBookCurrency.BASE,
        BTC: OrderBookCurrency.BASE
      },
      GBP: { BTC: OrderBookCurrency.QUOTE }
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

describe("orderBookCurrencyType", () => {
  it("should return correct orderBookCurrency type", () => {
    expect(orderBookCurrencyType("BTC-USD", "BTC")).toBe(
      OrderBookCurrency.BASE
    );
    expect(orderBookCurrencyType("BTC-USD", "USD")).toBe(
      OrderBookCurrency.QUOTE
    );
  });
});
