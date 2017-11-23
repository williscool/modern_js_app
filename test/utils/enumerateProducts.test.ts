import { enumerateProducts } from "../../src/utils/enumerateProducts";
import * as productsJson from "../mocks/products.json";
/**
 * Tests our product enumerator works correctly
 */

describe("enumerateProducts", () => {
  it("should generate product exchange map", () => {
    const products = enumerateProducts(productsJson);
    expect(products).toEqual({
      LTC: { EUR: true, BTC: true, USD: true },
      EUR: { LTC: true, ETH: true, BTC: true },
      BTC: { LTC: true, ETH: true, USD: true, EUR: true, GBP: true },
      USD: { LTC: true, ETH: true, BTC: true },
      ETH: { USD: true, EUR: true, BTC: true },
      GBP: { BTC: true }
    });
  });
  it("should enumerate the currencies you can exchange", () => {
    const products = enumerateProducts(productsJson);

    // tslint:disable-next-line:no-string-literal
    expect(Object.keys(products["GBP"])).toEqual(["BTC"]);
  });
});
