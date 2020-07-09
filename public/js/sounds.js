const soundOptions = [
    'metronome', 'zippo'
];
const sounds = {
    metronome: new Audio('../audio/short-metronome.mp3'),
    zippo: new Audio('../audio/short-zippo.mp3')
};

const soundRadios = document.querySelectorAll('input[type=radio][name="sound"]');

const initSounds = () => {
    state.activeSound = storage.getActiveSound();
};

const changeHandler = (event) => {
    state.activeSound = event.target.value;
    storage.saveActiveSound(state.activeSound);
};

soundRadios.forEach(soundselected => soundselected.addEventListener('change', changeHandler));
