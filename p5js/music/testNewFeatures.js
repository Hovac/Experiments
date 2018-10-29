var osc;
var fft;

function setup(){
  createCanvas(document.body.clientWidth, 100);
  osc = new p5.Oscillator();
  osc.amp(0);

  osc.start();
  fft = new p5.FFT();
}

function draw(){
  background(0);

  var freq = map(mouseX, 0, 800, 20, 15000);
  freq = constrain(freq, 1, 20000);
  osc.freq(freq);

  var spectrum = fft.analyze();
  noStroke();
  fill(0,255,0); // spectrum is green
  for (var i = 0; i< spectrum.length - 600; i++){
    var x = map(i, 0, spectrum.length, 0, width);
    var h = -height + map(spectrum[i], 0, 255, height, 0);
    rect(x, height, width / spectrum.length, h );
  }

  stroke(255);
  text('Freq: ' + round(freq)+'Hz', 10, 10);

  isMouseOverCanvas();
}

// only play sound when mouse is over canvas
function isMouseOverCanvas() {
  var mX = mouseX, mY = mouseY;
  if (mX > 0 && mX < width && mY < height && mY > 0) {
    osc.amp(0.5, 0.2);
  } else {
    osc.amp(0, 0.2);
  }
}