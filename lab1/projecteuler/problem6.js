/*
Find the difference between the sum of the squares of the first one hundred
natural numbers and the square of the sum.
*/

var _ = require('lodash');

var sum = function(acc, n) { return acc + n }
var sqr = function(n) { return n * n }
var numbers = _.range(101);
console.log(sqr(_.reduce(numbers, sum)) - _.reduce(_.map(numbers, sqr), sum));
