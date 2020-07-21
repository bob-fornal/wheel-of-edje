
const menu = require('../public/js/menu');
const doc = require('./helpers/document.helper');
const spin = require('./helpers/spinner.helper');
const store = require('./helpers/storage.helper');

describe('menu', () => {
    let dataSounds;
    let spinner, storage, document;

    beforeEach(() => {
        store.init();
        storage = store.mock;

        spin.init();
        spinner = spin.mock;

        doc.init();
        document = doc.mock;
    });

    it('expects menu to exist', () => {
        menu.init();

        expect(menu).toBeDefined();

        expect(menu.state).toBeDefined();
        expect(menu.state.initialRun).toEqual(true);

        expect(menu.targetContains).toEqual(jasmine.any(Function));
        expect(menu.toggle).toEqual(jasmine.any(Function));
        expect(menu.setSoundState).toEqual(jasmine.any(Function));
        expect(menu.clearActivePerson).toEqual(jasmine.any(Function));
        expect(menu.showActivePerson).toEqual(jasmine.any(Function));
        expect(menu.handleIndividualSelection).toEqual(jasmine.any(Function));
        expect(menu.toggleGroup).toEqual(jasmine.any(Function));
        expect(menu.clearPrizes).toEqual(jasmine.any(Function));
        expect(menu.seePrizes).toEqual(jasmine.any(Function));
        expect(menu.closePrizes).toEqual(jasmine.any(Function));
        expect(menu.displayGroupInMenu).toEqual(jasmine.any(Function));
        expect(menu.setGlobalGroupState).toEqual(jasmine.any(Function));
        expect(menu.handleGroupSelection).toEqual(jasmine.any(Function));
        expect(menu.isGroupChecked).toEqual(jasmine.any(Function));
        expect(menu.appendGroupIndividual).toEqual(jasmine.any(Function));
        expect(menu.handleGroupChange).toEqual(jasmine.any(Function));
        expect(menu.watchGroupSpin).toEqual(jasmine.any(Function));
        expect(menu.handlePanelSelection).toEqual(jasmine.any(Function));
        expect(menu.appendPanel).toEqual(jasmine.any(Function));
        expect(menu.addListOfPanels).toEqual(jasmine.any(Function));
        expect(menu.toggleHelp).toEqual(jasmine.any(Function));
    });

    it('expects "targetContains" to return false if not a descendant', () => {
        const target = {
            classList: {
                contains: () => false
            }
        };
        const contains = ['10', '11'];

        const result = menu.targetContains(target, contains);
        expect(result).toEqual(false);
    });

    it('expects "targetContains" to return true if a descendant', () => {
        const target = {
            classList: {
                contains: () => true
            }
        };
        const contains = ['10', '11'];

        const result = menu.targetContains(target, contains);
        expect(result).toEqual(true);
    });

    it('expects "toggle" to do nothing if spinning', () => {
        const event = { target: {} };
        spyOn(menu, 'targetContains').and.returnValue(true);
        spinner.spinning = true;
        spinner.state.menu = true;
        spyOn(menu, 'setSoundState').and.stub();
        spyOn(menu, 'addListOfPanels').and.stub();
        spyOn(menu, 'watchGroupSpin').and.stub();

        menu.toggle(event, spinner, document);
        const wrapper = document.getElement('.menu-wrapper');
        expect(spinner.state.menu).toEqual(true);
        expect(wrapper).not.toBeDefined();
        expect(menu.setSoundState).not.toHaveBeenCalled();
        expect(menu.addListOfPanels).not.toHaveBeenCalled();
        expect(menu.watchGroupSpin).not.toHaveBeenCalled();
    });

    it('expects "toggle" to do nothing if event not null and target does not contain allowed', () => {
        const event = { target: {} };
        spyOn(menu, 'targetContains').and.returnValue(false);
        spinner.spinning = false;
        spinner.state.menu = true;
        spyOn(menu, 'setSoundState').and.stub();
        spyOn(menu, 'addListOfPanels').and.stub();
        spyOn(menu, 'watchGroupSpin').and.stub();

        menu.toggle(event, spinner, document);
        const wrapper = document.getElement('.menu-wrapper');
        expect(spinner.state.menu).toEqual(true);
        expect(wrapper).not.toBeDefined();
        expect(menu.setSoundState).not.toHaveBeenCalled();
        expect(menu.addListOfPanels).not.toHaveBeenCalled();
        expect(menu.watchGroupSpin).not.toHaveBeenCalled();
    });

    it('expects "toggle" to change state of modal and fire close functionality', () => {
        const event = { target: {} };
        spyOn(menu, 'targetContains').and.returnValue(true);
        spinner.spinning = false;
        spinner.state.menu = true;
        spyOn(menu, 'setSoundState').and.stub();
        spyOn(menu, 'addListOfPanels').and.stub();
        spyOn(menu, 'watchGroupSpin').and.stub();
        document.configurationFn = e => e.classList.add('hidden');

        menu.toggle(event, spinner, document);
        const wrapper = document.getElement('.menu-wrapper');
        expect(spinner.state.menu).toEqual(false);
        expect(wrapper.classList.list.includes('hidden')).toEqual(false);
        expect(menu.setSoundState).toHaveBeenCalled();
        expect(menu.addListOfPanels).toHaveBeenCalled();
        expect(menu.watchGroupSpin).toHaveBeenCalled();
    });

    it('expects "toggle" to change state of modal and not fire close functionality', () => {
        const event = { target: {} };
        spyOn(menu, 'targetContains').and.returnValue(true);
        spinner.spinning = false;
        spinner.state.menu = false;
        spyOn(menu, 'setSoundState').and.stub();
        spyOn(menu, 'addListOfPanels').and.stub();
        spyOn(menu, 'watchGroupSpin').and.stub();

        menu.toggle(event, spinner, document);
        const wrapper = document.getElement('.menu-wrapper');
        expect(spinner.state.menu).toEqual(true);
        expect(wrapper.classList.list.includes('hidden')).toEqual(true);
        expect(menu.setSoundState).not.toHaveBeenCalled();
        expect(menu.addListOfPanels).not.toHaveBeenCalled();
        expect(menu.watchGroupSpin).not.toHaveBeenCalled();
    });

    it('expects "setSoundState" check the appropriate radio', () => {
        dataSounds = [
            { value: 'metronome', checked: false },
            { value: 'zippo', checked: false },
            { value: 'SILENT', checked: false }
        ];
        spinner.state.activeSound = 'metronome';
        document.configurationFn = () => dataSounds;

        const result0 = menu.setSoundState(spinner, document);
        expect(result0[0].checked).toEqual(true);

        dataSounds = [
            { value: 'metronome', checked: false },
            { value: 'zippo', checked: false },
            { value: 'SILENT', checked: false }
        ];
        spinner.state.activeSound = 'zippo';
        document.configurationFn = () => dataSounds;

        const result1 = menu.setSoundState(spinner, document);
        expect(result1[1].checked).toEqual(true);

        dataSounds = [
            { value: 'metronome', checked: false },
            { value: 'zippo', checked: false },
            { value: 'SILENT', checked: false }
        ];
        spinner.state.activeSound = 'SILENT';
        document.configurationFn = () => dataSounds;

        const result2 = menu.setSoundState(spinner, document);
        expect(result2[2].checked).toEqual(true);
    });

    it('expects "clearActivePerson" to hide person and set active person to null', () => {
        spinner.state.activePerson = {};

        menu.clearActivePerson(spinner, document);
        const active = document.getElement('.group-active-person');
        expect(active.innerText).toEqual('');
        expect(active.classList.list.includes('hidden')).toEqual(true);
        expect(spinner.state.activePerson).toBeNull();
    });

    it('expects "showActivePerson" to add the name and toggle the person view', () => {
        spinner.state.activePerson = { name: 'Bob' };
        spyOn(menu, 'toggleGroup').and.stub();

        menu.showActivePerson(spinner, document);
        const groupActivePerson = document.getElement('.group-active-person');
        expect(groupActivePerson.classList.list.includes('hidden')).toEqual(false);
        expect(menu.toggleGroup).toHaveBeenCalled();
    });

    it('expects "handleIndividualSelection" to set active person state', () => {
        const name = 'Bob';
        const event = {};
        spinner.state.activePerson = null;
        spinner.group = [
            { name: 'One' },
            { name: 'Two' },
            { name: 'Bob' }
        ];
        spyOn(menu, 'showActivePerson').and.stub();

        menu.handleIndividualSelection(name, event, spinner);
        expect(spinner.state.activePerson).toEqual(spinner.group[2]);
        expect(menu.showActivePerson).toHaveBeenCalled();
    });

    it('expects "toggleGroup" to handle an event and return if not descendant', () => {
        const event = {
            stopPropagation: () => {},
            preventDefault: () => {}
        };
        spyOn(menu, 'targetContains').and.returnValue(false);
        spyOn(menu, 'displayGroupInMenu').and.stub();
        spinner.state.groupMenu = false;

        menu.toggleGroup(event, spinner);
        expect(spinner.state.groupMenu).toBeDefined(false);
        expect(menu.displayGroupInMenu).not.toHaveBeenCalled();
    });

    it('expects "toggleGroup" to skip target contains check when event is null', () => {
        const event = null;
        spyOn(menu, 'displayGroupInMenu').and.stub();
        spinner.state.groupMenu = false;

        menu.toggleGroup(event, spinner);
        expect(spinner.state.groupMenu).toBeDefined(true);
        expect(menu.displayGroupInMenu).toHaveBeenCalled();

    });

    it('expects "toggleGroup" to open group menu if descendant', () => {
        const event = {
            stopPropagation: () => {},
            preventDefault: () => {}
        };
        spyOn(menu, 'targetContains').and.returnValue(true);
        spyOn(menu, 'displayGroupInMenu').and.stub();
        spinner.state.groupMenu = false;

        menu.toggleGroup(event, spinner);
        expect(spinner.state.groupMenu).toBeDefined(true);
        expect(menu.displayGroupInMenu).toHaveBeenCalled();
    });

    it('expects "clearPrizes" to reset group list and menu', () => {
        const event = null;
        spinner.group = [
            { prize: 'prize 1' },
            { prize: 'prize 2' },
            { prize: 'prize 3' }
        ];
        spyOn(storage, 'saveGroup').and.stub();
        spyOn(menu, 'displayGroupInMenu').and.stub();
        spyOn(menu, 'toggleGroup').and.stub();

        menu.clearPrizes(event, spinner, storage);
        expect(spinner.group[0].prize).toBeNull();
        expect(spinner.group[1].prize).toBeNull();
        expect(spinner.group[2].prize).toBeNull();
    });

    it('expects "getPrizeString" to handle null', () => {
        const datum = { prize: null, additional: null };

        const result = menu.getPrizeString(datum);
        expect(result).toEqual('NO SPIN');
    });

    it('expects "getPrizeString" to handle prize without additional text', () => {
        const datum = { prize: 'prize', additional: '' };

        const result = menu.getPrizeString(datum);
        expect(result).toEqual('prize');
    });

    it('expects "getPrizeString" to handle prize with additional text', () => {
        const datum = { prize: 'prize', additional: 'additional' };

        const result = menu.getPrizeString(datum);
        expect(result).toEqual('prize (additional)');
    });

    it('expects "appendPrize" to create a row with name and prize', () => {
        const prizes = {
            appendChild: () => {}
        };
        const datum = { name: 'Bob', prize: 'prize', additional: '' };
        spyOn(menu, 'getPrizeString').and.returnValue('prize string');

        menu.appendPrize(prizes, datum, document);
        expect(document.getElement('UNDEFINED-0').classList.list).toEqual(['prize-row']);
        expect(document.getElement('UNDEFINED-1').classList.list).toEqual(['name']);
        expect(document.getElement('UNDEFINED-1').innerText).toEqual(datum.name);
        expect(document.getElement('UNDEFINED-2').classList.list).toEqual(['prize-won']);
        expect(document.getElement('UNDEFINED-2').innerText).toEqual('prize string');
    });

    it('expects "seePrizes" to loop through the group and append prizes', () => {
        const event = {};
        spinner.group = [
            { enabled: true },
            { enabled: true },
            { enabled: false }
        ];
        spyOn(menu, 'appendPrize').and.stub();
        spyOn(menu, 'toggleGroup').and.stub();

        menu.seePrizes(event, spinner, document);
        const wrapper = document.getElement('.prizes-wrapper');
        expect(wrapper.classList.list.includes('hidden')).toEqual(false);
        expect(menu.appendPrize.calls.count()).toEqual(2);
    });

    it('expects "closePrizes" to add hidden class to the wrapper', () => {
        menu.closePrizes(document);
        const wrapper = document.getElement('.prizes-wrapper');
        expect(wrapper.classList.list.includes('hidden')).toEqual(true);
    });

    it('expects "appendIndividual" to create a person node with no prize', () => {
        const groupMenu = {
            appendChild: () => {}
        };
        const datum = { name: 'Bob', prize: null };

        menu.appendIndividual(groupMenu, datum, document);
        const node = document.getElement('UNDEFINED-0');
        expect(node.classList.list).toEqual(['individual']);
        expect(node.innerText).toEqual('Bob');
        expect(node.onclick).toEqual(jasmine.any(Function));
    });

    it('expects "appendIndividual" to create a person node with a prize', () => {
        const groupMenu = {
            appendChild: () => {}
        };
        const datum = { name: 'Bob', prize: 'prize' };

        menu.appendIndividual(groupMenu, datum, document);
        const node = document.getElement('UNDEFINED-0');
        expect(node.classList.list).toEqual(['individual', 'won']);
        expect(node.innerText).toEqual('Bob');
        expect(node.onclick).not.toBeDefined();
    });

    it('expects "appendMenuItem" to create a menu item node', () => {
        const groupMenu = {
            appendChild: () => {}
        };
        const classItem = 'class-item';
        const text = 'text';
        const fn = () => {};
        
        menu.appendMenuItem(groupMenu, classItem, text, fn, document);
        const element = document.getElement('UNDEFINED-0');
        expect(element.classList.list).toEqual([classItem]);
        expect(element.innerText).toEqual(text);
        expect(element.onclick).toEqual(jasmine.any(Function));
    });

    it('expects "displayGroupInMenu" to turn off the menu', () => {
        spinner.group = [
            { enabled: true },
            { enabled: true },
            { enabled: false }
        ];
        spinner.state.groupMenu = false;
        spyOn(menu, 'appendMenuItem').and.stub();
        spyOn(menu, 'appendIndividual').and.stub();

        menu.displayGroupInMenu(spinner, document);
        const wrapper = document.getElement('.group-menu-wrapper');
        const groupMenu = document.getElement('.group-menu');
        expect("innerHTML" in groupMenu).toEqual(false);
        expect(menu.appendMenuItem).not.toHaveBeenCalledTimes(3);
        expect(menu.appendIndividual).not.toHaveBeenCalledTimes(2);
        expect(wrapper.classList.list.includes('hidden')).toEqual(true);
    });

    it('expects "displayGroupInMenu" to turn on the menu', () => {
        spinner.group = [
            { enabled: true },
            { enabled: true },
            { enabled: false }
        ];
        spinner.state.groupMenu = true;
        spyOn(menu, 'appendMenuItem').and.stub();
        spyOn(menu, 'appendIndividual').and.stub();

        menu.displayGroupInMenu(spinner, document);
        const wrapper = document.getElement('.group-menu-wrapper');
        const groupMenu = document.getElement('.group-menu');
        expect("innerHTML" in groupMenu).toEqual(true);
        expect(groupMenu.innerHTML).toEqual('');
        expect(menu.appendMenuItem).toHaveBeenCalledTimes(3);
        expect(menu.appendIndividual).toHaveBeenCalledTimes(2);
        expect(wrapper.classList.list.includes('hidden')).toEqual(true);
    });

    it('expects "setGlobalGroupState" to initially use state to set appropriate icon visibility', () => {
        const state = true;
        menu.state.initialRun = true;

        menu.setGlobalGroupState(state, spinner, document);
        const offIcon = document.getElement('.group-icon.disabled');
        const onIcon = document.getElement('.group-icon.enabled');
        expect(offIcon.classList.list.includes('hidden')).toEqual(false);
        expect(onIcon.classList.list.includes('hidden')).toEqual(false);
        expect(menu.state.initialRun).toEqual(false);
    });

    it('expects "setGlobalGroupState" to use state to set appropriate icon visibility', () => {
        let state = true;
        menu.state.initialRun = true;
        menu.setGlobalGroupState(state, spinner, document);
        const offIcon = document.getElement('.group-icon.disabled');
        const onIcon = document.getElement('.group-icon.enabled');

        state = false;
        menu.setGlobalGroupState(state, spinner, document);
        expect(offIcon.classList.list.includes('hidden')).toEqual(true);
        expect(onIcon.classList.list.includes('hidden')).toEqual(true);
        expect(menu.state.initialRun).toEqual(false);
        expect(spinner.state.groupMode).toEqual(false);

        state = true;
        menu.setGlobalGroupState(state, spinner, document);
        expect(offIcon.classList.list.includes('hidden')).toEqual(false);
        expect(onIcon.classList.list.includes('hidden')).toEqual(false);
        expect(menu.state.initialRun).toEqual(false);
        expect(spinner.state.groupMode).toEqual(true);
    });

    it('expects "handleGroupSelection" to change individual state and save group', () => {
        const eventUnchecked = { target: { value: "1", checked: false } };
        const eventChecked = { target: { value: "1", checked: true } };
        spinner.group = [
            { enabled: true },
            { enabled: true },
            { enabled: true }
        ];
        spyOn(storage, 'saveGroup').and.stub();

        menu.handleGroupSelection(eventUnchecked, spinner, storage);
        expect(spinner.group[1].enabled).toEqual(false);
        expect(storage.saveGroup).toHaveBeenCalled();

        menu.handleGroupSelection(eventChecked, spinner, storage);
        expect(spinner.group[1].enabled).toEqual(true);
        expect(storage.saveGroup).toHaveBeenCalled();
    });

    it('expects "isGroupChecked" to check spinner state when event is null', () => {
        const event = null;

        spinner.state.groupMode = false;
        const result1 = menu.isGroupChecked(event, spinner);
        expect(result1).toEqual(false);

        spinner.state.groupMode = true;
        const result2 = menu.isGroupChecked(event, spinner);
        expect(result2).toEqual(true);
    });

    it('expects "isGroupChecked" to check event when it has content', () => {
        let event = { target: { checked: false } };

        const result1 = menu.isGroupChecked(event, spinner);
        expect(result1).toEqual(false);

        event.target.checked = true;
        const result2 = menu.isGroupChecked(event, spinner);
        expect(result2).toEqual(true);
    });

    it('expects "appendGroupIndividual" to add proper content to content', () => {
        const content = { appendChild: () => {} };
        const individual = { enabled: true, name: 'Bob' };
        const index = 0;
        spyOn(content, 'appendChild').and.stub();

        menu.appendGroupIndividual(content, individual, index, document);
        const div = document.getElement('UNDEFINED-0');
        const input = document.getElement('UNDEFINED-1');
        const label = document.getElement('UNDEFINED-2');
        expect(div.classList.list.includes('panel-active'));
        expect(input.type).toEqual('checkbox');
        expect(input.checked).toEqual(individual.enabled);
        expect(input.id).toEqual(individual.name);
        expect(input.name).toEqual('groups');
        expect(input.value).toEqual(index);
        expect(input.onchange).toEqual(jasmine.any(Function));
        expect(label.attributes.for).toEqual('groups');
        expect(label.innerText).toEqual(individual.name);
        expect(content.appendChild).toHaveBeenCalled();
    });

    it('expects "handleGroupChange" to set group mode true and add group', () => {
        const event = {};
        spinner.group = [1, 2, 3];
        spyOn(menu, 'isGroupChecked').and.returnValue(true);
        spyOn(menu, 'setGlobalGroupState').and.stub();
        spyOn(menu, 'appendGroupIndividual').and.stub();

        menu.handleGroupChange(event, spinner, document);
        const content = document.getElement('.panel-group-content');
        expect(spinner.state.groupMode).toEqual(true);
        expect(content.innerHTML).toEqual('');
        expect(menu.setGlobalGroupState).toHaveBeenCalled();
        expect(menu.appendGroupIndividual).toHaveBeenCalledTimes(3);
    });

    it('expects "handleGroupChange" to set group mode false and not add group', () => {
        const event = {};
        spinner.group = [1, 2, 3];
        spyOn(menu, 'isGroupChecked').and.returnValue(false);
        spyOn(menu, 'setGlobalGroupState').and.stub();
        spyOn(menu, 'appendGroupIndividual').and.stub();

        menu.handleGroupChange(event, spinner, document);
        const content = document.getElement('.panel-group-content');
        expect(spinner.state.groupMode).toEqual(false);
        expect(content.innerHTML).toEqual('');
        expect(menu.setGlobalGroupState).toHaveBeenCalled();
        expect(menu.appendGroupIndividual).not.toHaveBeenCalledTimes(3);
    });

    it('expect "watchGroupSpin" to connect the element and handleGRoupChange function', () => {
        menu.watchGroupSpin(document);
        const selector = document.getElementById('group');
        expect(selector.onchange).toEqual(jasmine.any(Function));
    });

    it('expects "handlePanelSelection" to get and save panel state, then reinitialize the spinner', () => {
        const index = 1;
        const state = true;
        const event = { target: { value: index, checked: state } };
        spinner.pie = [
            { enabled: false },
            { enabled: false },
            { enabled: false }
        ];
        spyOn(storage, 'savePie').and.stub();
        spyOn(spinner, 'init').and.stub();

        menu.handlePanelSelection(event, spinner, storage);
        expect(spinner.pie[index].enabled).toEqual(state);
        expect(storage.savePie).toHaveBeenCalled();
        expect(spinner.init).toHaveBeenCalled();
    });

    it('expects "appendPanel" to add the correct dom elements', () => {
        const content = { appendChild: () => {} };
        const panel = { enabled: true, text: 'panel' };
        const index = 1;
        spyOn(content, 'appendChild').and.stub();

        menu.appendPanel(content, panel, index, document);
        const node = document.getElement('UNDEFINED-0');
        const input = document.getElement('UNDEFINED-1');
        const label = document.getElement('UNDEFINED-2');
        expect(node.classList.list.includes('panel-active')).toEqual(true);
        expect(input.type).toEqual('checkbox');
        expect(input.checked).toEqual(panel.enabled);
        expect(input.id).toEqual(panel.text);
        expect(input.name).toEqual('panels');
        expect(input.value).toEqual(index);
        expect(input.onchange).toEqual(jasmine.any(Function));
        expect(label.attributes.for).toEqual('panels');
        expect(label.innerText).toEqual(panel.text);
    });

    it('expects "addListOfPanels" to do just that', () => {
        spinner.pie = [1, 2, 3, 4, 5];
        spyOn(menu, 'appendPanel').and.stub();

        menu.addListOfPanels(spinner, document);
        const content = document.getElement('.panel-content');
        expect(content.innerHTML).toEqual('');
        expect(menu.appendPanel).toHaveBeenCalledTimes(5);
    });

    it('expects "toggleHelp" to change help state and toggle help visible', () => {
        const event = null;
        spinner.state.spinning = false;

        menu.toggleHelp(event, spinner, document);
        const wrapper = document.getElement('.help-wrapper');
        expect(spinner.state.help).toEqual(true);
        expect(wrapper.classList.list.includes('hidden')).toEqual(true);
    });

    it('expects "toggleHelp" to break out if spinning', () => {
        const event = null;
        spinner.state.spinning = true;

        menu.toggleHelp(event, spinner, document);
        const wrapper = document.getElement('.help-wrapper');
        expect(spinner.state.help).toEqual(false);
        expect(wrapper).toBeUndefined();
    });

    it('expects "toggleHelp" to break out if event target does not contains help-icon or -wrapper', () => {
        const event = { target: { classList: { contains: () => false } } };
        spinner.state.spinning = false;

        menu.toggleHelp(event, spinner, document);
        const wrapper = document.getElement('.help-wrapper');
        expect(spinner.state.help).toEqual(false);
        expect(wrapper).toBeUndefined();
    });
});