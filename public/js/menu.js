
const menu = {
    state: {
        initialRun: true,
        externalControl: false
    }
};

menu.init = () => {
    menu.state.initialRun = true;
};

menu.targetContains = (target, contains) => {
    let found = false;
    for (let i = 0, len = contains.length; i < len; i++) {
        if (target.classList.contains(contains[i])) {
            found = true;
            break;
        }
    }
    return found;
};

menu.toggle = (event = null, spin = spinner, doc = document) => {
    const allow = ['menu-icon', 'menu-wrapper'];
    if (spin.state.spinning === true || menu.state.externalControl === true) return;
    if (event !== null && !menu.targetContains(event.target, allow)) return;
    
    spin.state.menu = !spin.state.menu;

    const menuSelector = doc.querySelector('.menu-wrapper');
    const menuState = menuSelector.classList.toggle('hidden');

    if (menuState === false) { // HIDDEN
        menu.setSoundState();
        menu.addListOfPanels();
        menu.watchGroupSpin();
    }
};

menu.setSoundState = (spin = spinner, doc = document) => {
    const sounds = doc.querySelectorAll('[name=sound]');
    for (let i = 0, len = sounds.length; i < len; i++) {
        if (sounds[i].value === spin.state.activeSound) {
            sounds[i].checked = true;
            break;
        }
    }
    return sounds;
};

menu.clearActivePerson = (spin = spinner, doc = document) => {
    const active = doc.querySelector('.group-active-person');
    active.innerText = '';
    active.classList.add('hidden');

    spin.state.activePerson = null;
    spin.state.activePersonIndex = -1;
};

menu.displayActivePerson = (spin = spinner, doc = document) => {
    const active = doc.querySelector('.group-active-person');
    active.innerText = spin.state.activePerson.name;
    active.setAttribute('index', spin.state.activePersonIndex);
    active.classList.remove('hidden');
};

menu.showActivePerson = () => {
    menu.displayActivePerson();
    menu.toggleGroup();
};

menu.handleIndividualSelection = (name, event, spin = spinner) => {
    let individual = null;
    let index = -1;
    for (let i = 0, len = spin.group.length; i < len; i++) {
        if (spin.group[i].name === name) {
            individual = spin.group[i];
            index = i;
            break;
        }
    }

    spin.state.activePerson = individual;
    spin.state.activePersonIndex = index;
    menu.showActivePerson();
};

menu.toggleGroup = (event = null, spin = spinner) => {
    const allow = ['group-icon', 'group-menu-wrapper', 'clear-prizes', 'cancel'];
    if (spin.state.spinning === true || menu.state.externalControl === true) return;
    if (event !== null) {
        event.stopPropagation();
        event.preventDefault();
        if (!menu.targetContains(event.target, allow)) return;
    }

    spin.state.groupMenu = !spin.state.groupMenu;
    menu.displayGroupInMenu();
};

menu.clearPrizes = (event = null, spin = spinner, store = storage) => {
    for (let i = 0, len = spin.group.length; i < len; i++) {
        spin.group[i].prize = null;
        spin.group[i].additional = null;
    }
    store.saveGroup(spin.group);
    menu.displayGroupInMenu();
    menu.toggleGroup();
};

menu.getPrizeString = (datum) => {
    let prizeString = (datum.prize === null) ? 'NO SPIN' : datum.prize;
    prizeString += ([null, ''].includes(datum.additional)) ? '' : ` (${ datum.additional })`;
    return prizeString;
};

menu.appendPrize = (prizes, datum, doc = document) => {
    const divNode = doc.createElement('div');
    divNode.classList.add('prize-row');

    const nameNode = doc.createElement('div');
    nameNode.classList.add('name');
    nameNode.innerText = datum.name;

    const prizeNode = doc.createElement('div');
    prizeNode.classList.add('prize-won');
    prizeNode.innerText = menu.getPrizeString(datum);

    divNode.appendChild(nameNode);
    divNode.appendChild(prizeNode);
    prizes.appendChild(divNode);
};

menu.seePrizes = (event, spin = spinner, doc = document) => {
    const prizesWrapper = doc.querySelector('.prizes-wrapper');
    const prizes = doc.querySelector('.prizes .content');

    prizes.innerHTML = '';
    for (let i = 0, len = spin.group.length; i < len; i++) {
        if (spin.group[i].enabled === true) {
            menu.appendPrize(prizes, spin.group[i], doc);
        }
    }
    menu.toggleGroup();
    prizesWrapper.classList.remove('hidden');
};

menu.closePrizes = (doc = document) => {
    const prizesWrapper = doc.querySelector('.prizes-wrapper');
    prizesWrapper.classList.add('hidden');
};

menu.appendIndividual = (groupMenu, datum, doc = document) => {
    const divNode = doc.createElement('div');
    divNode.classList.add('individual');
    divNode.innerText = datum.name;

    if (datum.prize === null) {
        divNode.onclick = menu.handleIndividualSelection.bind(this, datum.name);
    } else {
        divNode.classList.add('won');
    }
    groupMenu.appendChild(divNode);
};

