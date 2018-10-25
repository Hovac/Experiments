var music;
var dz;

function preload() {
    soundFormats('mp3');
    music = loadSound('JazzFight.mp3');
}

function setup() {
    dz = createCanvas(document.body.clientWidth, document.documentElement.clientHeight);
    amp = new p5.Amplitude([0.9]);
    music.play();
    console.log(music.isLoaded());
}


function draw() {
    background(51);

    var level = amp.getLevel();
    var size = map(level, 0, 0.3, 5, windowHeight);
    fill(255);
    stroke(51);
    ellipse(width/2, height/2,width,size);

    dz.mousePressed();
    dz.dragOver(highlight);

    function highlight() {
        dz.background(255);
    }
}

window.onresize = function() {
    resizeCanvas(document.body.clientWidth, windowHeight);
};