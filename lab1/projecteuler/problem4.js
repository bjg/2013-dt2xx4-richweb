/*

 A palindromic number reads the same both ways. The largest palindrome made
 from the product of two 2-digit numbers is 9009 = 91 × 99.
 Find the largest palindrome made from the product of two 3-digit numbers.

 */

function isPalindrome(s) {
    if (s.length === 0 || s.length === 1) {
        return true;
    }
    if (s[0] != s[s.length -1 ]) {
        return false;
    }
    return isPalindrome(s.slice(1, s.length - 1));
}

var i, j, product, largest = 0;
for (i = 100; i < 1000; i++) {
    for (j = 100; j < 1000; j++) {
        product = i * j;
        if (product > largest && isPalindrome(product + "")) {
            largest = product;
        }
    }
}
            
console.log(largest);
