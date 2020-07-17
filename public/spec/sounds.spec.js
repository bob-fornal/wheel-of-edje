
const sound = require('../js/sounds');
const doc = require('./helpers/document.helper');
const win = require('./helpers/window.helper');
const spin = require('./helpers/spinner.helper');
const store = require('./helpers/storage.helper');

describe('sound', () => {
    let mockWindow;
    let spinner, storage, document;

    beforeEach(() => {
        win.init();
        mockWindow = win.mock;

        spin.init();
        spinner = spin.mock;

        store.init();
        storage = store.mock;

        doc.init();
        document = doc.mock;
    });

    it('expects structure to exist', () => {
        expect(sound).toBeDefined();
        expect(sound.options).toEqual(jasmine.any(Array));
        expect(sound.defineSounds).toEqual(jasmine.any(Function));
        expect(sound.init).toEqual(jasmine.any(Function));
        expect(sound.changeHandler).toEqual(jasmine.any(Function));
    });

    it('expects "options" are defined', () => {
        expect(sound.options).toContain('metronome');
        expect(sound.options).toContain('zippo');
        expect(sound.options).toContain('SILENT');
    });

    it('expects "sounds" to be defined', () => {
        sound.defineSounds(mockWindow);  

        expect(sound.sounds.metronome.url).toEqual(jasmine.stringMatching('short-metronome.mp3'));
        expect(sound.sounds.zippo.url).toEqual(jasmine.stringMatching('short-zippo.mp3'));
        expect(sound.sounds.SILENT).toBeNull();
    });

    it('expects "init" to define sounds and set active', () => {
        let returnElements = [{ addEventListener: () => {} }];
        const active = 'active';
        spyOn(sound, 'defineSounds').and.stub();
        spyOn(storage, 'getActiveSound').and.returnValue(active);
        doc.configurationFn = () => returnElements;
        
        sound.init(spinner, storage, document);

        expect(spinner.state.activeSound).toEqual(active);
        expect(sound.defineSounds).toHaveBeenCalled();
    });

    it('expects "changeHandler" to set and save the active sound', () => {
        const newActiveSound = 'new-active-sound';
        const event = { target: { value: newActiveSound } };
        spyOn(storage, 'saveActiveSound').and.stub();

        sound.changeHandler(event, spinner, storage);

        expect(spinner.state.activeSound).toEqual(newActiveSound);
        expect(storage.saveActiveSound).toHaveBeenCalledWith(newActiveSound);
    });
});