/*

2520 is the smallest number that can be divided by each of the numbers
from 1 to 10 without any remainder.
What is the smallest positive number that is evenly divisible by all
of the numbers from 1 to 20?

*/

var _ = require("lodash");

// We only need to test from 19 to 10 as all of those are either prime
// or a product of two numbers in the range 1 to 9
var factors = _.range(10, 20).reverse();
var worstCase = _.reduce(factors, function(acc, n) { return acc * n; });

function isDivisibleBy(n, factors) {
    var i;
    for (i = 0; i < factors; i++) {
        if (n % factors[i] != 0) {
            return false;
        }
    }
    return true;
}

var n;
for (n = 20; n <= worstCase; n += 20) {
    if (isDivisibleBy(n, factors)) {
        // The first one we find will be the smallest, so we're done
        console.log(n);
        break;
    }
}

