class ElemDisplay {

    constructor() {
        this.playB = createDiv();
        this.stopB = createDiv();
        this.fw = createDiv();
        this.bw = createDiv();
        this.songName = createSpan('');
        this.volSlider = createSlider(0, 1, 1, 0.01);


        this.playB.class('fas fa-play fa-3x');
        this.stopB.class('fas fa-stop fa-3x');
        this.fw.class('fas fa-forward fa-3x');
        this.bw.class('fas fa-backward fa-3x');
        this.volSlider.class("sliderLook pink");

        this.playB.position(100, 90);
        this.stopB.position(260, 90);
        this.fw.position(180, 90);
        this.bw.position(20, 90)
        this.volSlider.position(20, 50);
    }

    constrainTextTimer = (repairPosition) => {
        if (repairPosition < 0) {
            return 0;
        }
        else if (repairPosition > width - 86) {
            return width - 86;
        }
        else {
            return repairPosition;
        }
    }

    //returns leading zero if time is less than 10
    leadingZeroTime = (timeVar) => {
        if (timeVar < 10) {
            return `0${timeVar}`;
        }
        else {
            return timeVar;
        }
    }

    musicDuration = (m) => {
        //drawing progress bar
        noStroke();
        fill(190, 70, 70);
        rect(0, 0, width, 5);
        // current music time / duration
        strokeWeight(0);
        fill(349, 75, 75);
        textSize(14);
        if (m.isPlaying()) {
            this.currentTimePerc = (m.currentTime() / m.duration()) * width;
            this.textPaused = this.leadingZeroTime(floor(m.currentTime() / 60)) + ':' + this.leadingZeroTime(floor(m.currentTime() % 60)) + ' / ' + this.leadingZeroTime(floor(m.duration() / 60)) + ':' + this.leadingZeroTime(floor(m.duration() % 60))
            text(this.textPaused, this.constrainTextTimer(this.currentTimePerc - 43), 20, 86);
        }
        else if (m.isPaused()) {
            text(this.textPaused, this.constrainTextTimer(this.currentTimePerc - 43), 25, 86);
        }
        // filling progress bar with the music
        fill(349, 75, 75);
        rect(0, 0, this.currentTimePerc, 5);
    }

    volumeVisuals = (v) => {
        if (v > 0.2 && v < 0.4) {
            this.volSlider.class('sliderLook ltpurple');
        }
        else if (v > 0.4 && v < 0.6) {
            this.volSlider.class('sliderLook purple');
        }
        else if (v > 0.6) {
            this.volSlider.class('sliderLook pink');
        }
        else if (v < 0.2) {
            this.volSlider.class('sliderLook blue');
        }
    }


    loadedSuccess() {

    }

    loadedFail() {

    }

    whileLoading() {

    }

    checkMusicLoaded = (m) => {
        if (m.isLoaded()) {
            this.playB.show();
            this.stopB.show();
            this.fw.show();
            this.bw.show();
            this.volSlider.show();
        }
        else {
            fill(frameCount % 360, 50, 30);
            rect(0, 0, width, height);
            this.playB.hide();
            this.stopB.hide();
            this.fw.hide();
            this.bw.hide();
            this.volSlider.hide();
        }
    }

    musicPlayPause = (m) => {
        if (m.isPlaying()) {
            this.playB.class("fas fa-3x fa-play");
            m.pause()
        }
        else if (!m.isPlaying()) {
            this.playB.class("fas fa-3x fa-pause");
            m.play();
        }
    }

    musicStop = (m) => {
        m.stop();
        this.playB.class("fas fa-3x fa-play");
        this.currentTimePerc = 0;
    }

    resizeCanvas = () => {
        this.playB.position(100, 90);
        this.stopB.position(260, 90);
        this.fw.position(180, 90);
        this.bw.position(20, 90)
        this.volSlider.position(20, 50);
        this.songName.position(330, 40);
    }
}