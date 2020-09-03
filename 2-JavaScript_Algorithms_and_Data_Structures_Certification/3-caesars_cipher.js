const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function decode(char) {
  if (/\W|_/.test(char)) {
    return char;
  } else {
    if (ALPHA.indexOf(char) > 12) {
      return ALPHA[ALPHA.indexOf(char)-13];
    } else {
      return ALPHA[ALPHA.indexOf(char)+13];
    }
  }
 }

function rot13(str) {
  let s = [...str];
  let res = [];
  s.forEach(item => {
    res.push(decode(item));
  })
  return res.join('');
}

console.log(rot13("MSERR PBQR PNZC"));
