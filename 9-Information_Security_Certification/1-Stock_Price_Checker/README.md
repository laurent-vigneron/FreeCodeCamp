# Information Security - Project #1
## Stock-Price Checker

### See it in action

[check on Repl.it](...)

---
### Introduction

The Functional tests for this project took me some time to get right, mainly because the slowness of the both the API and the web Database (MongoDB Atlas) meant that it took more than the allowed 2000ms to perform the tasks. 
So I had to increase the timeout to 5 seconds in order to get the tests to pass correctly.

As for the logic itself, the main complexity was to make sure all asynchronous calls were resolved before moving to the next step in the process.

Lastly, in order to pass the test I have to drop the DB at each startup, which would of course not normally occur otherwise.

Note that the MiddleWare I'm using as an API (https://repeated-alpaca.glitch.me/v1/stock/msft/quote) takes some time to 'wake-up' the first time it is used. So make sure you wake it first, otherwise you will get a timeout on the tests.

---
### Technologies
* JavaScript
* NodeJS
* Express
* MongoDB 
* Chai
* Axios
---
### User Stories

1. Set the content security policies to only allow loading of scripts and css from your server.
2. I can GET /api/stock-prices with form data containing a Nasdaq stock ticker and receive back an object stockData.
3. In stockData, I can see the stock(string, the ticker), price(decimal in string format), and likes(int).
4. I can also pass along field like as true(boolean) to have my like added to the stock(s). Only 1 like per ip should be accepted.
5. If I pass along 2 stocks, the return object will be an array with both stock's info but instead of likes, it will display rel_likes(the difference between the likes on both) on both.
6. A good way to receive current price is the following external API(replacing 'GOOG' with your stock): https://finance.google.com/finance/info?q=NASDAQ%3aGOOG
7. All 5 functional tests are complete and passing.

## Example usage:

/api/stock-prices?stock=goog
/api/stock-prices?stock=goog&like=true
/api/stock-prices?stock=goog&stock=msft
/api/stock-prices?stock=goog&stock=msft&like=true

## Example return:

`{"stockData":{"stock":"GOOG","price":"786.90","likes":1}}`
`{"stockData":[{"stock":"MSFT","price":"62.30","rel_likes":-1},{"stock":"GOOG","price":"786.90","rel_likes":1}]}` 