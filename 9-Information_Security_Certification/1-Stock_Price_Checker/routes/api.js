/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;
const axios = require('axios');


module.exports = function (app, db) {

  app.route('/api/stock-prices')
    .get(function (req, res){

      // get the stock provided (or the first one if two were proveded)
      let stockName = (typeof req.query.stock === 'string') ? req.query.stock : req.query.stock[0];

      // check API to see if you get a response
      axios.get(`https://repeated-alpaca.glitch.me/v1/stock/${stockName}/quote`)
        .catch(function (error) {
          res.status(200).json("Error while fetching Stock information");
        })
        .then(function (response) {
          if (typeof response.data === 'undefined') {
            res.status(200).json("Stock " + stockName + " could not be found");
          } else { // data for first Stock found
            let stock1Name = stockName;
            let stock1Price = response.data.latestPrice;
            let stock1Likes = 0;
            const ip = req.get('x-forwarded-for') || req.connection.remoteAddress;
            let newIp = [ip]

            // Stock is valid, but do we have it in our DB?
            db.collection('stocks').findOne({ name: stock1Name })
              .then(stock => {
                if(stock === null) {  // Stock not in DB, add it
                  db.collection('stocks').insertOne({
                    name: stockName,
                    likes: 0,
                    ip: []
                    }, (err, result) => {
                      if(err) { res.status(400).json('Problem while adding the Stock into the Database. ' + err); }
                    }
                  )
                } else { // stock present in the DB
                  stock1Likes = stock.likes;
                  newIp = [...stock.ip];
                  newIp.push(ip);
                }

                // stock either added or was already in the DB
                // Now let's check if there is a second stock provided
                if(typeof req.query.stock !== 'string'){
                  axios.get('https://repeated-alpaca.glitch.me/v1/stock/' + req.query.stock[1] + '/quote')
                    .then(function (response2) {
                      if (typeof response2.data === 'undefined') {
                        res.status(200).json("Stock " + req.query.stock[1] + " could not be found");
                      } else {  // Stock is valid, but do we have this second stock in our DB?
                        let stock2Name = req.query.stock[1];
                        let stock2Price = response2.data.latestPrice;
                        let stock2Likes = 0;
                        let newIp2 = ip;
                        db.collection('stocks').findOne({ name: req.query.stock[1] })
                          .then(stock2 => {
                            if(stock2 === null) {  // if stock not in DB, add it
                              db.collection('stocks').insertOne({
                                name: stock2Name,
                                likes: 0,
                                ip: []
                                }, (err, result) => {
                                  if(err) { res.status(400).json('Problem while adding the Stock into the Database. ' + err); }
                                }
                              )
                            } else {  // Stock already present in DB, proceed to answer
                              stock2Likes = stock2.likes;
                              newIp2 = [...stock2.ip];
                              newIp2.push(ip);
                            }
                            if(req.query.like==='true'){
                              if(!stock.ip.includes(ip)) {  // this ip is not already there
                                stock1Likes += 1;
                                db.collection('stocks').updateOne({
                                  name: stock1Name }, { "$set": { likes: stock1Likes, ip: newIp }})
                                  .then(res_amend => console.log("Stock's like updated."))
                                  .catch(err => console.error(`Could not update {${req.query.stock[0]}} `+err));
                              }
                              if(!stock2.ip.includes(ip)) {  // this ip is not already there
                                stock2Likes += 1;
                                db.collection('stocks').updateOne({
                                  name: stock2Name }, { "$set": { likes: stock2Likes, ip: newIp2 }})
                                  .then(res_amend => console.log("Stock's like updated."))
                                  .catch(err => console.error(`Could not update {${req.query.stock[1]}} `+err));
                              }
                            }

                            // Reply for the 2 stock scenario
                            //  {"stockData":[{"stock":"MSFT","price":"62.30","rel_likes":-1},{"stock":"GOOG","price":"786.90","rel_likes":1}]} 
                            res.status(200).json({ 'stockData': [{ 'stock': stock1Name, 'price': stock1Price, 'likes': stock1Likes - stock2Likes }, { 'stock': stock2Name, 'price': stock2Price, 'likes': stock2Likes - stock1Likes }]}) 
                          })

                        
                      }
                    })
                    .catch(err => console.log(`Failed to find this stock: ${err}`)); 

                } else {  // Only one stock was provided, let's answer accordingly
                  if(req.query.like === 'true'){ 
                    if(!stock.ip.includes(ip)) {  // this ip is not already there
                      stock1Likes += 1;
                      let newIp = stock.ip;
                      newIp.push(ip);
                      db.collection('stocks').updateOne({
                        name: stock1Name }, { "$set": { likes: stock1Likes, ip: newIp }})
                        .then(res_amend => console.log("Stock's like updated."))
                        .catch(err => console.error(`Could not update {${req.query.stock[0]}} `+err));
                    }
                  }
                  res.status(200).json({ 'stockData': { 'stock': stock1Name, 'price': stock1Price, 'likes': stock1Likes }});
                }


              })
              .catch(err => console.log(err));

            
          }
        })
    })
}
    