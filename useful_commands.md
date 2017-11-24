```
// let variables act really weird on chrome console
var products = {};

fetch('https://api.gdax.com/products').then(
  function(response){
     return response.json();
    }
).then(function(data){
    console.log(data)
	products= data;
});
```
output similar to
`test/mocks/products.json`



```
var orderBook = {};

fetch('https://api.gdax.com/products/BTC-USD/book?level=2').then(
  function(response){
     return response.json();
    }
).then(function(data){
    console.log(data)
	orderBook= data;
});
```

output similar to
` test/mocks/btc-usd-order-book-level-2.json`

very useful

https://developers.google.com/web/tools/chrome-devtools/console/command-line-reference#copyobject



```
copy(JSON.stringify(products))
copy(JSON.stringify(orderBook))
```

