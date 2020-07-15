
const sound = {
    options: [
        'metronome', 'zippo', 'SILENT'
    ]
};

sound.defineSounds = (win = window) => {
    sound.sounds = {
        metronome: new win.Audio('../audio/short-metronome.mp3'),
        zippo: new win.Audio('../audio/short-zippo.mp3'),
        SILENT: null
    };    
};

sound.init = (spin = spinner, store = storage, doc = document) => {
    sound.defineSounds();
    spin.state.activeSound = store.getActiveSound();

    const soundRadios = doc.querySelectorAll('input[type=radio][name="sound"]');
    soundRadios.forEach(soundselected => soundselected.addEventListener('change', sound.changeHandler));
};

sound.changeHandler = (event, spin = spinner, store = storage) => {
    spin.state.activeSound = event.target.value;
    store.saveActiveSound(spin.state.activeSound);
};


// For Unit Testing
if (typeof module !== 'undefined' && module.hasOwnProperty('exports')) {
    module.exports = sound;
}