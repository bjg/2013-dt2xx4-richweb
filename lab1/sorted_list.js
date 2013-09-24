var assert = require("assert");

var sortedList = [];
// Generate a sequence of random numbers and insert them (in sorted order) into the array
var i, r;
for (i = 0; i < 1000; i++) {
   r = getRandomInt(1, 10000);
   sortedInsert(sortedList, r);
}
verifyIsSorted(sortedList);

function sortedInsert(list, number) {
    // Find the index of the first entry higher than number
    var index = 0;
    while (index < list.length && list[index] <= number) {
        index++;
    }
    list.splice(index, 0, number);
    return list;
}

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function verifyIsSorted(sortedList) {
    // Check that the list is correctly sorted
    for (i = 1; i < sortedList.length; i++) {
        try {
            assert.ok(sortedList[i - 1] <= sortedList[i], "Failed assertion at index " + i);
        } catch (e) {
            process.exit(1);
        }
    }
    console.log("All tests passed");
}