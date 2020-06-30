const soundOptions = [
    'metronome', 'zippo'
];
const sounds = {
    metronome: new Audio('../audio/short-metronome.mp3'),
    zippo: new Audio('../audio/short-zippo.mp3')
};

const soundRadios = document.querySelectorAll('input[type=radio][name="sound"]');

const changeHandler = (event) => {
    state.activeSound = event.target.value;
};

soundRadios.forEach(soundselected => soundselected.addEventListener('change', changeHandler));
