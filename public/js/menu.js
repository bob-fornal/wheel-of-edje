
const menu = {};

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
    if (spin.spinning === true) return;
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
};

menu.showActivePerson = (spin = spinner, doc = document) => {
    const active = doc.querySelector('.group-active-person');
    active.innerText = spin.state.activePerson.person;
    active.classList.remove('hidden');

    menu.toggleGroup();
};

menu.handleIndividualSelection = (name, event, spin = spinner) => {
    let individual = null;
    for (let i = 0, len = spin.group.length; i < len; i++) {
        if (spin.group[i].person === name) {
            individual = spin.group[i];
            break;
        }
    }

    spin.state.activePerson = individual;
    menu.showActivePerson();
};

menu.toggleGroup = (event = null, spin = spinner) => {
    const allow = ['group-icon', 'group-menu-wrapper', 'clear-prizes', 'cancel'];
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
    nameNode.innerText = datum.person;

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
    divNode.innerText = datum.person;

    if (datum.prize === null) {
        divNode.onclick = menu.handleIndividualSelection.bind(this, datum.person);
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

menu.setGlobalGroupState = (state) => {
    const groupOffIcon = document.querySelector('.group-icon.disabled');
    const groupOnIcon = document.querySelector('.group-icon.enabled');

    spinner.state.groupMode = state;
    if (state === true) {
        groupOffIcon.classList.add('hidden');
        groupOnIcon.classList.remove('hidden');
    } else {
        groupOffIcon.classList.remove('hidden');
        groupOnIcon.classList.add('hidden');
    }
};

menu.handleGroupSelection = (event) => {
    const index = +event.target.value;
    const state = event.target.checked;

    spinner.group[index].enabled = state;
    storage.saveGroup(spinner.group);
};

menu.handleGroupChange = (event = null) => {
    const groupChecked = (event === null) ? spinner.state.groupMode : event.target.checked;
    spinner.state.groupMode = groupChecked;

    if (event === null) {
        const groupSelector = document.getElementById('group');
        groupSelector.checked = groupChecked;    
    }

    const content = document.querySelector('.panel-group-content');
    content.innerHTML = '';

    menu.setGlobalGroupState(groupChecked);
    if (groupChecked === true) {
        for (let i = 0, len = spinner.group.length; i < len; i++) {
            const divNode = document.createElement('div');
            divNode.classList.add('panel-active');

            const inputNode = document.createElement('input');
            inputNode.type = 'checkbox';
            inputNode.checked = spinner.group[i].enabled;
            inputNode.id = spinner.group[i].person;
            inputNode.name = 'groups';
            inputNode.value = i;
            inputNode.onchange = menu.handleGroupSelection;
    
            const labelNode = document.createElement('label');
            labelNode.setAttribute('for', 'groups'); 
            labelNode.innerText = spinner.group[i].person;
    
            divNode.appendChild(inputNode);
            divNode.appendChild(labelNode);

            content.appendChild(divNode);
        }    
    }
};

menu.watchGroupSpin = () => {
    const groupSelector = document.getElementById('group');
    groupSelector.onchange = menu.handleGroupChange;
};

menu.handlePanelSelection = (event) => {
    const index = event.target.value;
    const state = event.target.checked;

    spinner.pie[index].enabled = state;
    storage.savePie(spinner.pie);
    
    spinner.init();
};

menu.addListOfPanels = (node) => {
    const content = document.getElementsByClassName('panel-content')[0];
    content.innerHTML = '';

    for (let i = 0, len = spinner.pie.length; i < len; i++) {
        const divNode = document.createElement('div');
        divNode.classList.add('panel-active');

        const inputNode = document.createElement('input');
        inputNode.type = 'checkbox';
        inputNode.checked = spinner.pie[i].enabled;
        inputNode.id = spinner.pie[i].text;
        inputNode.name = 'panels';
        inputNode.value = i;
        inputNode.onchange = menu.handlePanelSelection;

        const labelNode = document.createElement('label');
        labelNode.setAttribute('for', 'panels'); 
        labelNode.innerText = spinner.pie[i].text;

        divNode.appendChild(inputNode);
        divNode.appendChild(labelNode);

        // Need Weight (data), Color, and Foreground color (fcolor)
        content.appendChild(divNode);
    }
};

menu.toggleHelp = (event = null) => {
    const allow = ['help-icon', 'help-wrapper'];
    if (spinner.state.spinning === true) return;
    if (event !== null && !menu.targetContains(event.target, allow)) return;
    
    spinner.state.help = !spinner.state.help;

    const help = document.querySelector('.help-wrapper');
    const helpState = help.classList.toggle('hidden');
};


// For Unit Testing
if (typeof module !== 'undefined' && module.hasOwnProperty('exports')) {
    module.exports = menu;
}