var music;
var playB;
var stopB;
var dropZone;
var volSlider;
var loopCheckElement;
var loopCheckValue = true;
var loadMessage;
var volSliderTooltip;
var stringSeconds;
var currentTimePause = [];

// self explanatory, loads first music and sets global variable music
function preload() {
    soundFormats('mp3');
    music = loadSound('dev.mp3');
}

function setup() {

    colorMode(HSB);

    dropZone = createCanvas(document.body.clientWidth, document.documentElement.clientHeight);
    //  sets canvas to be acceptor for dragged sounds and calls functions to load new sounds
    dropZone.drop(gotFile);

    // creates and positions the buttons
    createElements();

    //initializing objects to be used
    fft = new p5.FFT(0.85);
    amp = new p5.Amplitude();
}

function draw() {

    noStroke();
    background(213, 66, 55 + (5 * sin((frameCount / 30) % 360)));

    loopCheckElement.mousePressed(loopingCheck);

    //make slider for volume 
    music.setVolume(volSlider.value());

    //checking if music file is loaded
    checkLoad();


    visuals();
    musicDuration();

}

function musicDuration() {
    var currentTimePerc = (music.currentTime() / music.duration()) * width;

    //currently redundant, maybe will be used for something later?
    /*  var minuteCurrentTime = floor(music.currentTime() / 60);
    var secondsCurrentTime = floor(music.currentTime() % 60);
    var durationMinutes = floor(music.duration() / 60);
    var durationSeconds = floor(music.duration() % 60); */

    // current music time / duration
    strokeWeight(0);
    fill(0, 100, 100);
    textSize(14);
    text(leadingZeroTime(floor(music.currentTime() / 60)) + ':' + leadingZeroTime(floor(music.currentTime() % 60)) + ' / ' + leadingZeroTime(floor(music.duration() / 60)) + ':' + leadingZeroTime(floor(music.duration() % 60)), repairTimerPosition(currentTimePerc - 43), 25, 86);

    //drawing progress bar
    noStroke();
    fill(190, 70, 70);
    rect(0, 0, width, 10);


    if (music.isPlaying()) {
        for (i = 0; i < music.currentTime(); i++) {
            currentTimePause[i] = currentTimePerc;
            console.log(currentTimePause[currentTimePause.length - 1]);
        }
    }
    else if (music.isPaused()) {
        fill(0, 85, 85);
        rect(0, 0, currentTimePause[currentTimePause.length - 1], 10);
        currentTimePause.length = 0;
        console.log(currentTimePause[currentTimePause.length - 1]);
    }



    // filling progress bar with the music
    fill(0, 85, 85);
    rect(0, 0, currentTimePerc, 10);
}

function repairTimerPosition(repairPosition) {
    if (repairPosition < 0) {
        return 0;
    }
    else if (repairPosition > width - 86) {
        endPosition = width - 86;
        return endPosition;
    }
    else {
        return repairPosition;
    }
}

function visuals() {
    //makes variations to amplitude level so it is usable in visual representation
    strokeWeight(0);
    var level = amp.getLevel();
    var size = map(level, 0, 0.3, 20, windowHeight / 4);

    /*     if (!music.isPlaying()) {
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
        } */


    var waveform = fft.waveform();
    noFill();
    beginShape();
    stroke((140 - (amp.getLevel() * 240)), 75, 75);
    smooth(1);
    strokeWeight(5 + 2 * amp.getLevel());
    for (var i = 0; i < waveform.length; i++) {
        var x = map(i, 0, waveform.length, 0, width);
        var y = map(waveform[i], -1, 1, 3 * height / 4, height / 4);
        vertex(x, y);
    }
    endShape();



    //currently FFT Spectrum gives extremely low energy reading at high frequencies ~15kHz and up. instead of giving constant cutoff frequency for all sounds, I need to implement function that will calculate at which frequency for that given moment or average on whole sound is so i can map it dynamically depending on the average frequency spectrum of the song. Or of course attenuate higher frequencies, but I like to keep things original.
    var cutoffFreq = 330;

    var spectrum = fft.analyze(1024, "dB");
    noStroke();
    fill(140 - amp.getLevel() * 180, 75, 75);


    for (var i = 0; i < spectrum.length - cutoffFreq; i++) {
        var x = map(i, 0, spectrum.length - cutoffFreq, 0, width);
        var h = -height + map(spectrum[i] + 140, 0, 255, height, 0);
        rect(x, height, width / spectrum.length, h / 2)
    }


    music.onended(stopMusicChangeIcon);
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
    playB.removeClass("fa-play");
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
    playB.position(30, 50);
    playB.mousePressed(playPauseMusic);

    stopB.addClass('fas fa-stop fa-3x');
    stopB.position(100, 50);
    stopB.mousePressed(stopMusic);

    loadMessage.addClass('fas fa-spinner fa-pulse fa-10x');
    loadMessage.center();

    volSlider = createSlider(0, 1, 0.5, 0.01);
    volSlider.position(180, 65);
    volSlider.mouseOver(tooltipCreate);
    volSlider.mouseOut(tooltipDelete);

    volSliderTooltip = createSpan('Volume');
    volSliderTooltip.id('volSliderTooltip');
    volSliderTooltip.position(213, 100);

    volSliderTooltip.removeClass('hideTooltip');
    volSliderTooltip.removeClass('showTooltip');
    volSliderTooltip.addClass('hideTooltip');

    loopCheckElement = createDiv();
    loopCheckElement.addClass('fas fa-times fa-3x');
    loopCheckElement.position(330, 50);

    loopCheckElement.removeClass('fa-times');
    loopCheckElement.removeClass('fa-check');
    loopCheckElement.addClass('fa-check');
    music.setLoop(true);
}

function tooltipCreate() {
    volSliderTooltip.removeClass('hideTooltip');
    volSliderTooltip.removeClass('showTooltip');
    volSliderTooltip.addClass('showTooltip');
}

function tooltipDelete() {
    volSliderTooltip.removeClass('hideTooltip');
    volSliderTooltip.removeClass('showTooltip');
    volSliderTooltip.addClass('hideTooltip');

}

//returns leading zero if time is less than 10
function leadingZeroTime(timeVar) {
    if (timeVar < 10) {
        leadingZeroVar = `0${timeVar}`;
    }
    else {
        leadingZeroVar = timeVar;
    }
    return leadingZeroVar;
}

//  make sure that canvas is always 100% of the user browser window
/* window.onresize = function () {
    resizeCanvas(document.body.clientWidth, windowHeight);
    playB.position(30, 50);
    stopB.position(100, 50);
    volSlider.position(180, 65);
    loopCheckElement.position(330, 50);
    loadMessage.center();
}; */

window.addEventListener('resize', function () {
    resizeCanvas(document.body.clientWidth, windowHeight);
    playB.position(30, 50);
    stopB.position(100, 50);
    volSlider.position(180, 65);
    loopCheckElement.position(330, 50);
    loadMessage.center();
});

function checkLoad() {
    if (music.isLoaded()) {
        playB.show();
        stopB.show();

        loadMessage.hide();
    }
    else {
        fill(frameCount % 360, 50, 30);
        rect(0, 0, width, height);
        playB.hide();
        stopB.hide();
        loadMessage.show();
    }
}