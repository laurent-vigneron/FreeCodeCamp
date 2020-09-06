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

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'Title #1',
            issue_text: 'Functional Test - Every field filled in',
            created_by: 'john',
            assigned_to: 'Chai and Mocha',
            status_text: 'In QA'
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.issue_title, "Title #1");
            assert.equal(res.body.issue_project, "test");
            assert.equal(res.body.issue_text, "Functional Test - Every field filled in");
            assert.equal(res.body.created_by, "john");
            assert.equal(res.body.assigned_to, "Chai and Mocha");
            assert.equal(res.body.status_text, "In QA");
            assert.equal(res.body.open, true);
            assert.property(res.body, 'created_on');
            assert.property(res.body, 'updated_on');
            done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'Title #2',
            issue_text: 'Functional Test - Required fields filled in',
            created_by: 'john',
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.issue_title, "Title #2");
            assert.equal(res.body.issue_project, "test");
            assert.equal(res.body.issue_text, "Functional Test - Required fields filled in");
            assert.equal(res.body.created_by, "john");
            assert.equal(res.body.open, true);
            assert.property(res.body, 'created_on');
            assert.property(res.body, 'updated_on');

            // saving the ID for future use in testing the PUT request
            issueId = res.body._id;
            done();
        });
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'Title #3',
            issue_text: 'Functional Test - Missing required fields',
          })
          .end(function(err, res){
            assert.equal(res.status, 400);
            assert.equal(res.body, "Error: all the mandatory fields were not provided");
            done();
        });
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({
            _id: issueId
          })
          .end(function(err, res){
            assert.equal(res.status, 400);
            assert.equal(res.body, "No updated fields sent");
            done();
        });
      });
      
      test('One field to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({
            _id: issueId,
            status_text: 'One field updated'
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body, "Successfully updated");
            done();
        });
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({
            _id: issueId,
            issue_title: 'Title #2 - Updated',
            issue_text: 'Updated along other fields',
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body, "Successfully updated");
            done();
        });
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({ assigned_to: 'Chai and Mocha' })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body[0].issue_title, "Title #1");
          done();
        });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({ created_by: 'john', open: true })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body[0].issue_title, "Title #1");
          assert.equal(res.body[1].issue_title, "Title #2 - Updated");
          done();
        });
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({ })
        .end(function(err, res){
          assert.equal(res.status, 400);
          assert.equal(res.body, "_id error");
          done();
        });
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({ _id: issueId })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.include(res.body, "Deleted {");
          done();
        });
      });
      
    });

});
