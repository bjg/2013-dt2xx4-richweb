var assert = require("assert");

verify();

function approximateE() {
    var n, e = 0;

    // We need about ten terms for 6 places of accuracy
    for (n = 0; n < 10; n++) {
        e += (1 / factorial(n));
    }
    return e;
}

function factorial(n) {
    if (n < 0) throw Error("Invalid argument");
    if (n === 0 || n === 1) {
        return 1;
    }
    return n * factorial(n - 1);
}

function verify() {
    assert(approximateE().toPrecision(6) === "2.71828");
    console.log("All tests pass");
}