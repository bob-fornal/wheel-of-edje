
const winner = require('../public/js/winner');
const doc = require('./helpers/document.helper');
const spin = require('./helpers/spinner.helper');
const store = require('./helpers/storage.helper');
const menuHelper = require('./helpers/menu.helper');

describe('winner', () => {
    let spinner, storage, menu, document;

    beforeEach(() => {
        spin.init();
        spinner = spin.mock;

        store.init();
        storage = store.mock;

        menuHelper.init();
        menu = menuHelper.mock;

        doc.init();
        document = doc.mock;
        
        winner.init(document);
    });

    it('expects winner to exist', () => {
        expect(winner).toBeDefined();
        expect(winner.init).toEqual(jasmine.any(Function));
        expect(winner.getActivePerson).toEqual(jasmine.any(Function));
        expect(winner.setText).toEqual(jasmine.any(Function));
        expect(winner.handlePerson).toEqual(jasmine.any(Function));
        expect(winner.open).toEqual(jasmine.any(Function));
        expect(winner.close).toEqual(jasmine.any(Function));
    });

    it('expects "init" to define queries', () => {
        expect(winner.queries).toBeDefined();
        expect(winner.queries.wrapper).toEqual(jasmine.any(Object));
        expect(document.getElement('.winner-wrapper')).toBeDefined();
        expect(winner.queries.card).toEqual(jasmine.any(Object));
        expect(document.getElement('.winner-card')).toBeDefined();
        expect(winner.queries.prize).toEqual(jasmine.any(Object));
        expect(document.getElement('#prize')).toBeDefined();
        expect(winner.queries.prizeAdditional).toEqual(jasmine.any(Object));
        expect(document.getElement('#prize-additional-information')).toBeDefined();
        expect(winner.queries.prizeAdditionalNeeded).toEqual(jasmine.any(Object));
        expect(document.getElement('.prize-additional-information')).toBeDefined();
        expect(winner.queries.who).toEqual(jasmine.any(Object));
        expect(document.getElement('#prize-who')).toBeDefined();
    });

    it('expects "getActivePerson" to handle null', () => {
        const activePerson = null;

        const result = winner.getActivePerson(activePerson);
        expect(result).toEqual('You');
    });

    it('expects "getActivePerson" to handle a string', () => {
        const activePerson = 'Bob';

        const result = winner.getActivePerson(activePerson);
        expect(result).toEqual('Bob');
    });

    it('expects "setText" to update text and style without additional text and without active person', () => {
        const data = { text: 'prize', additionalText: '', color: 'color', fcolor: 'fcolor' };
        const activePerson = null;

        winner.setText(data, activePerson);
        const card = document.getElement('.winner-card');
        const additional = document.getElement('.prize-additional-information');
        expect(winner.queries.prize.innerText).toEqual(data.text);
        expect(winner.queries.who.innerText).toEqual('You');
        expect(card.attributes.style).toEqual('background-color: color; color: fcolor;');

        expect(winner.queries.prizeAdditional.innerText).toEqual('~~~NONE~~~');
        expect(additional.classList.list.includes('hidden')).toEqual(false);
    });

    it('expects "setText" to update text and style with additional text and without active person', () => {
        const data = { text: 'prize', additionalText: 'additional', color: 'color', fcolor: 'fcolor' };
        const activePerson = null;

        winner.setText(data, activePerson);
        const card = document.getElement('.winner-card');
        const additional = document.getElement('.prize-additional-information');
        expect(winner.queries.prize.innerText).toEqual(data.text);
        expect(winner.queries.who.innerText).toEqual('You');
        expect(card.attributes.style).toEqual('background-color: color; color: fcolor;');

        expect(winner.queries.prizeAdditional.innerText).toEqual('additional');
        expect(additional.classList.list.includes('hidden')).toEqual(false);
    });

    it('expects "setText" to update text and style without additional text and with active person', () => {
        const data = { text: 'prize', additionalText: '', color: 'color', fcolor: 'fcolor' };
        const activePerson = 'Bob';

        winner.setText(data, activePerson);
        const card = document.getElement('.winner-card');
        const additional = document.getElement('.prize-additional-information');
        expect(winner.queries.prize.innerText).toEqual(data.text);
        expect(winner.queries.who.innerText).toEqual('Bob');
        expect(card.attributes.style).toEqual('background-color: color; color: fcolor;');

        expect(winner.queries.prizeAdditional.innerText).toEqual('~~~NONE~~~');
        expect(additional.classList.list.includes('hidden')).toEqual(false);
    });

    it('expects "setText" to update text and style with additional text and with active person', () => {
        const data = { text: 'prize', additionalText: 'additional', color: 'color', fcolor: 'fcolor' };
        const activePerson = 'Bob';

        winner.setText(data, activePerson);
        const card = document.getElement('.winner-card');
        const additional = document.getElement('.prize-additional-information');
        expect(winner.queries.prize.innerText).toEqual(data.text);
        expect(winner.queries.who.innerText).toEqual('Bob');
        expect(card.attributes.style).toEqual('background-color: color; color: fcolor;');

        expect(winner.queries.prizeAdditional.innerText).toEqual('additional');
        expect(additional.classList.list.includes('hidden')).toEqual(false);
    });

    it('expects "handlePerson" to handle null for active person', () => {
        const data = {};
        spinner.state.activePerson = null;
        spyOn(menu, 'clearActivePerson').and.stub();
        spyOn(storage, 'saveGroup').and.stub();

        winner.handlePerson(data, spinner, menu, storage);
        expect(spinner.state.activePerson).toBeNull();
        expect(menu.clearActivePerson).not.toHaveBeenCalled();
        expect(storage.saveGroup).not.toHaveBeenCalled();
    });

    it('expects "handlePerson" to handle an active person', () => {
        const data = { text: 'prize', additionalText: 'additional' };
        spinner.state.activePerson = { prize: null, additional: null };
        spyOn(menu, 'clearActivePerson').and.stub();
        spyOn(storage, 'saveGroup').and.stub();

        winner.handlePerson(data, spinner, menu, storage);
        expect(spinner.state.activePerson.prize).toEqual(data.text);
        expect(spinner.state.activePerson.additional).toEqual(data.additionalText);
        expect(menu.clearActivePerson).toHaveBeenCalled();
        expect(storage.saveGroup).toHaveBeenCalledWith(spinner.group);
    });

    it('expects "open" to configure winner modal open and change state', () => {
        const data = { text: 'prize', additionalText: '', color: 'color', fcolor: 'fcolor' };
        spinner.state.activePerson = null;
        spinner.state.winnerOpen = false;
        spyOn(winner, 'setText').and.stub();
        spyOn(winner, 'handlePerson').and.stub();

        winner.open(data, spinner);
        const wrapper = document.getElement('.winner-wrapper');
        expect(spinner.state.winnerOpen).toEqual(true);
        expect(wrapper.classList.list.includes('hidden')).toEqual(false);

        expect(winner.setText).toHaveBeenCalled();
        expect(winner.handlePerson).toHaveBeenCalled();
    });

    it('expects "close" to configure winner modal closed and change state', () => {
        spinner.state.winnerOpen = true;

        winner.close(spinner);
        const wrapper = document.getElement('.winner-wrapper');
        const additional = document.getElement('.prize-additional-information');
        expect(spinner.state.winnerOpen).toEqual(false);
        expect(wrapper.classList.list.includes('hidden')).toEqual(true);
        expect(additional.classList.list.includes('hidden')).toEqual(true);
    });
});