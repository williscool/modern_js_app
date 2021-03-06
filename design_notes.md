# Currency Exchange Quotes

Guide to this: 

1. Roadmap
2. Clarification Questions and Answer
3. All the things that got done roughly in chronological order (most recent at the bottom)
4. Sources for things that helped me get it done



## p1(things I would do in the future)

- tracking (for when a user clicks, compares, prices of stuff, etc.) 

## p2 (more things I would do in the future) 
- setup hot module reload https://frontendmasters.com/courses/react/setting-up-hmr
- use a number formatting (i.e. adding commas and dollar sign) input ala https://github.com/s-yadav/react-number-format
- add a router if the app needed multiple pages
- leave redux for last  (figure out what thunks and sagas are) https://github.com/redux-saga
- internationalize

## Clarification questions

- Are there any web browser support requirements? (can I not support IE 11 for instance) . I'm assuming Chrome, Firefox, Edge, and Safari on desktop (any mobile?)

- Do any currencies need to go through another for calculating their exchange. i.e. would we ever have to go from usd -> [currencyA] then [currencyA] -> [currencyB] for usd - > [currencyB]?  or will there always be a currency to curency matching (even if only the inverse exists) from the api

-  by

  "... final quote will be a weighted average of those prices"

  it means the cost of each ask or buy to fill the order multiplied by the price paid / divided by the total number of share correct?

  i.e. for a buy quote

  10 units from ask order A at ($5)

  7 units from ask order A at ($11)

  ( ( 10 * 5) * (7 * 11) ) / 17

  <https://www.investopedia.com/terms/w/weightedaverage.asp> 




### answers

- answer only needs to work in latest chrome
- no exchange through another currency
- weighted avg thought was correct



## Done

### form io

#### form input field follow (all strings)

- action ('buy' or 'sell') 
- base_currency (The currency to be bought or sold), 
- quote_currency (The currency to quote the price in)
- amount (The amount of the base currency to be traded)



### P0

- folder per component with its css and etc. in there too. (imported at the top)

- once we get the form working. just print it out in the ui under the form

- The application should be a client-side application that does not depend on a server. All API requests,
  form processing, and result display should be done client side in the browser.

- test form has x inputs,  (covered by snapshots)

- when you change stuff their values change (that would be testing the framework react and material ui handle that for us)

- figure out a way to ban currencies from consideration

- https://github.com/chriso/validator.js

- (would just test this in a seperate unit test) test that you can't invalid and you can input valid input in the amount section 

- hit the api. copy resp with chrome `copy` use it to make mock data to test algorithm on (do it for 1 product type too. algorithm will work on all once we have one)

- once you have teh product types build an object where the keys are the currency types and the values are the currences it can be converted to. 

- there will be a gdax service at `gdax.ts` and that will use `utils` the process the response from the gdax api . the service should also handle errors and such

- test quote algo

- test happy path for gdax service init

- test error paths for gdax service init

- (mock the api respone json to test our algorithm with)

- test happy path for gdax service getQuote

- test error paths for gdax service getQuote

- write tests (just that form displays inputs.  extensive unit tests )

