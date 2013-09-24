var assert = require("assert");

verify();

function iFact(n) {
    var i, fact = 1;

    if (n < 0) throw Error("Invalid argument");
    for (i = 2; i <= n; i++) {
        fact *= i;
    }
    return fact;
}
function rFact(n) {
    if (n < 0) throw Error("Invalid argument");
    if (n === 0 || n === 1) {
        return 1;
    }
    return n * rFact(n - 1);
}
function verify() {
    var n, factorials = [
        1,          // 0
        1,          // 1
        2,          // 2
        6,          // 3
        24,         // 4
        120,        // 5
        720,        // 6
        5040,       // 7
        40320,      // 8
        362880,     // 9
        3628800     // 10
    ]
    for (n = 0; n < factorials.length; n++) {
        assert(iFact(n) === factorials[n], "iFact(" + n + ") failed");
        assert(rFact(n) === factorials[n], "rFact(" + n + ") failed");
    }
    console.log("All tests passed");
}