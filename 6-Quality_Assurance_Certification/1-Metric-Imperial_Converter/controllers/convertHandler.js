/*
*
*
*       Complete the handler logic below
*       
*       
*/

function ConvertHandler() {
  
  this.getNum = function(input) {
    let result = input.trim();
    let firstLetter = input.trim().match(/[a-zA-Z]/);
    result = result.split(firstLetter)[0];
    let double = result.split('/');
    if(result.length===0) return 1;
    return (double.length>2) ? 'invalid' : eval(result);
  };
  
  this.getUnit = function(input) {
    let result;
    const units = ['gal','l','mi','km','lbs','kg','GAL','L','MI','KM','LBS','KG'];
    let firstLetter = input.trim().match(/[a-zA-Z]/);
    input = input.slice(firstLetter.index);
    return (units.indexOf(input)===-1) ? 'invalid' : units[units.indexOf(input)];
  };
  
  this.getReturnUnit = function(initUnit) {
    const units = ['gal','l','mi','km','lbs','kg','GAL','L','MI','KM','LBS','KG'];
    if (units.indexOf(initUnit)===-1) return 'invalid';
    if (units.indexOf(initUnit)%2===0) return units[units.indexOf(initUnit)+1].toLowerCase();
    return units[units.indexOf(initUnit)-1].toLowerCase();
  };

  this.spellOutUnit = function(unit) {
    const units = ['gal','l','mi','km','lbs','kg','GAL','L','MI','KM','LBS','KG'];
    const result= ['gallons','litres','miles','kilometres','pounds','kilograms','gallons','litres','miles','kilometres','pounds','kilograms'];    
    return result[units.indexOf(unit)];
  };
  
  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    let result;
    switch(initUnit) {
      case 'gal': 
      case 'GAL': return initNum * galToL;
      case 'l':
      case 'L': return initNum / galToL; 
      case 'mi':
      case 'MI': return initNum * miToKm;
      case 'km':
      case 'KM': return initNum / miToKm;
      case 'lbs':
      case 'LBS': return initNum * lbsToKg;
      case 'kg':
      case 'KG': return initNum / lbsToKg;
      default: return 'invalid';
    }
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    var result = initNum + ' ' + this.spellOutUnit(initUnit) + ' converts to ' + returnNum.toFixed(5) + ' ' + this.spellOutUnit(returnUnit);
    return result;
  };
  
}

module.exports = ConvertHandler;
