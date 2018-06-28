var resultBox = document.getElementById("resultBox");
var result = "0";
var button = document.getElementById("one");
var broj = 0;


var brojcanik = function tipka() {
    if (document.getElementById("one") === true){
        broj = 1;
    }
    result = toString(brojcanik);
    resultBox.value = result;
}