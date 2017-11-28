import * as fetchMock from "fetch-mock";
import { API_URL, ENDPOINTS, GdaxService } from "../../src/services/gdax";

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
      gdax
        .init()
        .then(() => {
          expect(gdax.productsJson).toBeDefined();
          expect(gdax.productExchangeHash).toBeDefined();
          done();
        })
        .catch(() => {
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
      it("500, malformed contend", done => {
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
});
