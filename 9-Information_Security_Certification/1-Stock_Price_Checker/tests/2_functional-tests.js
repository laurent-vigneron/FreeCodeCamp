/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

chai.request(server)
  .get('/api/stock-prices')
  .query({stock: 'aapl'})
  .end()

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      test('1 stock', function(done) {
        this.timeout(5000);
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: 'goog'})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.property(res.body, 'stockData');
            assert.typeOf(res.body, 'object', 'returning object should be of type object');
            assert.property(res.body.stockData, 'stock', 'stockData object should have a name element');
            assert.property(res.body.stockData, 'price', 'stockData object should have a price element');
            assert.equal(res.body.stockData.likes, 0, 'first request should have no like');
            done(); 
          });
      });
      
      test('1 stock with like', function(done) {
        this.timeout(5000);
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: 'goog', like: 'true'})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.stockData.likes, 1, 'second request should have one like');
            done(); 
          }); 
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        this.timeout(5000);
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: 'goog', like: 'true'})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.stockData.likes, 1, 'Third request should also only have one like (same IP)');
            done(); 
        });
      });

      test('2 stocks', function(done) {
        this.timeout(5000);
        chai.request(server)
          .get('/api/stock-prices')
          .query({ stock: ['goog', 'msft'] })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.stockData[0].likes, 1, '1st stock should have one more like');
            assert.equal(res.body.stockData[1].likes, -1, '2nd stock should have one less like');
            done(); 
        });
      });

      test('2 stocks with like', function(done) {
        this.timeout(5000);
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: ['goog', 'msft'], like: 'true'})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.stockData[0].likes, 0, 'both stocks should now have the same number of likes');
            assert.equal(res.body.stockData[1].likes, 0, 'both stocks should now have the same number of likes');
            done(); 
        });
      });

    });

});
