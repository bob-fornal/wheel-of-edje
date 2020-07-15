
const sound = require('../js/sounds.js');

describe('sound', () => {
    let mockWindow, mockSpinner, mockStorage, mockDocument, mockEventListener;
    let spinner, storage, document;

    beforeEach(() => {
        mockWindow = {
            Audio: function(url) {
                this.url = url;
            }
        };
        mockSpinner = {
            state: {
                activeSound: null
            }
        };
        mockStorage = {
            getActiveSound: () => {},
            saveActiveSound: () => {}
        }
        mockEventListener = () => {};
        mockDocument = {
            querySelectorAll: () => {
                return [{
                    addEventListener: mockEventListener
                }]
            }
        };

        spinner = mockSpinner;
        storage = mockStorage;
        document = mockDocument;
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
        const active = 'active';
        spyOn(sound, 'defineSounds').and.stub();
        spyOn(storage, 'getActiveSound').and.returnValue(active);
        
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