/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const expect = require('chai').expect;
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

module.exports = function (app) {

  MongoClient.connect(process.env.DB, function(err, client) {
    if(err) { console.log('DB error: ' + err); }
    else {
      const db = client.db('FCCPersonalLibrary');
      // db.collection('books').drop();  // only useful for running the tests
      console.log('DB connection successful.');
  
      app.route('/api/books')
        .get(function (req, res){
          //response will be array of book objects
          //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
          console.log('new get request detected on books');
          db.collection('books').find()
            .toArray()
            .then(books => {
              res.status(200).json(books);
            })
            .catch(err => console.error(`Failed to find any book: ${err}`));  
        })
      
        .post(function (req, res){
          //response will contain new book object including atleast _id and title

          console.log('new post request detected on books');
          db.collection('books').insertOne({
            title: req.body.title,
            comments: [],
            commentcount: 0,
            added_on: new Date(),
            updated_on: new Date()
            }, (err, result) => {
              if(err) { res.status(400).json('Problem while adding the new Book into the Database. ' + err); }
              else { res.status(200).json(result.ops[0]); }
            }
          );
        })
      
        .delete(function(req, res){
          //if successful response will be 'complete delete successful'
          console.log('new delete request detected on books');
          db.collection('books').deleteMany()
            .then(result => {
              res.status(200).json('complete delete successful');
            })
            .catch(err => console.error(`Failed to delete all books: ${err}`));  

        });



      app.route('/api/books/:id')
        .get(function (req, res){
          var bookid = req.params.id;
          //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
          console.log(req.params);
          console.log('new get request detected on one book');
          db.collection('books').findOne({ _id: ObjectId(req.params.id) })
            .then(book => {
              console.log(book);
              res.status(200).json(book);
            })
            .catch(err => console.error(`Failed to find the issues: ${err}`)); 
        })
      
        .post(function(req, res){
          var bookid = req.params.id;
          var comment = req.body.comment;
          //json res format same as .get

          console.log('new post request detected on one book');
          db.collection('books').findOne({
            _id: ObjectId(req.params.id) })
            .then(book => {
              book.comments.push(req.body.comment);
              book.commentcount++;
              db.collection('books').updateOne({
                _id: ObjectId(req.params.id) }, { "$set": { comments: book.comments, commentcount: book.commentcount }})
              .then(data => {
                res.status(200).json(book);
              })
              .catch(err => console.error(`Could not update {${req.params._id}} `+err));
            })
            .catch(err => console.error(`error while adding the comment: ${err}`))

          
        })
      
        .delete(function(req, res){
          //if successful response will be 'delete successful'

          console.log('new delete request detected on books');
          db.collection('books').deleteOne({ _id: ObjectId(req.body.id) })
            .then(result => {
              res.status(200).json('delete successful');
            })
            .catch(err => console.error(`Failed to delete the book: ${err}`));  

        });

    }
  });
};
