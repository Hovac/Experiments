var symbolSize = 26;
var fadeInterval = 1.6;
var streams = [];
var redValue = 0;
var greenValue = 255;
var blueValue = 50;
var speedValue = 9;
var opacity

window.addEventListener("input", function () {
    redValue = document.getElementById("Red").value;
    greenValue = document.getElementById("Green").value;
    blueValue = document.getElementById("Blue").value;
});

function windowResized() {
    resizeCanvas(windowWidth, window.innerHeight);
}

function setup() {
    createCanvas(
        window.innerWidth,
        window.innerHeight
    );

    background(0);

    var x = 0;

    for (var i = 0; i <= width / symbolSize; i++) {
        stream = new Stream();
        stream.generateSymbols(x, random(-1000, window.innerHeight));
        streams.push(stream);
        x += symbolSize;
    }

    textFont('Consolas');
    textSize(symbolSize);
}

function draw() {
    background(0, 150);

    streams.forEach(function (stream) {
        stream.render();
    });
}

function Symbol(x, y, speed, first, opacity) {
    this.x = x;
    this.y = y;
    this.value;
    this.speed = speed;

    this.first = first;
    this.opacity = opacity;

    this.switchInterval = round(random(5, 30));

    this.setToRandomSymbol = function () {
        var charType = round(random(0, 5));
        if (frameCount % this.switchInterval == 0) {
            if (charType > 1) {
                this.value = String.fromCharCode(
                    0x30A0 + round(random(0, 96))
                );
            }
            else {
                this.value = round(random(0, 9));
            }
        }
    }


    this.rain = function () {
        if (this.y >= height) {
            this.y = 0;

        }
        else {
            this.y += this.speed;
        }
    }
}

function Stream() {
    this.symbols = [];
    this.totalSymbols = round(random(5, 35));

    this.speed = random(speedValue * 0.33, speedValue * 1.2);

    this.generateSymbols = function (x, y) {
        var opacity = 255;
        var first = round(random(0, 4)) == 1;

        for (var i = 0; i <= this.totalSymbols; i++) {
            symbol = new Symbol(x, y, this.speed, first, opacity);
            symbol.setToRandomSymbol();
            this.symbols.push(symbol);
            opacity -= (255 / this.totalSymbols) / fadeInterval;
            y -= symbolSize;
            first = false;
        }

    }

    this.render = function () {
        this.symbols.forEach(function (symbol) {
            if (symbol.first) {
                fill(redValue+150, greenValue+50, blueValue+100, symbol.opacity);
            }
            else {
                fill(redValue, greenValue, blueValue, symbol.opacity);
            }
            text(symbol.value, symbol.x, symbol.y);
            symbol.rain();
            symbol.setToRandomSymbol();
        })
    }
}