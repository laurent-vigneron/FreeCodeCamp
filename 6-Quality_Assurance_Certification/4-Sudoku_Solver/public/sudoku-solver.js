

document.addEventListener('DOMContentLoaded', () => {
  init();
  gridUpdate();
})

function validInput(digit) {
  if(digit===null) {
    return '.';
  } else if (digit.toString().match(/[1-9]/) && digit.toString().length === 1) {
    return digit;
  } else return '.';
}

function addDigit(digit, index) {
  const textArea = document.getElementById('text-input');
  const error = document.getElementById('error-msg');
  textArea.value=textArea.value.slice(0,index) + validInput(digit) + textArea.value.slice(index+1);
  error.innerHTML = '';
}

function init(value = '') {
  const textArea = document.getElementById('text-input');
  const grid = document.querySelectorAll('input[type="text"]');
  const error = document.getElementById('error-msg');
  const solveBtn = document.getElementById('solve-button');
  const clearBtn = document.getElementById('clear-button');

  // Load a simple puzzle into the text area
  if(value==='') {
    textArea.value = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
  } else {
    textArea.value = value;
  }

  grid.forEach((cell, i) => {
    cell.addEventListener('input', (e) => { addDigit(e.data, i); })
  })

  textArea.addEventListener('input', (e) => {
    gridUpdate();
  })

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
}

function gridUpdate() {

  const textArea = document.getElementById('text-input');
  const grid = document.querySelectorAll('input[type="text"]');
  const error = document.getElementById('error-msg');

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

const puzzlesAndSolutions = [
  [
    '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
    '135762984946381257728459613694517832812936745357824196473298561581673429269145378'
  ],
  [
    '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3',
    '568913724342687519197254386685479231219538467734162895926345178473891652851726943'
  ],
  [
    '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1',
    '218396745753284196496157832531672984649831257827549613962415378185763429374928561'
  ],
  [
    '.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6',
    '473891265851726394926345817568913472342687951197254638734162589685479123219538746'
  ],
  [
    '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51',
    '827549163531672894649831527496157382218396475753284916962415738185763249374928651'
  ],
  [
    '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
    '769235418851496372432178956174569283395842761628713549283657194516924837947381625'
  ]
];


/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/
try {
  module.exports.init = init;
  module.exports.gridUpdate = gridUpdate;
  module.exports.addDigit = addDigit;
  module.exports.validInput = validInput; 
  module.exports.puzzlesAndSolutions = puzzlesAndSolutions;
} catch (e) {}
