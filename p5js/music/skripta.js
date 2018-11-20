var music;
var playB;
var stopB;
var fw;
var bw;
var nextSong;
var prevSong;
var loopCheckTooltip;
var loopCheckValue = true;

var volSlider;
var volSliderTooltip;
var loopCheckElement;

var loadMessage;
var dropZone;

var stringSeconds;
var currentTimePause = [];

var offset = 0;
var strum = 1;

function setup() {
    soundFormats('mp3');
    colorMode(HSB);

    music = loadSound('c2c.mp3', funcSucc, funcErr);

    dropZone = createCanvas(document.body.clientWidth, document.documentElement.clientHeight);

    createElements();

    //  sets canvas to be acceptor for dragged sounds and calls functions to load new sounds
    dropZone.drop(gotFile);

    volSlider.class('sliderLook pink');
    volSlider.input(volSliderValues);

    loopCheckElement.mousePressed(loopingCheck);
    loopCheckTooltip.mousePressed(loopingCheck);

    //initializing objects to be used
    fft = new p5.FFT();
    amp = new p5.Amplitude();
}

function draw() {

    noStroke();
    background(246, 24, 14 + (3 * sin((frameCount / 30) % 360)));

    //checking if music file is loaded
    checkLoad();

    visuals();
    musicDuration();
}

function visuals() {
    //makes variations to amplitude level so it is usable in visual representation
    strokeWeight(0);

    /*         var level = amp.getLevel();

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
        } */


    var waveform = fft.waveform(1024, "stringilly");
    if (music.isPlaying()) {
        noFill();
        stroke((140 - (amp.getLevel() * 240)), 75, 75);
        smooth(1);
        strokeWeight(5 + 2 * amp.getLevel());
        beginShape();
        for (var i = 0; i < waveform.length; i++) {
            var x = map(i, 0, waveform.length, 0, width);
            var y = map(waveform[i], -1, 1, 3 * height / 4, height / 4);
            vertex(x, y);
        }
        endShape();
    } 
    if (!music.isPlaying()) {
        noFill();
        stroke(140, 75, 75);
        strokeWeight(3+2.5*sin(frameCount/40));
        beginShape();
        for(var x = 0; x < width; x++){
          //var angle = map(x, 0, width, 0, TWO_PI);
          var angle = offset + x * 0.01*3*sin(frameCount/64);
          // map x between 0 and width to 0 and Two Pi
          var y = map(sin(angle), -strum, strum, 300*sin(frameCount/32)+ height/2, -300*sin(frameCount/32)+height/2);
          vertex(x, y);
        }
        endShape();
        offset += 0.1;
        console.log(angle);
    }


    //currently FFT Spectrum gives extremely low energy reading at high frequencies ~15kHz and up. instead of giving constant cutoff frequency for all sounds, I need to implement function that will calculate at which frequency for that given moment or average on whole sound is so i can map it dynamically depending on the average frequency spectrum of the song. Or of course attenuate higher frequencies, but I like to keep things original.


    var cutoffFreq = 300;
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
        loopCheckElement.class('fas fa-3x fa-times');
        loopCheckTooltip.class('loopTooltipNotActive')
        loopCheckValue = false;
    }
    else if (loopCheckValue == false) {
        music.setLoop(true);
        loopCheckElement.class('fas fa-3x fa-check');
        loopCheckTooltip.class('loopTooltipActive')
        loopCheckValue = true;
    }
}


//////////////////////////////////////////////////////////////
// LOADING MUSIC
//////////////////////////////////////////////////////////////

//  function that handles loading music files
function gotFile(musicFile) {
    music.stop();
    music = loadSound(musicFile, funcSucc, funcErr);
    playB.class('fas fa-3x fa-play');
    loopCheckElement.class('fas fa-3xfa-check');
    loopCheckValue = true;
    music.setLoop(true);
}

function funcSucc() {
    console.log("loadano");
}

function funcErr() {
    console.log("erorcina brate");
}

function checkLoad() {
    if (music.isLoaded()) {
        playB.show();
        stopB.show();
        volSlider.show();
        loopCheckElement.show();
        loadMessage.hide();
    }
    else {
        fill(frameCount % 360, 50, 30);
        rect(0, 0, width, height);
        playB.hide();
        stopB.hide();
        volSlider.hide();
        loopCheckElement.hide();
        loadMessage.show();
    }
}
// LOADING MUSIC END

//////////////////////////////////////////////////////////////
// CONTROLLING MUSIC FLOW //
//////////////////////////////////////////////////////////////
function playPauseMusic() {
    if (!music.isPlaying()) {
        playB.class("fas fa-3x fa-pause");
        music.play();
    }
    else if (music.isPlaying()) {
        playB.removeClass("fas fa-3x fa-play");
        music.pause();
    }
}

