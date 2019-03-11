//Given an array of integers, return a new array 
//such that each element at index i of the new array 
//is the product of all the numbers in the original array 
//except the one at i.

//For example, if our input was [1, 2, 3, 4, 5], 
//the expected output would be [120, 60, 40, 30, 24]. 
//If our input was [3, 2, 1], the expected output would be [2, 3, 6].


    var nums = [5,4,3,2,1];
    var newNums = [];
    var product;

    for (var i = 0; i< nums.length; i++) {
        product = nums[i];
        for (var j = 0; j < nums.length; j++) {
            product = product * nums[j];
        }
        product = product / Math.pow(nums[i], 2);
        newNums.push(product);
    }

    for (var i = 0; i< newNums.length; i++) {
        console.log(newNums[i]);
    }
