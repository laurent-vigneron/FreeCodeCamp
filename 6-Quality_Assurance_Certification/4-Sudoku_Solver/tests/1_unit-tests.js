/*
 *
 *
 *       FILL IN EACH UNIT TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]----
 *       (if additional are added, keep them at the very end!)
 */

const chai = require('chai');
const assert = chai.assert;

const jsdom = require('jsdom');
const { JSDOM } = jsdom;
let Solver;

suite('UnitTests', () => {
  suiteSetup(() => {
    // Mock the DOM for testing and load Solver
    return JSDOM.fromFile('./views/index.html')
      .then((dom) => {
        global.window = dom.window;
        global.document = dom.window.document;
        Solver = require('../public/sudoku-solver.js');
      });
  });
  
  // Only the digits 1-9 are accepted
  // as valid input for the puzzle grid
  suite('Function validInput()', () => {
    test('Valid "1-9" characters', (done) => {
      const input = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
      input.forEach((num) => { 
        let cell = Solver.validInput(num);
        // console.log(num, cell);
        assert.equal(cell, num);
      })
      done();
    });

    // Invalid characters or numbers are not accepted 
    // as valid input for the puzzle grid
    test('Invalid characters (anything other than "1-9") are not accepted', (done) => {
      const input = ['!', 'a', '/', '+', '-', '0', '10', 0, '.'];
      input.forEach((char) => { 
        let cell = Solver.validInput(char);
        // console.log(char, cell);
        assert.equal(cell, '.');
      })
      done();
    });
  });
  
  suite('Function init()', () => {
    test('Parses a valid puzzle string into an object', done => {
      const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const textArea = document.getElementById('text-input');
      Solver.init(input);
      assert.equal(textArea.value, input);
      done();
    });
    
    // Puzzles that are not 81 numbers/periods long show the message 
    // "Error: Expected puzzle to be 81 characters long." in the
    // `div` with the id "error-msg"
    test('Shows an error for puzzles that are not 81 numbers long', done => {
      const shortStr = '83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const longStr = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6...';
      const errorMsg = 'Error: Expected puzzle to be 81 characters long.';
      const errorDiv = document.getElementById('error-msg');
      Solver.init(shortStr);
      Solver.gridUpdate();
      assert.equal(errorDiv.innerHTML, errorMsg);
      Solver.init(longStr);
      Solver.gridUpdate();
      assert.equal(errorDiv.innerHTML, errorMsg);
      done();
    });
  });

  suite('Function ____()', () => {
    // Valid complete puzzles pass
    test('Valid puzzles pass', done => {
      const input = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
      const errorMsg = 'Solution found, grid updated accordingly.';
      const errorDiv = document.getElementById('error-msg');
      Solver.init(input);
      Solver.gridUpdate();
      document.getElementById('solve-button').click();
      assert.equal(errorDiv.innerHTML, errorMsg);
      done();
    });

    // Invalid complete puzzles fail
    test('Invalid puzzles fail', done => {
      const input = '779235418851496372432178956174569283395842761628713549283657194516924837947381625';
      const errorMsg = 'No solution has been found for this problem.';
      const errorDiv = document.getElementById('error-msg');
      Solver.init(input);
      Solver.gridUpdate();
      document.getElementById('solve-button').click();
      assert.equal(errorDiv.innerHTML, errorMsg);
      done();
    });
  });
  
  
  suite('Function ____()', () => {
    // Returns the expected solution for a valid, incomplete puzzle
    test('Returns the expected solution for an incomplete puzzle', done => {
      const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const solution = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
      const errorMsg = 'Solution found, grid updated accordingly.';
      const textArea = document.getElementById('text-input');
      const errorDiv = document.getElementById('error-msg');
      Solver.init(input);
      Solver.gridUpdate();
      document.getElementById('solve-button').click();
      assert.equal(errorDiv.innerHTML, errorMsg);
      assert.equal(textArea.value, solution);
      done();
    });
  });
});
