function palindrome(str) {
  let s = [...str.toLowerCase()].filter(item => /[^\W|_]/.test(item));
  let midPoint = Math.floor(s.length / 2);

  let partOne = s.slice(0,midPoint);
  let partTwo = s.length%2 == 0 ? s.slice(midPoint,s.length) : s.slice(midPoint+1,s.length);

  // palindrome if part 1 == part 2
  for(let i=0; i<partOne.length;i++) {
    if (partOne[i] !== partTwo[partTwo.length-1-i]) {
      return false;
    }
  }
  return true;
}

palindrome("_racecar");
