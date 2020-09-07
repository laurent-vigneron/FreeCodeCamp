/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chai = require("chai");
const assert = chai.assert;

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
let Solver;

suite('Functional Tests', () => {
  suiteSetup(() => {
    // DOM already mocked -- load sudoku solver then run tests
    Solver = require('../public/sudoku-solver.js');
  });
  
  suite('Text area and sudoku grid update automatically', () => {
    // Entering a valid number in the text area populates 
    // the correct cell in the sudoku grid with that number
    test('Valid number in text area populates correct cell in grid', done => {
      const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const textArea = document.getElementById('text-input');
      const lastDiv = document.getElementById('I9');
      Solver.init(input);
      Solver.gridUpdate();
      assert.equal(lastDiv.value, '');
      textArea.value = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.9';
      Solver.gridUpdate();
      assert.equal(lastDiv.value, '9');
      done();
    });

    // Entering a valid number in the grid automatically updates
    // the puzzle string in the text area
    test('Valid number in grid updates the puzzle string in the text area', done => {
      const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const textArea = document.getElementById('text-input');
      Solver.init(input);
      Solver.gridUpdate();
      assert.equal(textArea.value, input);
      Solver.addDigit('9', 80);
      assert.equal(textArea.value, input.slice(0,-1) + '9');
      done();
    });
  });
  
  suite('Clear and solve buttons', () => {
    // Pressing the "Clear" button clears the sudoku 
    // grid and the text area
    test('Function clearInput()', done => {
      const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.9';
      const lastDiv = document.getElementById('I9');
      const textArea = document.getElementById('text-input');
      Solver.init(input);
      Solver.gridUpdate();
      assert.equal(lastDiv.value, '9');
      assert.equal(textArea.value, input);
      document.getElementById('clear-button').click();
      Solver.gridUpdate();
      assert.equal(lastDiv.value, '');
      assert.equal(textArea.value, '.'.repeat(81));
      done();
    });
    
    // Pressing the "Solve" button solves the puzzle and
    // fills in the grid with the solution
    test('Function showSolution(solve(input))', done => {
      const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const solution = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
      const errorMsg = 'Solution found, grid updated accordingly.';
      const textArea = document.getElementById('text-input');
      const errorDiv = document.getElementById('error-msg');
      const lastDiv = document.getElementById('I9');
      Solver.init(input);
      Solver.gridUpdate();
      document.getElementById('solve-button').click();
      assert.equal(errorDiv.innerHTML, errorMsg);
      assert.equal(textArea.value, solution);
      assert.equal(lastDiv.value, '5');
      done();
    });
  });
});

