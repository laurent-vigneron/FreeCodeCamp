import { americanOnly } from './american-only.js';
import { britishOnly } from './british-only.js';
import { americanToBritishSpelling } from './american-to-british-spelling.js';
import { americanToBritishTitles } from './american-to-british-titles.js';

document.addEventListener('DOMContentLoaded', () => {
  init();
})

function init() {
  const screen = {
      textInput: document.getElementById('text-input'),
      language: document.getElementById('locale-select'),
      translation: document.getElementById('translated-sentence'),
      error: document.getElementById('error-msg'),
      translateBtn: document.getElementById('translate-btn'),
      clearBtn: document.getElementById('clear-btn')
  }
  
  screen.clearBtn.addEventListener('click', () => {
    screen.textInput.value = '';
    screen.translation.innerHTML = '';
    screen.error.innerHTML = '';
  })

  screen.translateBtn.addEventListener('click', () => { translate(screen) })
}

function translate(screen) {
  let result;
  if(screen.language.value==='american-to-british'){
    result = usToEn(screen.textInput.value);
  } else {
    result = enToUs(screen.textInput.value);
  }
  screen.error.innerHTML = (result==='') ? 'Error: No text to translate.' : '';
  screen.translation.innerHTML = result;
}

function usToEn(string) {
  let result = string;
  let reg;

  if(result==='') return '';

  let save = '';
  // British only
  Object.keys(americanOnly).forEach(term => {
    const regex =  new RegExp('^'+term+'(?=\\W)(?!-)|(?<=\\W)(?<!-)'+term+'(?=\\W)(?!-)|(?<=\\W)(?<!-)'+term+'$','ig'); 
    let temp = result.match(regex) || [''];
    if(temp[0].length>save.length) {
      save = term;
      reg = regex;
    }
  })
  result = result.replace(reg, `<span class="highlight">${americanOnly[save]}</span>`);

  save = '';
  // the rest
  Object.keys(americanToBritishSpelling).forEach(term => {
    const regex =  new RegExp('^'+term+'(?=\\W)(?!-)|(?<=\\W)(?<!-)'+term+'(?=\\W)(?!-)|(?<=\\W)(?<!-)'+term+'$','ig'); 
    let temp = result.match(regex) || [''];
    // console.log(temp, term);
    if(temp[0].length>save.length) {
      save = term;
      reg = regex;
    }
  })
  result = result.replace(reg, `<span class="highlight">${americanToBritishSpelling[save]}</span>`);

  Object.keys(americanToBritishTitles).forEach(term => {
    const regex =  new RegExp(term+' ','ig'); 
    const reference = result.match(regex) || term;
    // console.log(reference);
    result = result.replace(regex, `<span class="highlight">${matchCase(americanToBritishTitles[term]+'', reference[0].slice(0,-2))} </span>`);
  })

  // take care of time
  result = result.replace(/(\W\d?\d)[:](\d\d)/, '<span class="highlight">$1.$2</span>');

  if(result==string) {
    result = 'Everything looks good to me!';
  }

  return result;
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function matchCase(s1, s2) {
  let result = '';
  // console.log(s1, s1.length, s2, s2.length);
  for(let i=0; i<s2.length; i++){
    if(s2[i]===s2[i].toUpperCase()){
      result += s1[i].toUpperCase();
    } else {
      result += s1[i];
    }
  }
  return result;
}

function enToUs(string) {
  let result = string;
  let reg; // new RegExp(`(^${term}\\W)|(\\W${term}\\W)|(\\W${term}$)`,'ig');

  let save = '';
  // remove what is UK only
  for(let i=0; i<string.split(' ').length; i++) {
    Object.keys(britishOnly).forEach(term => {
    const regex =  new RegExp('^'+term+'(?=\\W)(?!-)|(?<=\\W)(?<!-)'+term+'(?=\\W)(?!-)|(?<=\\W)(?<!-)'+term+'$','ig'); 
      let temp = result.match(regex) || [''];
      // console.log(temp);
      if(temp[0].length>save.length) {
        save = term;
        reg = regex;
      }
      // console.log(save);
    })
    result = result.replace(reg, `<span class="highlight">${britishOnly[save]}</span>`);

    save = '';
    // the rest
    Object.values(americanToBritishSpelling).forEach(term => {
      const regex =  new RegExp('^'+term+'(?=\\W)(?!-)|(?<=\\W)(?<!-)'+term+'(?=\\W)(?!-)|(?<=\\W)(?<!-)'+term+'$','ig'); 
      let temp = result.match(regex) || [''];
      // console.log(temp);
      if(temp[0].length>save.length) {
        save = term;
        reg = regex;
      }
    })
    result = result.replace(reg, `<span class="highlight">${getKeyByValue(americanToBritishSpelling ,save)}</span>`);

    Object.values(americanToBritishTitles).forEach(term => {
      const regex =  new RegExp(term+' ','ig'); 
      const reference = result.match(regex) || term;
      // console.log(reference);
      result = result.replace(regex, `<span class="highlight">${matchCase(getKeyByValue(americanToBritishTitles, term), reference[0])} </span>`);
    })
  }

  // take care of time
  result = result.replace(/(\W\d?\d)[.](\d\d)/, '<span class="highlight">$1:$2</span>');

  if(result==string) {
    result = 'Everything looks good to me!';
  }
  return result;
}

/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/
try {
  module.exports.init = init,
  module.exports.translate = translate,
  module.exports.usToEn = usToEn,
  module.exports.enToUs = enToUs
} catch (e) {}
