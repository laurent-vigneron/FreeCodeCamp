/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';
require('dotenv').config();

const expect = require('chai').expect;
const MongoClient = require('mongodb');
const { set } = require('../server');
const ObjectId = require('mongodb').ObjectID;

module.exports = function (app) {

  MongoClient.connect(process.env.DB, (err, client) => {
    if(err) { console.log('DB error: ' + err); }
    else {
      const db = client.db('FCCIssueTrackingDB');
      db.collection('issues').drop();
      console.log('DB connection successful.');

      app.route('/api/issues/:project')      
        .post((req, res) => {
          // console.log('POST request received, creation in progress...');

          db.collection('issues').findOne({
            issue_project: req.params.project,
            issue_title: req.body.issue_title
            }, (err, issue) => { 
              if(err) { console.log('Error while checking the DB for that issue' + err); }
              else if(issue) { res.status(400).json('Error: identical title already exists for this project'); }
              else if(typeof req.body.issue_title === 'undefined' || typeof req.body.issue_text === 'undefined' || typeof req.body.created_by === 'undefined') {
                res.status(400).json('Error: all the mandatory fields were not provided');
              }
              else {
                db.collection('issues').insertOne({
                  issue_title: req.body.issue_title,
                  issue_project: req.params.project,
                  issue_text: req.body.issue_text,
                  created_by: req.body.created_by,
                  assigned_to: req.body.assigned_to,
                  status_text: req.body.status_text,
                  open: true,
                  created_on: new Date(),
                  updated_on: new Date()
                  }, (err, result) => {
                    if(err) { res.status(400).json('Problem while adding the new Issue into the Database. ' + err); }
                    else { res.status(200).json(result.ops[0]); }
                  }
                );
              }
            }
          );
        })

        .get(function (req, res){
          // console.log('GET request received...');
          let selection = { issue_project: req.params.project };
          if(req.query.issue_title) selection.issue_title = req.query.issue_title;
          if(req.query.issue_text) selection.issue_text = req.query.issue_text;
          if(req.query.created_by) selection.created_by = req.query.created_by;
          if(req.query.assigned_to) selection.assigned_to = req.query.assigned_to;
          if(req.query.status_text) selection.status_text = req.query.status_text;
          if(req.query.open) selection.open = (req.query.open === 'true');
          db.collection('issues').find(selection)
            .toArray()
            .then(issues => {
              res.status(200).json(issues);
            })
            .catch(err => console.error(`Failed to find the issues: ${err}`));  
        })

        .put(function (req, res){
          // console.log('modification request received...');
          let selection = { "updated_on": new Date() };
          if(req.body.issue_title) selection.issue_title = req.body.issue_title;
          if(req.body.issue_text) selection.issue_text = req.body.issue_text;
          if(req.body.created_by) selection.created_by = req.body.created_by;
          if(req.body.assigned_to) selection.assigned_to = req.body.assigned_to;
          if(req.body.status_text) selection.status_text = req.body.status_text;
          if(req.body.open) selection.open = false;
          if(req.body.issue_title || req.body.issue_text || req.body.created_by || req.body.assigned_to || req.body.status_text || typeof req.body.open !== 'undefined') { 
            if(typeof req.body._id === 'undefined') res.status(400).json('_id error');
            db.collection('issues').updateOne({
                _id: ObjectId(req.body._id) }, { "$set": selection })
              .then(result => {
                res.status(200).json('Successfully updated')
              })
              .catch(err => console.error(`Could not update {${req.body._id}} `+err));  
          } else {
            res.status(400).json('No updated fields sent');
          }
        })
        
        .delete(function (req, res){
          // console.log('delete request received...');
          if(typeof req.body._id === 'undefined') { res.status(400).json('_id error'); }
          else {
            db.collection('issues').deleteOne({
                _id: ObjectId(req.body._id)
              })
              .then(result => {
                res.status(200).json(`Deleted {${req.body._id}}`)
              })
              .catch(err => console.error(`Could not delete {${req.body._id}}`));  
          }
        });
    }
  });  
};
