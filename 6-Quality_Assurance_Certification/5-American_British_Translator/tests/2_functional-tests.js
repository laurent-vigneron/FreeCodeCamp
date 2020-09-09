/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]----
 *       (if additional are added, keep them at the very end!)
 */

const chai = require('chai');
const assert = chai.assert;
let textInput;
let language;
let translation; 
let error;
let translateBtn;
let clearBtn;

let Translator;

suite('Functional Tests', () => {
  suiteSetup(() => {
    // DOM already mocked -- load translator then run tests
    Translator = require('../public/translator.js');
    textInput = document.getElementById('text-input');
    language = document.getElementById('locale-select');
    translation = document.getElementById('translated-sentence');
    error = document.getElementById('error-msg');
    translateBtn = document.getElementById('translate-btn');
    clearBtn = document.getElementById('clear-btn');
  });

  suite('Function ____()', () => {
    /* 
      The translated sentence is appended to the `translated-sentence` `div`
      and the translated words or terms are wrapped in 
      `<span class="highlight">...</span>` tags when the "Translate" button is pressed.
    */
    test("Translation appended to the `translated-sentence` `div`", done => {
      const input = 'Mangoes are my favorite fruit.';
      const output = 'Mangoes are my <span class="highlight">favourite</span> fruit.';
      textInput.value = input;
      Translator.init();
      translateBtn.click();
      assert.equal(translation.innerHTML, output);
      done();
    });

    /* 
      If there are no words or terms that need to be translated,
      the message 'Everything looks good to me!' is appended to the
      `translated-sentence` `div` when the "Translate" button is pressed.
    */
    test("'Everything looks good to me!' message appended to the `translated-sentence` `div`", done => {
      const input = 'Mangoes are a fruit.';
      const output = 'Everything looks good to me!';
      textInput.value = input;
      Translator.init();
      translateBtn.click();
      assert.equal(translation.innerHTML, output);
      done();
    });

    /* 
      If the text area is empty when the "Translation" button is
      pressed, append the message 'Error: No text to translate.' to 
      the `error-msg` `div`.
    */
    test("'Error: No text to translate.' message appended to the `translated-sentence` `div`", done => {
      const input = '';
      const output = 'Error: No text to translate.';
      textInput.value = input;
      Translator.init();
      translateBtn.click();
      assert.equal(error.innerHTML, output);
      done();
    });

  });

  suite('Function ____()', () => {
    /* 
      The text area and both the `translated-sentence` and `error-msg`
      `divs` are cleared when the "Clear" button is pressed.
    */
    test("Text area, `translated-sentence`, and `error-msg` are cleared", done => {
      textInput.value = '';
      Translator.init();
      translateBtn.click();
      assert.equal(error.innerHTML, 'Error: No text to translate.');
      clearBtn.click();
      assert.equal(error.innerHTML, '');
      textInput.value = 'Mangoes are a fruit.';
      translateBtn.click();
      assert.equal(translation.innerHTML, 'Everything looks good to me!');
      clearBtn.click();
      assert.equal(translation.innerHTML, '');
      done();
    });

  });

});
