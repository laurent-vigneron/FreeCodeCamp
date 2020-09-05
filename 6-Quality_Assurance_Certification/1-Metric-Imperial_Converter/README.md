# Quality Assurance Certification - Project #1
# Metric / Imperial converter

## Introduction
For this project the server and front-end parts were provided (with a few exceptions), to the bulk of the work consisted of writing the test (using Chai JS and Zombie) and the conversion logic.
Nothing too complicated. One thing leads to another and before you know it it's all working.
However there are two requirement that are security related (#1 and #2 below), which both require the use of the `helmet` library, which is only discussed in the 'Security' Chapter of FreeCodeCamp. So I was surprised to find such requirements here...
Also, if you Clone this, don't forget to set `NODE_ENV` to `test` without quotes in your .env (if you're using dotenv) or your environment variables. Otherwise the tests are not run.
---
### User stories:
1. I will help prevent the client from trying to guess(sniff) the MIME type.
2. I will prevent cross-site scripting (XSS) attacks.
3. I can GET /api/convert with a single parameter containing an accepted number and unit and have it converted. Hint: Split the input by looking for the index of the first character.
4. I can convert 'gal' to 'L' and vice versa. (1 gal to 3.78541 L)
5. I can convert 'lbs' to 'kg' and vice versa. (1 lbs to 0.453592 kg)
6. I can convert 'mi' to 'km' and vice versa. (1 mi to 1.60934 km)
7. If my unit of measurement is invalid, returned will be 'invalid unit'.
8. If my number is invalid, returned with will 'invalid number'.
9. If both are invalid, return will be 'invalid number and unit'.
10. I can use fractions, decimals or both in my parameter(ie. 5, 1/2, 2.5/6), but if nothing is provided it will default to 1.
11. My return will consist of the initNum, initUnit, returnNum, returnUnit, and string spelling out units in format {initNum} {initial_Units} converts to {returnNum} {return_Units} with the result rounded to 5 decimals.
12. All 16 unit tests are complete and passing.
13. All 5 functional tests are complete and passing.

### Usage :
* /api/convert?input=4gal
* /api/convert?input=1/2km
* /api/convert?input=5.4/3lbs
* /api/convert?input=kg

### Example Return:
* {initNum: 3.1, initUnit: 'mi', returnNum: 5.0000008, returnUnit: 'km', string: '3.1 miles converts to 5.00002 kilometers'}
---
## Technologies
* NodeJS
* Express
* Chai
* Zombie
* Helmet
---
## See it in action
[Check on Repl.it](https://TrueScentedQuadrant--five-nine.repl.co)