menu.appendMenuItem = (groupMenu, classItem, text, fn, doc = document) => {
    const divNode = doc.createElement('div');
    divNode.classList.add(classItem);
    divNode.innerText = text;
    divNode.onclick = fn;
    groupMenu.appendChild(divNode);
};

menu.displayGroupInMenu = (spin = spinner, doc = document) => {
    const groupMenuWrapper = doc.querySelector('.group-menu-wrapper');
    const groupMenu = doc.querySelector('.group-menu');

    if (spin.state.groupMenu === true) {
        groupMenu.innerHTML = '';

        menu.appendMenuItem(groupMenu, 'see-prizes', 'SEE PRIZES', menu.seePrizes);

        for (let i = 0, len = spin.group.length; i < len; i++) {
            if (spin.group[i].enabled === true) {
                menu.appendIndividual(groupMenu, spin.group[i]);
            }
        }

        menu.appendMenuItem(groupMenu, 'clear-prizes', 'CLEAR PRIZES', menu.clearPrizes);
        menu.appendMenuItem(groupMenu, 'cancel', 'CANCEL', menu.toggleGroup);
    }

    groupMenuWrapper.classList.toggle('hidden');
};

menu.setGlobalGroupState = (state, spin = spinner, doc = document) => {
    const groupOffIcon = doc.querySelector('.group-icon.disabled');
    const groupOnIcon = doc.querySelector('.group-icon.enabled');

    spin.state.groupMode = state;
    if (menu.state.initialRun === true) {
        menu.state.initialRun = false;
    } else {
        groupOffIcon.classList.toggle('hidden');
        groupOnIcon.classList.toggle('hidden');    
    }
};

menu.handleGroupSelection = (event, spin = spinner, store = storage) => {
    const index = +event.target.value;
    const state = event.target.checked;

    spin.group[index].enabled = state;
    store.saveGroup(spin.group);
};

menu.isGroupChecked = (event = null, spin = spinner) => {
    return (event === null) ? spin.state.groupMode : event.target.checked;
};

menu.appendGroupIndividual = (content, individual, index, doc = document) => {
    const divNode = doc.createElement('div');
    divNode.classList.add('panel-active');

    const inputNode = doc.createElement('input');
    inputNode.type = 'checkbox';
    inputNode.checked = individual.enabled;
    inputNode.id = individual.name;
    inputNode.name = 'groups';
    inputNode.value = index;
    inputNode.onchange = menu.handleGroupSelection;

    const labelNode = doc.createElement('label');
    labelNode.setAttribute('for', 'groups'); 
    labelNode.innerText = individual.name;

    divNode.appendChild(inputNode);
    divNode.appendChild(labelNode);

    content.appendChild(divNode);
};

menu.handleGroupChange = (event = null, spin = spinner, doc = document) => {
    const groupChecked = menu.isGroupChecked(event);
    spin.state.groupMode = groupChecked;

    if (event === null) {
        const groupSelector = doc.getElementById('group');
        groupSelector.checked = groupChecked;    
    }

    const content = doc.querySelector('.panel-group-content');
    content.innerHTML = '';

    menu.setGlobalGroupState(groupChecked);
    if (groupChecked === true) {
        for (let i = 0, len = spin.group.length; i < len; i++) {
            menu.appendGroupIndividual(content, spin.group[i], i);
        }    
    }
};

menu.watchGroupSpin = (doc = document) => {
    const groupSelector = doc.getElementById('group');
    groupSelector.onchange = menu.handleGroupChange;
};

menu.handlePanelSelection = (event, spin = spinner, store = storage) => {
    const index = event.target.value;
    const state = event.target.checked;

    spin.pie[index].enabled = state;
    store.savePie(spin.pie);
    
    spin.init();
};

menu.appendPanel = (content, panel, index, doc = document) => {
    const divNode = doc.createElement('div');
    divNode.classList.add('panel-active');

    const inputNode = doc.createElement('input');
    inputNode.type = 'checkbox';
    inputNode.checked = panel.enabled;
    inputNode.id = panel.text;
    inputNode.name = 'panels';
    inputNode.value = index;
    inputNode.onchange = menu.handlePanelSelection;

    const labelNode = doc.createElement('label');
    labelNode.setAttribute('for', 'panels'); 
    labelNode.innerText = panel.text;

    divNode.appendChild(inputNode);
    divNode.appendChild(labelNode);

    content.appendChild(divNode);
};

menu.addListOfPanels = (spin = spinner, doc = document) => {
    const content = doc.querySelector('.panel-content');
    content.innerHTML = '';

    for (let i = 0, len = spin.pie.length; i < len; i++) {
        menu.appendPanel(content, spin.pie[i], i);
    }
};

menu.toggleHelp = (event = null, spin = spinner, doc = document) => {
    const allow = ['help-icon', 'help-wrapper'];
    if (spin.state.spinning === true) return;
    if (event !== null && !menu.targetContains(event.target, allow)) return;
    
    spin.state.help = !spin.state.help;

    const help = doc.querySelector('.help-wrapper');
    help.classList.toggle('hidden');
};

// For Unit Testing
if (typeof module !== 'undefined' && module.hasOwnProperty('exports')) {
    module.exports = menu;
}