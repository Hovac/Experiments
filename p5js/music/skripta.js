var music;
var playB;
var stopB;
var dropZone;
var volSlider;
var loopCheckElement;
var loopCheckValue = true;
var loadMessage;

// self explanatory, loads first music and sets global variable music
function preload() {
    soundFormats('mp3');
    music = loadSound('kung.mp3');
}

function setup() {

    colorMode(HSB);

    dropZone = createCanvas(document.body.clientWidth, document.documentElement.clientHeight);
    //  sets canvas to be acceptor for dragged sounds and calls functions to load new sounds
    dropZone.drop(gotFile);

    // creates and positions the buttons
    createElements();

    //initializing objects to be used
    fft = new p5.FFT();
    amp = new p5.Amplitude([0.9]);

    loopCheckElement.removeClass('fa-times');
    loopCheckElement.removeClass('fa-check');
    loopCheckElement.addClass('fa-check');
    music.setLoop(true);
}

function draw() {

    noStroke();
    background(213, 66, 55 + (5 * sin((frameCount / 30) % 360)));

    loopCheckElement.mousePressed(loopingCheck);

    //make slider for volume 
    music.setVolume(volSlider.value());

    //checking if music file is loaded
    checkLoad();

    /*     visuals();
     */

    var waveform = fft.waveform();
    noFill();
    beginShape();
    stroke((140 - (amp.getLevel() * 280)), 75, 75);
    smooth(0.99);
    strokeWeight(5 + 2 * amp.getLevel());
    for (var i = 0; i < waveform.length; i++) {
        var x = map(i, 0, waveform.length, 0, width);
        var y = map(waveform[i], -1, 1, 3 * height / 4, height / 4);
        vertex(x, y);
    }
    endShape();

    music.onended(stopMusicChangeIcon);

}

function checkLoad() {
    if (music.isLoaded()) {
        playB.show();
        stopB.show();
        loadMessage.hide();
    }
    else {
        fill(360, 50, 30);
        rect(0, 0, width, height);
        playB.hide();
        stopB.hide();
        loadMessage.show();
    }
}

function visuals() {
    //makes variations to amplitude level so it is usable in visual representation
    var level = amp.getLevel();
    var size = map(level, 0, 0.3, 20, windowHeight / 4);

    if (!music.isPlaying()) {
        fill(frameCount % 360, 35, 50);
        ellipse(width / 2, height / 2, width, sin(frameCount / 40) * 300);
        fill(frameCount % 360, 35, 50);
        rect(0, height / 2, width, height / 2);
    }
    // if music is playing, give some nice visual feedback *WORK IN PROGRESS*
    else {
        fill((120 - (level * 160)), 75, 35 + level * 30);
        ellipse(width / 2, height - size * 1.25, width, size);
        fill((120 - (level * 160)), 75, 35 + level * 30);
        rect(0, height - size * 1.25, width, height);
    }
}

//sets loop flag to the music variable
function loopingCheck() {
    if (loopCheckValue == true) {
        music.setLoop(false);
        loopCheckElement.removeClass('fa-times');
        loopCheckElement.removeClass('fa-check');
        loopCheckElement.addClass('fa-times');
        loopCheckValue = false;
    }
    else if (loopCheckValue == false) {
        music.setLoop(true);
        loopCheckElement.removeClass('fa-times');
        loopCheckElement.removeClass('fa-check');
        loopCheckElement.addClass('fa-check');
        loopCheckValue = true;
    }
}

//  function that handles loading music files
function gotFile(musicFile) {
    music.stop();
    music = loadSound(musicFile);
    if (music.isLoaded() == true) {
        music.play();
    }
    playB.removeClass('fa-play');
    playB.removeClass("fa-pause");
    playB.addClass("fa-play");
    loopCheckElement.removeClass('fa-times');
    loopCheckElement.removeClass('fa-check');
    loopCheckElement.addClass('fa-check');
    loopCheckValue = true;
    music.setLoop(true);
}

//  function that handles playing and pausing. First checks if music is loaded, then checks if music is paused or stopped and plays it, or if music is playing and pauses it.
//  Lastly checks if music isn't loaded and later will be used for other stuff
function playPauseMusic() {
    if (!music.isPlaying()) {
        playB.removeClass("fa-play");
        playB.removeClass("fa-pause");
        playB.addClass("fa-pause");
        music.play();
    }
    else if (music.isPlaying()) {
        playB.removeClass("fa-pause");
        playB.removeClass("fa-play");
        playB.addClass("fa-play");
        music.pause();
    }
}

//stops music
function stopMusic() {
    music.stop();
    playB.removeClass('fa-play');
    playB.removeClass("fa-pause");
    playB.addClass("fa-play");
}

function stopMusicChangeIcon() {
    playB.removeClass('fa-play');
    playB.removeClass("fa-pause");
    playB.addClass("fa-play");
}

function createElements() {
    playB = createDiv();
    stopB = createDiv();
    loadMessage = createDiv();

    playB.addClass('fas fa-play fa-3x');
    stopB.addClass('fas fa-stop fa-3x');
    loadMessage.addClass('fas fa-spinner fa-pulse fa-10x');

    playB.position(30, 50);
    stopB.position(100, 50);
    loadMessage.position(width / 2, height / 2);

    playB.mousePressed(playPauseMusic);
    stopB.mousePressed(stopMusic);

    volSlider = createSlider(0, 1, 0.5, 0.01);
    volSlider.position(180, 65);

    loopCheckElement = createDiv();
    loopCheckElement.addClass('fas fa-times fa-3x');
    loopCheckElement.position(330, 50);
}

//  make sure that canvas is always 100% of the user browser window
window.onresize = function () {
    resizeCanvas(document.body.clientWidth, windowHeight);
    playB.position((width / 2), 50);
    stopB.position((width / 2), 100);
    volSlider.position((width / 2), 150);
    loopCheckElement.position(width / 2, 200);
    loadMessage.position(width / 2, height / 2);
};