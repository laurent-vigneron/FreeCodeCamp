const textArea = document.getElementById('text-input');
const grid = document.querySelectorAll('input[type="text"]');
const error = document.getElementById('error-msg');
const solveBtn = document.getElementById('solve-button');
const clearBtn = document.getElementById('clear-button');

import { puzzlesAndSolutions } from './puzzle-strings.js';

document.addEventListener('DOMContentLoaded', () => {

  // Load a simple puzzle into the text area
  textArea.value = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';

  grid.forEach((cell, i) => {
    cell.addEventListener('input', (e) => {
      if(e.data===null) { 
        textArea.value=textArea.value.slice(0,i) + '.' + textArea.value.slice(i+1);
      } else if (!isNaN(e.data)) {
        textArea.value=textArea.value.slice(0,i) + e.data + textArea.value.slice(i+1);
      }
      error.innerHTML = '';
    })
  })

  textArea.addEventListener('input', (e) => {
    gridUpdate();
  })

  gridUpdate();

  clearBtn.addEventListener('click', () => {
    textArea.value = '.'.repeat(81);
    gridUpdate();
  })

  solveBtn.addEventListener('click', () => {
    let solution = false;
    puzzlesAndSolutions.forEach(puzzle => {
      let solved = true;
      [...textArea.value].forEach((char, i) => {
        if(textArea.value[i] !== '.') {
          if(textArea.value[i]!==puzzle[1][i]){
            solved = false;
          }
        }
      })
      if(solved) {
        solution = true;
        textArea.value = puzzle[1];
        gridUpdate();
        error.innerHTML = 'Solution found, grid updated accordingly.'
      }
    })
    if(!solution){
      error.innerHTML = 'No solution has been found for this problem.'
    }
  })
});

function gridUpdate() {
  if(textArea.value.length === 81) {
    error.innerHTML = '';
    grid.forEach((cell, i) => {
      if(textArea.value[i]!=='.' && !isNaN(textArea.value[i])) {
        cell.value=textArea.value[i];
      } else {
        cell.value=''
      }
    })
  } else {
    error.innerHTML = 'Error: Expected puzzle to be 81 characters long.'
  }
}

/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/
try {
  module.exports = {
    
  }
} catch (e) {}
