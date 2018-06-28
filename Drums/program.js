function playSound(e) {
    const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
    const key = document.querySelector(`.key[data-key="${e.keyCode}"]`);
    console.log(audio);
    if (!audio) return;
    audio.currentTime = 0;
    audio.play();
    key.classList.add('playing'); 
}

function removeTransition(e) {
    if (e.propertyName !== 'transform') return;
    this.classList.remove('playing');
}


const keys = document.querySelectorAll('.key');
keys.forEach(key => key.addEventListener('transitionend', removeTransition));
window.addEventListener("keydown", playSound);

const keysPressedMouse = document.querySelectorAll('.key');
keysPressedMouse.forEach(keyMouse => keyMouse.addEventListener('click', playSoundMouse));

function playSoundMouse(e) {
/*     const keyMouseSecond = document.querySelector(`.key[data-key="${e.keyMouse.}"]`)
 */
console.log(e);
}