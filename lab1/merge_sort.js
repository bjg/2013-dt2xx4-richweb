var assert = require("assert");

var randomList = [];
// Generate a sequence of random numbers in an (initially unsorted) array
var i, r;
for (i = 0; i < 1000; i++) {
    r = getRandomInt(1, 10000);
    randomList.push(r);
}
verifyIsSorted(mergeSort(randomList));

function mergeSort(list, comparator) {
    if (comparator === undefined) {
        comparator = function(a, b) { return a - b; }
    }
    var merge = function(left, right) {
        var i, j;
        var merged = [];
        for (i = 0, j = 0; i < left.length && j < right.length;) {
            if (comparator(left[i], right[j]) < 0) {
                merged.push(left[i++]);
            } else {
                merged.push(right[j++]);
            }
        }
        while (comparator(i, left.length) < 0) {
            merged.push(left[i++]);
        }
        while (comparator(j, right.length) < 0) {
            merged.push(right[j++]);
        }
        return merged;
    };

    if (list.length === 0 || list.length === 1) {
        return list;
    }
    var middle = list.length / 2;
    return merge(mergeSort(list.slice(0, middle)), mergeSort(list.slice(middle)));
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
            console.log(e);
            process.exit(1);
        }
    }
    console.log("All tests passed");
}