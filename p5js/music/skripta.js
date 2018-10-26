var music;
var playB;
var stopB;
var dropZone;
var checkFile = false;
// self explanatory, loads first music and sets global variable music
function preload() {
    soundFormats('mp3');
    music = loadSound('dev.mp3');
}

function setup() {
    dropZone = createCanvas(document.body.clientWidth, document.documentElement.clientHeight);
    colorMode(HSB);
    // creates and positions the buttons
    playB = createButton('Play/Pause');
    stopB = createButton('Stop');

    playB.position((width / 2), 50);
    stopB.position((width / 2), 100);

    playB.mousePressed(playPauseMusic);
    stopB.mousePressed(stopMusic);


    amp = new p5.Amplitude([0.9]);

    //  sets canvas to be acceptor for dragged sounds and calls functions to load new sounds
    dropZone.drop(gotFile);
}

function draw() {
    noStroke();
    background(200, 65, 52);

    //makes variations to amplitude level so it is usable in visual representation
    var level = amp.getLevel();
    var size = map(level, 0, 0.3, 20, windowHeight / 4);

    // if music is loaded and IS NOT playing, give visual feedback to the user
    if (!music.isPlaying() && music.isLoaded() == true) {
        fill(frameCount % 360, 35, 50);
        ellipse(width / 2, height / 2, width, sin(frameCount / 40) * 300);
        fill(frameCount % 360, 35, 50);
        rect(0, height / 2, width, height / 2);
    }
    // if music is playing, give some nice visual feedback *WORK IN PROGRESS*
    else if (music.isPlaying()) {
        fill((120 - (level * 160)), 75, 35 + level * 30);
        ellipse(width / 2, height - size*1.25, width, size);
        fill((120 - (level * 160)), 75, 35 + level * 30);
        rect(0, height - size*1.25, width, height);
    }
    // checks if music is not loaded and gives graphical display for the user to know
    else if (music.isLoaded() == false) {
        fill(180, 0, 0);
        ellipse(width / 2, height / 2, width, 300);
    }

}

//  function that handles loading music files
function gotFile(musicFile) {
    music.stop();
    music = loadSound(musicFile);
    if (music.isLoaded() == true) {
        music.play();
        console.log("radi");
    }
}

//  function that handles playing and pausing. First checks if music is loaded, then checks if music is paused or stopped and plays it, or if music is playing and pauses it.
//  Lastly checks if music isn't loaded and later will be used for other stuff
function playPauseMusic() {
    if (music.isLoaded() == true) {
        console.log("loadano");
        if (!music.isPlaying()) {
            music.play();
            console.log("svira");
        }
        else if (music.isPlaying()) {
            music.pause();
            console.log("nesviri");
        }
    }
    else if (music.isLoaded() == false) {
        console.log("cekaj");
    }
}

//stops music
function stopMusic() {
    music.stop();
}

//  make sure that canvas is always 100% of the user browser window
window.onresize = function () {
    resizeCanvas(document.body.clientWidth, windowHeight);
    playB.position((width / 2), 50);
    stopB.position((width / 2), 100);
};