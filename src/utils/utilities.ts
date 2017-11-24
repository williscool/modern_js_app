/**
 * Delinates the action for the currencies
 *
 * Done this way you could add new Actions easily
 *
 * https://stackoverflow.com/questions/36633033/how-to-organize-typescript-interfaces/36636368#36636368
 *
 * @enum {number}
 */
export enum Actions {
  BUY = "Buy",
  SELL = "Sell"
}

export enum QuoteCurrency {
  BASE = "base",
  QUOTE = "quote"
}
