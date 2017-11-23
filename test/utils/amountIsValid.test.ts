import { amountIsValid } from "../../src/utils/amountIsValid";

/**
 * Just tests our amount validator works correctly
 */

describe("amountIsValid", () => {
  it("should mark nonnegative numbers as valid", () => {
    expect(amountIsValid(0)).toBeTruthy();
    expect(amountIsValid(1)).toBeTruthy();
    expect(amountIsValid(100000000000000)).toBeTruthy();
    expect(amountIsValid(1.1221)).toBeTruthy();
  });

  it("should mark negative numbers as invalid", () => {
    expect(amountIsValid(-0)).toBeFalsy();
    expect(amountIsValid(-1)).toBeFalsy();
    expect(amountIsValid(-1000000)).toBeFalsy();
    expect(amountIsValid(-1.0)).toBeFalsy();
  });

  describe("should validate strings", () => {
    it("as invalid", () => {
      expect(amountIsValid("    afjsdkfk;aljsd 18")).toBeFalsy();
      expect(amountIsValid("-0")).toBeFalsy();
      expect(amountIsValid("-1")).toBeFalsy();
      expect(amountIsValid("-112312-.")).toBeFalsy();
    });
    it("as valid", () => {
      expect(amountIsValid("")).toBeTruthy();
      expect(amountIsValid(".22")).toBeTruthy();
      expect(amountIsValid("0")).toBeTruthy();
      expect(amountIsValid("1")).toBeTruthy();
      expect(amountIsValid("1.")).toBeTruthy();
      expect(amountIsValid("1.2222")).toBeTruthy();
      expect(amountIsValid("1.2222")).toBeTruthy();
    });
  });
});
