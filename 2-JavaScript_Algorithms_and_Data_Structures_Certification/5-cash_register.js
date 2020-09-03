function sumRegister(cid) {
  let sum = 0;
  for(let i=0; i<cid.length;i++) {
    sum+=cid[i][1];
  }
  return sum;
}

function checkCashRegister(price, cash, cid) {
  let change = [];
  let isDue = Math.round((cash - price)*100)/100;
  
  if (isDue === sumRegister(cid)) {
    return {status: "CLOSED", change: cid};
  }

  let currency;
  for(let i=8;i>=0;i--) {
    switch (i) {
      case 8: currency = 100; break;
      case 7: currency = 20; break;
      case 6: currency = 10; break;
      case 5: currency = 5; break;
      case 4: currency = 1; break;
      case 3: currency = 0.25; break;
      case 2: currency = 0.1; break;
      case 1: currency = 0.05; break;
      case 0: currency = 0.01;
    }

    if (isDue / currency > 1) {
      if (isDue > cid[i][1]) {       // not enough of that?
        isDue = parseFloat(isDue - cid[i][1]).toFixed(2);  // take all you have
        change.push([cid[i][0],cid[i][1]]); // update the change
        cid[i][1] = 0;                        // update the register
      } else {                            // you have enough
        change.push([cid[i][0], Math.floor(isDue/currency)*currency]); 
        cid[i][1] = cid[i][1] - (Math.floor(isDue/currency) * currency );
        isDue = parseFloat(isDue - (Math.floor(isDue/currency) * currency )).toFixed(2);
      }
      
      if (isDue == 0) {
        return {status: "OPEN", change: change};
      }
    }
  }
  return {status: "INSUFFICIENT_FUNDS", change: []};
}

console.log(checkCashRegister(19.5, 20, [["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]));
