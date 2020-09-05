'use strict';

const express = require('express');
const mongoose = require('mongoose');
const check = require('./urlCheck');
require('dotenv').config();

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }); 

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// define the Schema
var mySchema = new mongoose.Schema({
  _id: { type: Number },
  url: { type: String, required: true }
});

var Short = mongoose.model('Short', mySchema);

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post("/api/shorturl/new/", function (req, res) {
  if(!check(req.body.url)) {
    res.json({"error":"invalid URL"});
  } else {
    // check if there is already the url in our DB
    const original = req.body.url.split('://')[1];
    Short.findOne({ url: original }, (err, data) => {
      if(!err) {
        if (data != null) { // found one!
          res.json({ "original_url": original, "short_url": data._id });
        } else {
          // otherwise, add the new url to the DB
          Short.findOne().sort({_id: 'desc'}).exec((err, data) => {
            if(!err) {
              let id;
              (data === null) ? id = 1 : id = data._id+1;
              let newURL = new Short({ _id: id, url: original });
              newURL.save((err) => {
                if(err) { console.log('error while saving to DB: ', err);}
                else {
                  res.json({ "original_url": original, "short_url": id });
                }
              });
            }
          });
        }
      }
    });
  }
});

app.get("/api/shorturl/:shorturl", function (req, res) {
  Short.findById(req.params.shorturl, (err, data) => {
    if (err) {
      res.json({ "error": "No such Short_URL registered"});
    } else {
       res.redirect('https://' + data.url);
    }
  });
});

app.listen(port, function () {
  console.log(`'Node.js listening on port ${port}...`);
});