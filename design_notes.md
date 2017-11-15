# Photos App



## p0

- explain why I chose the tech that I chose (why postcss, why other stuff?)
- add stylelint
- use css grids (or flexbox) and some hard coded images to get the grid working  grid (want this to be css grid or will fallback to flexbox)
- make sure to drop ie from browselist configs (babel and package.json)
- use css animations to get the lightbox working https://codepen.io/designcouch/pen/DEkcf
- wire up fetch to the api (maybe put this part of the app in an app folder)
- photos from an api (hard code to something pretty like islands "", maybe use graphql make that p1 if it takes more than15 mins to figure out)  
- cross browser testing
- acceptance testing

- Update the UI of a page without refreshing (see more, and search for another type, maybe 300 ~ms after keystroke)
- light box when photo clicked (just need to animate the css to the demisions of the thing based on the size of the viewport)  https://codepen.io/designcouch/pen/DEkcf
- Build a polished user experience you'd be proud to ship (lint, test [acceptance at least], doc, etc.)
- acceptance test with: phantomjs, chrome, firefox, safari, (I would do all N-1)
- Your submission must run without errors in the latest versions of Chrome, Safari, Firefox, and Edge.

## p1

- tracking (for view count, how many times they scroll the infinite scroll, buttons clicked, images moused over or whatever stuff you can think to track. pusedocode sending it to api. just console .log it out	)
- instrument user timing to measure performance of the app https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API
- you can search for whatever type of photos you want
- https://developers.google.com/web/fundamentals/web-components/shadowdom
- flow typing




## p2 (things I would do in the future)

- infinite scroll
- viewport tracking (you could see how many and what pictures a user actually saw)
- minification of css, js, html
- graphql api
- get prettier working on save with https://github.com/prettier/prettier-vscode ( save us having to hand fix everything to pass the linter)
- https://github.com/lettertwo/appcache-webpack-plugin


## clarify

- I can use babel to transpile es6 and postcss for `cssnext` correct?
- I am reading the the browser requirements correctly to mean that I can explicitly exclude support for Internet Explorer 11?
- does the prompt exclude flow type annotations (instructions are somewhat ambiguous since these would be preprocessed out)




## overkill clarify

there are a good other clarifying questions I would ask if this were a large application that was going out to lots of people but are certainly overkill for this project i.e.

- what would be the performance requirements
-  maximum size the initial payload of the app should be
- server side rendering?



## done

### p0

- setup babel, webpack,  etc. and get an html that loads some js
- readme also update this as you go along
- vanilla js only (preprocessors, and polyfills are cool though)
- sass (rather postcss)
- consolidated todo into p0




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
- https://codepen.io/ramenhog/pen/MpORPa