- (I'm pretty sure this is the unbounded knapsack problem lol. ) if not its at least related https://github.com/williscool/code_gym/blob/es6ify/javascript/interview_questions/cake_theif.js

- https://www.interviewcake.com/question/javascript/cake-thief

- wire it ui

  left

  - hit api get data
  - make sure io works correctly for quotes buy and sell
  - loading indicator for async actions.
  - make sure ui around that is good
  - form validation
  - use it to print out stuff

  more succiently

  Gdax service will handle fetching data and state transitions

  1. on load say setting up prodtus and have loading animation and have the app in a loading state
  2. when ready disable loading state and switch to application loaded or ready. (form will have all of the currencies)
  3. form has buy and sell actions and the quote currencies are dictated by the base currency (i.e GBP can only go to BTC)
  4. when clicked with a form amount the gdax service will get the latest orderbook and calculate a current quote
  5. also need to validate values like greater than zero for input and not less than .01 for USD and however many decimal places for BTC

  also need to handle error states. like api being down or something like that by faking the bad response and having the gdax service handle it.

- On load I would have loading thing that tells the user we are getting product types

- Use curency hash to build what is in the base and quote currrency dropdowns

- use this to help spec https://www.educative.io/collection/5668639101419520/5649050225344512 also think of edge cases and such

- make sure we've got some kind of loading animation for when it is processing for the quote

- let user know we are crunching data once we get it back if it takes  a while 

- You should also write unit tests to ensure the logic functions correctly.

- The application should consist of a single form that accepts 4 inputs and displays 3 outputs.

- If there are any errors processing the request, the form should display the error. https://docs.gdax.com/#errors (make sure to test this part with mocks / fake requests)

- Try to make the form intuitive and protect the user from common errors.

- The application should be able to quote trades between any two currencies which have an orderbook
  on GDAX.

- It should also be able to support trades where the base and quote currencies are the inverse of a GDAX trading pair. For example, the application should be able to quote a buy of BTC (base currency) using ETH (quote currency) or LTC (quote currency), even though the available GDAX orderbooks are ETH-BTC and LTC-BTC.

- product types https://docs.gdax.com/#get-products

- (timebox 30 mins) awaitify

- ship it to netlify

- done


1. polish UI
2.  If you decide to write in an environment that requires compilation (i.e. webpack, coffeescript, etc), you should submit alongside your code a single script that will run your program.
3. fix not adding level 2

## I/O

### form output field follow (all strings)

- price (The per-unit cost of the base currency)
- total (Total quantity of quote currency)
- currency (The quote currency)

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
- The application should use the orderbook to determine the best price the user would be able to get for the request by executing trades on GDAX.
- Note that the quantity your user enters will rarely match a quantity in the order book exactly. This
  means your code will need to aggregate orders in the order book or use parts of orders to arrive at
  the exact quantity, 
- and your final quote will be a weighted average of those prices.
- center form and/or or figure out some theme from a tutorial

  ​

### Pre

- typescript
- webpack for typescript
- typescript jsx
- tslint and airbnb config
- prettier (make sure to pin it to an exact realease!)
- make sure we can build here
- find a nice theme for it ( good looking form from material ui)




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
- https://frontendmasters.com/courses/react/
- https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html
- https://www.typescriptlang.org/docs/handbook/react-&-webpack.html
- https://github.com/Microsoft/TypeScript-React-Starter#typescript-react-starter
- https://github.com/palantir/tslint
- https://github.com/progre/tslint-config-airbnb
- https://github.com/progre/tslint-config-airbnb/blob/5.4.2/tslint.js
- https://palantir.github.io/tslint/usage/type-checking/
- https://www.youtube.com/watch?v=qH4pJISKeoI
- https://spin.atomicobject.com/2017/06/05/tslint-linting-setup/
- https://github.com/Mercateo/react-with-typescript#stateless-functional-components
- [How to code a form in React by Ben Awad on Youtube](https://www.youtube.com/playlist?list=PLN3n1USn4xllZIJyrGvCu5ihs2GoMtk1Q)
- https://stackoverflow.com/questions/37186500/how-to-setup-material-ui-for-react-with-typescript/37412793#37412793
- https://github.com/ReactTraining/react-router/issues/4477#issuecomment-286187737
- https://medium.com/@yoniweisbrod/interacting-with-apis-using-react-native-fetch-9733f28566bb
- https://stackoverflow.com/a/36636368/511710
- https://gist.github.com/rjz/4c6922b811a6ea859b19ed62a682045c
- https://github.github.io/fetch/
- https://github.com/github/fetch/issues/203
- https://gist.github.com/msmfsd/fca50ab095b795eb39739e8c4357a808
- https://codepen.io/McXinuS/pen/yMqJLd