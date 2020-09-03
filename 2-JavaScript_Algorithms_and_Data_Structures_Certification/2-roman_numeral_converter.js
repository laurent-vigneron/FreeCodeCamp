const O = {1:'I',2:'II',3:'III',4:'IV',5:'V',6:'VI',7:'VII',8:'VIII',9:'IX'};
const T = {1:'X',2:'XX',3:'XXX',4:'XL',5:'L',6:'LX',7:'LXX',8:'LXXX',9:'XC'};
const H = {1:'C',2:'CC',3:'CCC',4:'CD',5:'D',6:'DC',7:'DCC',8:'DCCC',9:'CM'};

function convertToRoman(num) {
  let res = [];
  if (num/1000>=1) {
    for(let i=1;i<=Math.floor(num/1000);i++) {
      res.push('M');
    }
    num = num%1000;
  }
  if (num/100>=1) {
    res.push(H[Math.floor(num/100)]);
    num = num%100;
  }
  if (num/10>=1) {
    res.push(T[Math.floor(num/10)]);
    num = num%10;
  }
  if (num !== 0 ) {
    res.push(O[Math.floor(num)]);
  }
  return res.join('');
}

console.log(convertToRoman(1000));
