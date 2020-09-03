function telephoneCheck(str) {
  let check1 = /^1?[-| ]?[(]?\d{3}[)]?[-| ]?\d{3}[-| ]?\d{4}$/.test(str);
  if (str.indexOf('(') !== -1) {
    if (str.indexOf(')') === -1) { // '(' but not ')'
      return false;
    } 
  } else {
      if (str.indexOf(')') !== -1) { // ')' but not '('
        return false;
      }
  } 
  return check1;
}

console.log(telephoneCheck("1 555-555-5555"));
