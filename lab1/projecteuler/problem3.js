/*
 The prime factors of 13195 are 5, 7, 13 and 29.

 What is the largest prime factor of the number 600851475143 ?

 */

var _ = require("lodash");

function primeFactors(n) {
    // Finds the prime factors of 'n'
    if (n == 1) { return [1]; }
    var factors = []
    var limit = Math.round(Math.sqrt(n)) + 1;
    for (check = 2; check < limit; check++) {
        while (n % check === 0) {
            factors.push(check);
            n /= check;
        }
    }
    if (n > 1) {
        factors.push(n);
    }
    return factors;
}
    
console.log(_.last(primeFactors(600851475143)));