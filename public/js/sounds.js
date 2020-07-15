
const sound = {
    soundOptions: [
        'metronome', 'zippo', 'SILENT'
    ],
    sounds: {
        metronome: new Audio('../audio/short-metronome.mp3'),
        zippo: new Audio('../audio/short-zippo.mp3'),
        SILENT: null
    }    
};

sound.init = () => {
    state.activeSound = storage.getActiveSound();

    const soundRadios = document.querySelectorAll('input[type=radio][name="sound"]');
    soundRadios.forEach(soundselected => soundselected.addEventListener('change', sound.changeHandler));
};

sound.changeHandler = (event) => {
    state.activeSound = event.target.value;
    storage.saveActiveSound(state.activeSound);
};