//stops music
function stopMusic() {
    music.stop();
    playB.class("fas fa-3x fa-play");
}
//only changes icon from play/pause to play. currently only used when music ends on its own (no looping).
function stopMusicChangeIcon() {
    playB.class('fas fa-3x fa-play');
}
// CONTROLLING MUSIC FLOW END //


//////////////////////////////////////////////////////////////
// CREATING ELEMENTS VIA JAVASCRIPT //
//////////////////////////////////////////////////////////////
function createElements() {
    playB = createDiv();
    stopB = createDiv();
    fw = createDiv();
    bw = createDiv();
    loadMessage = createDiv();
    volSlider = createSlider(0, 1, 1, 0.01);
    volSliderTooltip = createSpan('Volume');
    loopCheckElement = createDiv();
    loopCheckTooltip = createSpan('Loop');

    playB.class('fas fa-play fa-3x');
    stopB.class('fas fa-stop fa-3x');
    fw.class('fas fa-forward fa-3x');
    bw.class('fas fa-backward fa-3x');
    loadMessage.class('fas fa-spinner fa-pulse fa-10x');
    volSlider.class("sliderLook");
    volSliderTooltip.id('volSliderTooltip');
    loopCheckElement.class('fas fa-3x fa-check');
    loopCheckTooltip.class('loopTooltipActive');

    playB.position(100, 90);
    stopB.position(260, 90);
    fw.position(180, 90);
    bw.position(20, 90)
    loadMessage.center();
    volSlider.position(20, 50);
    volSliderTooltip.position(volSlider.width * 2 + 60, 38);
    loopCheckElement.position(340, 90);
    loopCheckTooltip.position(400, 100);

    playB.mousePressed(playPauseMusic);
    stopB.mousePressed(stopMusic);
    volSlider.mouseOver(tooltipCreate);
    volSlider.mouseOut(tooltipDelete);

    volSliderTooltip.hide();
    music.setLoop(true);
}
// CREATE ELEMENTS VIA JAVASCRIPT END //


//////////////////////////////////////////////////////////////
// CONTROL ELEMENTS //
//////////////////////////////////////////////////////////////
//create and delete tooltip when hovering over volume slider
function tooltipCreate() {
    volSliderTooltip.show();
}
function tooltipDelete() {
    volSliderTooltip.hide();
}
// CONTROL ELEMENTS END //


//////////////////////////////////////////////////////////////
// DURATION OF MUSIC //
//////////////////////////////////////////////////////////////
function musicDuration() {
    var currentTimePerc = (music.currentTime() / music.duration()) * width;

    // current music time / duration
    strokeWeight(0);
    fill(0, 100, 100);
    textSize(14);

    // text displayed below duration bar
    text(leadingZeroTime(floor(music.currentTime() / 60)) + ':' + leadingZeroTime(floor(music.currentTime() % 60)) + ' / ' + leadingZeroTime(floor(music.duration() / 60)) + ':' + leadingZeroTime(floor(music.duration() % 60)), constrainTextTimer(currentTimePerc - 43), 25, 86);

    //drawing progress bar
    noStroke();
    fill(190, 70, 70);
    rect(0, 0, width, 10);

    // filling progress bar with the music
    fill(0, 85, 85);
    rect(0, 0, currentTimePerc, 10);
}

function constrainTextTimer(repairPosition) {
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
// DURATION OF MUSIC END //

//////////////////////////////////////////////////////////////
// VOLUME SLIDER //
//////////////////////////////////////////////////////////////
function volSliderValues() {

    music.setVolume(volSlider.value());

    value = volSlider.value();

    if (value > 0.2 && value < 0.4) {
        volSlider.class('sliderLook ltpurple');
    }
    else if (value > 0.4 && value < 0.6) {
        volSlider.class('sliderLook purple');
    }
    else if (value > 0.6) {
        volSlider.class('sliderLook pink');
    }
    else if (value < 0.2) {
        volSlider.class('sliderLook blue');
    }
}
// VOLUME SLIDER END //

//////////////////////////////////////////////////////////////
// RESIZE WINDOW // 
//////////////////////////////////////////////////////////////
window.addEventListener('resize', function () {
    resizeCanvas(document.body.clientWidth, windowHeight);
    playB.position(100, 90);
    stopB.position(260, 90);
    fw.position(180, 90);
    bw.position(20, 90)
    loadMessage.center();
    volSlider.position(20, 40);
    volSliderTooltip.position(volSlider.width * 2 + 60, 35);
    loopCheckElement.position(340, 90);
    loopCheckTooltip.position(400, 100);
});
// RESIZE WINDOW END //