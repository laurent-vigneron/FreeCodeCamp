'use strict';

var express = require('express');
var mongoose = require('mongoose');
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
  username: { type: String, required: true, lowercase: true },
  log: [{
    description: String,
    duration: Number,
    date: Date
  }],
  count: { type: Number, default: 0 }
});

var Exercise_Tracker_Users = mongoose.model('Exercise_Tracker_Users', mySchema);
var Users = Exercise_Tracker_Users;

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});
 
app.post("/api/exercise/new-user", function (req, res) {
  // is username already taken?
  Users.findOne({ username: req.body.username }, (err, data) => {
    if(!err) {
      if (data != null) { // found one!
        res.json({ "error": "username already taken" });
      } else {
        // otherwise, add the new url to the DB
        let newURL = new Users({ username: req.body.username });
        newURL.save((err, data) => {
          if(err) { console.log('error while saving to DB: ', err);}
          else {
            res.json({ "username": data.username, "_id": data._id });
          }
        });
      }
    }
  });
});

app.post("/api/exercise/add", function (req, res) {
  // req.body.userid, exercise, duration, date
  if (req.body.userId === '' || req.body.description==='' || req.body.duration ==='') {
    res.json({ 'error': 'Exercise fields cannot be empty.'})
  } else {
    Users.findById( req.body.userId, (err, data) => {
      if(!err) {
        if (data != null) { // found the username
          let date = (req.body.date==='' || typeof(req.body.date)==='undefined') ? new Date() : new Date(req.body.date);
          data.count += Number(req.body.duration);
          data.log.push({
            description: req.body.description,
            duration: Number(req.body.duration),
            date: date
          });
          data.save((err) => {
            if(err) { res.json({'error': 'Problem while saving to the DB - '+err }) }
            else { 
              res.json({'_id': data._id, 'username': data.username, 'description': req.body.description, 'duration': Number(req.body.duration), 'date': date.toString().slice(0,15)});
            }
          });
        } else {
          res.send("Unknown userId");
        }
      }
    });
  }
});

app.get("/api/exercise/users", function (req, res) {
  // returns the list of all the currently registered users
  Users.find({ }, (err, data) => {
    if(!err) {
      let result = [];
      data.forEach(person => result.push({ 'username': person.username, '_id': person._id }));
      res.json(result);
      
    } else {
      res.json({ 'error': err});
    }
  });
});

app.get("/api/exercise/log", function (req, res) {
  // GET /api/exercise/log?{userId}[&from][&to][&limit]
  Users.findById(req.query.userId).exec((err, data) => {
    if(!err) {
      if (data != null) { // found the username
        let logs = { '_id': data.id, 'username': data.username, count: 0, 'log': []};
        let count = 0;
        data.log.forEach(item => {
          const qfrom = (typeof(req.query.from)==='undefined')? new Date(0) : new Date(req.query.from);
          const qto = (typeof(req.query.to)==='undefined')? new Date() : new Date(req.query.to);
          if(item.date <= qto && item.date >= qfrom) {
            if(logs.log.length < req.query.limit || typeof(req.query.limit)==='undefined') {
              logs.log.push({ description: item.description, duration: item.duration, date: item.date.toString().slice(0,15)});
              count += item.duration;
            }
          }
        });
        logs.count = count;
        res.json(logs);
      } else {
        res.send("Unknown userId");
      }
    }
  }); 
});

app.listen(port, function () {
  console.log(`Node.js listening on port ${port}...`);
});