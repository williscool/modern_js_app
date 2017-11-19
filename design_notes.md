# Currency Exchange Quotes

(just go with es6 react so we can get thsi done)

use this https://frontendmasters.com/courses/react/configuring-webpack



## Pre

- typescript
- webpack for typescript
- typescript jsx
- tslint and airbnb config
- prettier
- make sure we can build here
- get a good looking form from codepen



## Overview

- Your goal is to build a client-side web application that provides quotes for digital currency trades using
  data from the GDAX orderbook.
- GDAX, the digital currency exchange operated by Coinbase, maintains an order book for each tradable
  currency pair (eg. BTC-USD).
- An order book is comprised of a series of bids (offers to buy) and asks (offers to sell).
- Bids are sorted descending by price (highest price first) and asks are sorted ascending by price (lowest price first).
- If these two numbers ever cross a trade is executed and those bids or asks are removed from the order book.
- The GDAX API exposes an endpoint to retrieve the current order book for each currency pair. For this task, you should use the level 2 query parameter to fetch aggregated order information. Note: this API can be accessed unauthenticated; you do not need API keys or a GDAX account to access it.  https://docs.gdax.com/#get-product-order-book
- Your application will handle users trying to buy or sell a particular amount of a currency (the base
  currency) with another currency (the quote currency).
- The application should use the orderbook to
  determine the best price the user would be able to get for the request by executing trades on GDAX.
- Note that the quantity your user enters will rarely match a quantity in the order book exactly. This
  means your code will need to aggregate orders in the order book or use parts of orders to arrive at
  the exact quantity, and your final quote will be a weighted average of those prices.
- (I'm pretty sure this is the unbounded knapsack problem lol. ) if not its at least related https://github.com/williscool/code_gym/blob/es6ify/javascript/interview_questions/cake_theif.js
- https://www.interviewcake.com/question/javascript/cake-thief

## p0

- The application should be a client-side application that does not depend on a server. All API requests,
  form processing, and result display should be done client side in the browser. You should also write
  unit tests to ensure the logic functions correctly.
- The application should consist of a single form that accepts 4 inputs and displays 3 outputs.
- If there are any errors processing the request, the form should display the error. https://docs.gdax.com/#errors (make sure to test this part with mocks / fake requests)
- Try to make the form intuitive and protect the user from common errors.
- The application should be able to quote trades between any two currencies which have an orderbook
  on GDAX.
- It should also be able to support trades where the base and quote currencies are the inverse of a GDAX trading pair. For example, the application should be able to quote a buy of BTC (base currency) using ETH (quote currency) or LTC (quote currency), even though the available GDAX orderbooks are ETH-BTC and LTC-BTC.
- find a nice theme for it
- product types https://docs.gdax.com/#get-products
- probably can leave out the router

### form input field follow (all strings)

- action ('buy' or 'sell') 

- base_currency (The currency to be bought or sold), 

- quote_currency (The currency to quote the price in)

- amount (The amount of the base currency to be traded)

### form output field follow (all strings)

- price (The per-unit cost of the base currency)
- total (Total quantity of quote currency)
- currency (The quote currency)


## p1

- tracking (for when a user clicks, compares, prices of stuff, etc.)
- leave redux for last  (figure out what thunks and sagas are) https://github.com/redux-saga

## Clarification questions

- by weight avg you mean...
- Are there any web browser support requirements?
- Do some currencies need to go through another. I.e. would we ever have to go from usd -> btc for usd - > ltc ? 





## Sources

- https://github.com/williscool/code_gym
- https://github.com/verekia/js-stack-from-scratch/
- [Webpack 2 vs Browserify/Grunt/Gulp/Rollup](https://www.youtube.com/watch?v=C_ZtQClrVYw)
- https://www.wisdomgeek.com/web-development/webpack-introduction/
- https://github.com/ai/browserslist
- https://en.wikipedia.org/wiki/Safari_version_history#Mac
- https://medium.com/airbnb-engineering/unlocking-test-performance-migrating-from-mocha-to-jest-2796c508ec50
- https://github.com/jantimon/html-webpack-plugin
- https://survivejs.com/webpack/styling/loading/
- https://www.bignerdranch.com/blog/postcss-life-after-sass/
- https://github.com/postcss/postcss#readme
- http://cssnext.io/
- https://www.postcss.parts/
- https://survivejs.com/webpack/styling/loading/
- https://www.youtube.com/watch?v=AbPSMUt8axM&list=PLnUE-7Cz5mHExcBWO9VV_GN-fniE2l-CR&index=2