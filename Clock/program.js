function update() {
    const currentTime = new Date();
    const seconds = currentTime.getSeconds();
    const minutes = currentTime.getMinutes();
    const hours = currentTime.getHours();
    degrees(seconds, minutes, hours);
}

function degrees(sec, min, hour) {
    const secDegrees = sec * 6 + 90;
    const minDegrees = min * 6 + 90;
    const hourDegrees = hour * 15 + 90;
    display(secDegrees, minDegrees, hourDegrees);
}

function display(secDeg, minDeg, hourDeg) {
    secHand.style.transform = `rotate(${secDeg}deg)`;
    minHand.style.transform = `rotate(${minDeg}deg)`;
    hourHand.style.transform = `rotate(${hourDeg}deg)`;
}

setInterval(update, 1000);

var secHand = document.querySelector('.second-hand');
var minHand = document.querySelector('.min-hand');
var hourHand = document.querySelector('.hour-hand');


