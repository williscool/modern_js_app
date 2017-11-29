import * as decomment from "decomment";
import * as fetchMock from "fetch-mock";
import * as fs from "fs";
import { API_URL, ENDPOINTS, GdaxService } from "../../src/services/gdax";
import { GdaxOrderBookQuote } from "../../src/utils/generateQuote";
import { Actions } from "../../src/utils/utilities";

// tslint:disable:no-floating-promises
// in this test we want to explicity check promises are handled the way we intend for them to be on a per case basis

/**
 * Test the gdax service
 */

describe("GdaxService", () => {
  afterEach(fetchMock.restore);
  describe("init", () => {
    it("success", done => {
      // have to require the json
      // tslint:disable-next-line:no-require-imports
      const productsJson = require("../mocks/products.json");
      fetchMock.get(`${API_URL}${ENDPOINTS.products}`, productsJson);

      const gdax = new GdaxService();

      // happy path doesn't need anymore testing than this.
      // properly generating the exchange hash is unit tested
      gdax.init().then(() => {
        expect(gdax.productsJson).toBeDefined();
        expect(gdax.productExchangeHash).toBeDefined();
        done();
      });
    });
    describe("failure", () => {
      it("400", done => {
        fetchMock.get(`${API_URL}${ENDPOINTS.products}`, {
          status: 400,
          body: {
            message: "Bad Request"
          }
        });

        const gdax = new GdaxService();

        gdax.init().catch(err => {
          expect(err).toBeDefined();
          expect(gdax.ok).toBeFalsy();
          expect(gdax.errorObj.statusCode).toBe(400);
          expect(gdax.errorObj.kind).toBe("client");
          expect(gdax.errorObj.message).toBe("Bad Request");
          expect(gdax.productsJson).toBeFalsy();
          done();
        });
      });
      it("500", done => {
        fetchMock.get(`${API_URL}${ENDPOINTS.products}`, {
          status: 500,
          body: {
            message: "Server is down"
          }
        });

        const gdax = new GdaxService();

        gdax.init().catch(err => {
          expect(err).toBeDefined();
          expect(gdax.ok).toBeFalsy();
          expect(gdax.errorObj.statusCode).toBe(500);
          expect(gdax.errorObj.kind).toBe("server");
          expect(gdax.errorObj.message).toBe("Server is down");
          expect(gdax.productsJson).toBeFalsy();
          done();
        });
      });
      it("500, malformed content", done => {
        // if the server 500s and can't even make json right
        fetchMock.get(`${API_URL}${ENDPOINTS.products}`, {
          status: 500,
          body: "isdaf8udfpioajdfafdsojf random garbage"
        });

        const gdax = new GdaxService();

        gdax.init().catch(err => {
          expect(err).toBeDefined();
          expect(gdax.productsJson).toBeFalsy();
          expect(err instanceof Error).toEqual(true);
          expect(err.toString()).toMatch(/JSON/i);
          expect(gdax.errorObj.error instanceof Error).toEqual(true);
          expect(gdax.errorObj.error && gdax.errorObj.error.toString()).toMatch(
            /JSON/i
          );
          done();
        });
      });
    });
  });
  describe("getQuote", () => {
    it("success aka the happy path", done => {
      const pJSONText = fs.readFileSync(
        require.resolve("../mocks/products.json"),
        "utf8"
      );
      const productsJson = JSON.parse(decomment(pJSONText));

      fetchMock.get(`${API_URL}${ENDPOINTS.products}`, productsJson);

      const oJSONText = fs.readFileSync(
        require.resolve("../mocks/btc-usd-order-book-level-2.json"),
        "utf8"
      );

      const orderBookJson = decomment(oJSONText, { safe: true });

      fetchMock.get(
        `${API_URL}${ENDPOINTS.products}/BTC-USD/book?level=2`,
        orderBookJson
      );

      const gdax = new GdaxService();
      gdax.init().then(() => {
        gdax
          .getQuote("BTC", "USD", Actions.BUY, 1)
          .then((output: GdaxOrderBookQuote) => {
            expect(output.fillable).toBeTruthy();
            expect(output.quotePrice).toBe(8179.01);
            expect(output.total).toBe(8179.01);
            done();
          });
      });
    });
    describe("failure", () => {
      it("400", done => {
        const pJSONText = fs.readFileSync(
          require.resolve("../mocks/products.json"),
          "utf8"
        );
        const productsJson = JSON.parse(decomment(pJSONText));
        fetchMock.get(`${API_URL}${ENDPOINTS.products}`, productsJson);

        fetchMock.get(`${API_URL}${ENDPOINTS.products}/BTC-USD/book?level=2`, {
          status: 400,
          body: {
            message: "Bad Request"
          }
        });

        const gdax = new GdaxService();
        gdax.init().then(() => {
          gdax.getQuote("BTC", "USD", Actions.BUY, 1).catch(err => {
            expect(err).toBeDefined();
            expect(gdax.ok).toBeFalsy();
            expect(gdax.errorObj.statusCode).toBe(400);
            expect(gdax.errorObj.kind).toBe("client");
            expect(gdax.errorObj.message).toBe("Bad Request");
            done();
          });
        });
      });
      it("500, malformed content", done => {
        // if the server 500s and can't even make json right
        const pJSONText = fs.readFileSync(
          require.resolve("../mocks/products.json"),
          "utf8"
        );
        const productsJson = JSON.parse(decomment(pJSONText));
        fetchMock.get(`${API_URL}${ENDPOINTS.products}`, productsJson);

        fetchMock.get(`${API_URL}${ENDPOINTS.products}/BTC-USD/book?level=2`, {
          status: 500,
          body: "sdfasdjsd junk"
        });

        const gdax = new GdaxService();
        gdax.init().then(() => {
          gdax.getQuote("BTC", "USD", Actions.BUY, 1).catch(err => {
            expect(err).toBeDefined();
            expect(err instanceof Error).toEqual(true);
            expect(err.toString()).toMatch(/JSON/i);
            expect(gdax.errorObj.error instanceof Error).toEqual(true);
            expect(
              gdax.errorObj.error && gdax.errorObj.error.toString()
            ).toMatch(/JSON/i);
            done();
          });
        });
      });
    });
    it("happy path validation falilure", done => {
      // can't import json in typescript :/
      const pJSONText = fs.readFileSync(
        require.resolve("../mocks/products.json"),
        "utf8"
      );
      const productsJson = JSON.parse(decomment(pJSONText));

      fetchMock.get(`${API_URL}${ENDPOINTS.products}`, productsJson);

      const oJSONText = fs.readFileSync(
        require.resolve("../mocks/btc-usd-order-book-level-2.json"),
        "utf8"
      );

      const orderBookJson = decomment(oJSONText, { safe: true });

      fetchMock.get(
        `${API_URL}${ENDPOINTS.products}/BTC-USD/book?level=2`,
        orderBookJson
      );

      const gdax = new GdaxService();
      gdax.init().then(() => {
        gdax.getQuote("BTC", "USD", Actions.BUY, 2555).catch(err => {
          expect(err).toBeDefined();
          expect(gdax.errorObj.kind).toBe("validation");
          expect(gdax.errorObj.message).toMatch(/Too Large/);
          done();
        });
      });
    });
  });
});
