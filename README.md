# Currency Exchange Quotes

A modern js app.

(add more detail about what it supposed to do)

## Features


- babel with browserlist compiling es6 for modern browsers in the style of N-1 (latest browser previous version) http://browserl.ist/?q=Last+1+versions%2C+not+ie+%3C+11%2C+safari+%3E%3D+10


- eslint for linting
- jest for testing
- jsdoc for documentation
- webpack for development server and module compilation for production distribution
- [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) to generate a html page that includes the app without the need for separate server
- husky for hooks ( i.e. to run tests before committing)
- PostCss for nextcss future and sass like features etc. https://www.bignerdranch.com/blog/postcss-life-after-sass/
- TypeScript
- React




## About

Checkout the [design_notes.md](design_notes.md)

For methodology and roadmap

## Usage

Run

```
yarn start
```

Then you can visit 

[http://localhost:7000/dist/](http://localhost:7000/dist/) to check out the app



Test

```
yarn test
```



Production build

```
yarn prod:build
```
