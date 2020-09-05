'use strict';

const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
require('dotenv').config();

const app = express();

// Basic Configuration 
const port = process.env.PORT || 3000;

app.use(cors());
app.use(fileUpload({ createParentPath: true }));

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});
 
app.post("/api/upload", function (req, res) {
  res.json({ name: req.files.upfile.name , type: req.files.upfile.mimetype , size: req.files.upfile.size });
});



app.listen(port, function () {
  console.log(`Node.js listening on port ${port}...`);
});