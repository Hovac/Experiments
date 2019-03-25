//main varijable
var dropZone;
var elem;
var music;


//vizualizacija
var offset = 0;
var strum = 1;

function setup() {
    soundFormats('mp3');
    colorMode(HSB);
    fft = new p5.FFT();
    amp = new p5.Amplitude();
    elem = new ElemDisplay();

    music = loadSound('kung.mp3', funcSucc, funcErr, loading);
    music.setLoop(false);

    dropZone = createCanvas(document.body.clientWidth, document.documentElement.clientHeight);
    //  sets canvas to be acceptor for dragged sounds and calls functions to load new sounds
    dropZone.drop(gotFile);

    elem.volSlider.input(volumeControl);

}

function draw() {
    noStroke();
    background(246, 24, 14 + (3 * sin((frameCount / 30) % 360)));

    visuals();

    elem.musicDuration(music);

    elem.playB.mouseClicked(musicPlayPause);
    elem.stopB.mouseClicked(musicStop);
}

function musicPlayPause() {
    elem.musicPlayPause(music);
}
function musicStop() {
    elem.musicStop(music);
}



//////////////////////////////////////////////////////////////
// LOADING MUSIC
//////////////////////////////////////////////////////////////

//  function that handles loading music files
function gotFile(musicFile) {
    music.stop();
    music = loadSound(musicFile, funcSucc, funcErr, loading);
    music.setLoop(false);
}

function funcSucc() {
    /*     elem.songName = createSpan(music.file.name.replace(/\..+$/, ''));
        elem.songName.position(330, 40);
        elem.songName.class('songList'); */
        console.log("loaded");
}

function funcErr() {
    console.log("Error fetching the file");
}

function loading() {
    console.log("loading");
}
// LOADING MUSIC END

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


    var waveform = fft.waveform(1024, "string");

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
        strokeWeight(3 + 2.5 * sin(frameCount / 32));
        beginShape();
        for (var x = 0; x < width; x++) {
            //var angle = map(x, 0, width, 0, TWO_PI);
            var angle = offset + x * 0.01 * 3 * sin(frameCount / 64);
            // map x between 0 and width to 0 and Two Pi
            var y = map(sin(angle), -strum, strum, 300 * sin(frameCount / 32) + height / 2, -300 * sin(frameCount / 32) + height / 2);
            vertex(x, y);
        }
        endShape();
        offset += 0.1;
    }


    //currently FFT Spectrum gives extremely low energy reading at high frequencies ~15kHz and up. 
    //instead of giving constant cutoff frequency for all sounds, I need to implement function that will 
    //calculate at which frequency for that given moment or average on whole sound is so i can 
    //map it dynamically depending on the average frequency spectrum of the song. Or of course attenuate higher frequencies, 
    //but I like to keep things as original as they can get.

    var cutoffFreq = 300;
    var spectrum = fft.analyze(1024, "dB");
    noStroke();
    fill(140 - amp.getLevel() * 180, 75, 75);

    for (var i = 0; i < spectrum.length - cutoffFreq; i++) {
        var x = map(i, 0, spectrum.length - cutoffFreq, 0, width);
        var h = -height + map(spectrum[i] + 140, 0, 255, height, 0);
        rect(x, height, width / spectrum.length, h / 2)
    }

    music.onended(function () {
        elem.playB.class("fas fa-3x fa-play");
    });
}


function volumeControl() {
    music.setVolume(elem.volSlider.value());
    elem.volumeVisuals(elem.volSlider.value());
}

function windowResized() {
    resizeCanvas(document.body.clientWidth, windowHeight);
    elem.resizeCanvas();
}