// init project
var express = require('express');
var app = express();
require('dotenv').config();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// API endpoint for the data timestamp
app.get("/api/timestamp/:date_string?", function (req, res) {
  console.log(req.path, req.params.date_string, req.params);
  if (typeof req.params.date_string === 'undefined'){
    let date = new Date();
    res.json({'unix': date.getTime(), 'utc': date.toUTCString()});
  } else {
    let date = new Date(req.params.date_string);
    if (date instanceof Date && !isNaN(date)){
      // valid date
      res.json({'unix': date.getTime(), 'utc': date.toUTCString()});
    } else {
      let date = new Date(Number(req.params.date_string));
      if (date instanceof Date && !isNaN(date)){
        // valid date
        res.json({'unix': date.getTime(), 'utc': date.toUTCString()});
      } else {
      res.json({'error' : 'Invalid Date'});
      }
    }
  }
});

// listen for requests
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});