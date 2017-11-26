import { enumerateProducts } from "../../src/utils/enumerateProducts";
import { QuoteCurrency } from "../../src/utils/utilities";
import * as productsJson from "../mocks/products.json";
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
        EUR: QuoteCurrency.BASE,
        BTC: QuoteCurrency.BASE,
        USD: QuoteCurrency.BASE
      },
      EUR: {
        LTC: QuoteCurrency.QUOTE,
        ETH: QuoteCurrency.QUOTE,
        BTC: QuoteCurrency.QUOTE
      },
      BTC: {
        LTC: QuoteCurrency.QUOTE,
        ETH: QuoteCurrency.QUOTE,
        USD: QuoteCurrency.BASE,
        EUR: QuoteCurrency.BASE,
        GBP: QuoteCurrency.BASE
      },
      USD: {
        LTC: QuoteCurrency.QUOTE,
        ETH: QuoteCurrency.QUOTE,
        BTC: QuoteCurrency.QUOTE
      },
      ETH: {
        USD: QuoteCurrency.BASE,
        EUR: QuoteCurrency.BASE,
        BTC: QuoteCurrency.BASE
      },
      GBP: { BTC: QuoteCurrency.QUOTE }
    });
  });
  it("should enumerate the currencies you can exchange", () => {
    const products = enumerateProducts(productsJson);

    // tslint:disable-next-line:no-string-literal
    expect(Object.keys(products["GBP"])).toEqual(["BTC"]);
  });
});
