function playSound(keyCode) {
    const audio = document.querySelector(`audio[data-key="${keyCode}"]`);
    const key = document.querySelector(`.key[data-key="${keyCode}"]`);
    if (!audio) return;
    audio.currentTime = 0;
    audio.play();
    key.classList.add('playing');
}

function playSoundKbd(e) {
    playSound(e.keyCode);
}

function playSoundMouse(e) {
    playSound(e.currentTarget.dataset.key);
}

function removeTransition(e) {
    if (e.propertyName !== 'transform') return;
    this.classList.remove('playing');
}



const keys = document.querySelectorAll('.key');

keys.forEach(key => key.addEventListener('transitionend', removeTransition));

window.addEventListener("keydown", playSoundKbd);
document.querySelectorAll("div.key[data-key]").forEach(d => d.addEventListener("click", playSoundMouse));

window.setInterval(function() {
    key.classList.remove('playing');
}, 700);