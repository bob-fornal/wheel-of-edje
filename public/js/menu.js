
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

menu.toggle = (event = null) => {
    const allow = ['menu-icon', 'menu-wrapper'];
    if (state.spinning === true) return;
    if (event !== null && !menu.targetContains(event.target, allow)) return;
    
    state.menu = !state.menu;

    const menuSelector = document.querySelector('.menu-wrapper');
    const menuState = menuSelector.classList.toggle('hidden');

    if (menuState === false) { // HIDDEN
        menu.setSoundState();
        menu.addListOfPanels();
        menu.watchGroupSpin();
    }
};

menu.setSoundState = () => {
    const sounds = document.querySelectorAll('[name=sound]');
    for (let i = 0, len = sounds.length; i < len; i++) {
        if (sounds[i].value === state.activeSound) {
            sounds[i].checked = true;
            break;
        }
    }
};

menu.clearActivePerson = () => {
    const active = document.querySelector('.group-active-person');
    active.innerText = '';
    active.classList.add('hidden');

    state.activePerson = null;
};

menu.showActivePerson = () => {
    const active = document.querySelector('.group-active-person');
    active.innerText = state.activePerson.person;
    active.classList.remove('hidden');

    menu.toggleGroup();
};

menu.handleIndividualSelection = (name) => {
    let individual = null;
    for (let i = 0, len = group.length; i < len; i++) {
        if (group[i].person === name) {
            individual = group[i];
            break;
        }
    }

    state.activePerson = individual;
    menu.showActivePerson();
};

menu.toggleGroup = (event = null) => {
    const allow = ['group-icon', 'group-menu-wrapper', 'cancel'];
    if (event !== null) {
        event.stopPropagation();
        event.preventDefault();
        if (!menu.targetContains(event.target, allow)) return;
    }

    state.groupMenu = !state.groupMenu;
    menu.displayGroupInMenu();
};

menu.clearPrizes = (event = null) => {
    for (let i = 0, len = group.length; i < len; i++) {
        group[i].prize = null;
    }
    storage.saveGroup(group);
    menu.displayGroupInMenu();
    menu.toggleGroup();
};

menu.seePrizes = () => {
    const prizesWrapper = document.querySelector('.prizes-wrapper');
    const prizes = document.querySelector('.prizes .content');

    prizes.innerHTML = '';
    for (let i = 0, len = group.length; i < len; i++) {
        if (group[i].enabled === true) {
            const divNode = document.createElement('div');
            divNode.classList.add('prize-row');

            const nameNode = document.createElement('div');
            nameNode.classList.add('name');
            nameNode.innerText = group[i].person;

            let prizeString = (group[i].prize === null) ? 'NO SPIN' : group[i].prize;
            prizeString += (group[i].additional === '') ? '' : ` (${ group[i].additional })`

            const prizeNode = document.createElement('div');
            prizeNode.classList.add('prize-won');
            prizeNode.innerText = (group[i].prize === null) ? 'NO SPIN' : prizeString;

            divNode.appendChild(nameNode);
            divNode.appendChild(prizeNode);
            prizes.appendChild(divNode);
        }
    }
    menu.toggleGroup();
    prizesWrapper.classList.remove('hidden');
};

menu.closePrizes = () => {
    const prizesWrapper = document.querySelector('.prizes-wrapper');
    prizesWrapper.classList.add('hidden');
};

menu.displayGroupInMenu = () => {
    const groupMenuWrapper = document.querySelector('.group-menu-wrapper');
    const groupMenu = document.querySelector('.group-menu');

    if (state.groupMenu === true) {
        groupMenu.innerHTML = '';

        const divNode3 = document.createElement('div');
        divNode3.classList.add('see-prizes');
        divNode3.innerText = 'SEE PRIZES';
        divNode3.onclick = menu.seePrizes;
        groupMenu.appendChild(divNode3);

        for (let i = 0, len = group.length; i < len; i++) {
            if (group[i].enabled === true) {
                const divNode = document.createElement('div');
                divNode.classList.add('individual');
                divNode.innerText = group[i].person;
                if (group[i].prize === null) {
                    divNode.onclick = menu.handleIndividualSelection.bind(this, group[i].person);
                } else {
                    divNode.classList.add('won');
                }
                groupMenu.appendChild(divNode);
            }
        }

        const divNode2 = document.createElement('div');
        divNode2.classList.add('clear-prizes');
        divNode2.innerText = 'CLEAR PRIZES';
        divNode2.onclick = menu.clearPrizes;
        groupMenu.appendChild(divNode2);

        const divNode4 = document.createElement('div');
        divNode4.classList.add('cancel');
        divNode4.innerText = 'CANCEL';
        divNode4.onclick = menu.toggleGroup;
        groupMenu.appendChild(divNode4);
    }

    groupMenuWrapper.classList.toggle('hidden');
};

menu.setGlobalGroupState = (state) => {
    const groupOffIcon = document.querySelector('.group-icon.disabled');
    const groupOnIcon = document.querySelector('.group-icon.enabled');

    state.groupMode = state;
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

    group[index].enabled = state;
    storage.saveGroup(group);
};

menu.handleGroupChange = (event = null) => {
    const groupChecked = (event === null) ? state.groupMode : event.target.checked;
    state.groupMode = groupChecked;

    if (event === null) {
        const group = document.getElementById('group');
        group.checked = groupChecked;    
    }

    const content = document.querySelector('.panel-group-content');
    content.innerHTML = '';

    menu.setGlobalGroupState(groupChecked);
    if (groupChecked === true) {
        for (let i = 0, len = group.length; i < len; i++) {
            const divNode = document.createElement('div');
            divNode.classList.add('panel-active');

            const inputNode = document.createElement('input')
            inputNode.type = 'checkbox';
            inputNode.checked = group[i].enabled;
            inputNode.id = group[i].person;
            inputNode.name = 'groups';
            inputNode.value = i;
            inputNode.onchange = menu.handleGroupSelection;
    
            const labelNode = document.createElement('label');
            labelNode.setAttribute('for', 'groups'); 
            labelNode.innerText = group[i].person;
    
            divNode.appendChild(inputNode);
            divNode.appendChild(labelNode);

            content.appendChild(divNode);
        }    
    }
};

menu.watchGroupSpin = () => {
    const group = document.getElementById('group');
    group.onchange = menu.handleGroupChange;
};

menu.handlePanelSelection = (event) => {
    const index = event.target.value;
    const state = event.target.checked;

    pie[index].enabled = state;
    storage.savePie(pie);
    
    init();
};

menu.addListOfPanels = (node) => {
    const content = document.getElementsByClassName('panel-content')[0];
    content.innerHTML = '';

    for (let i = 0, len = pie.length; i < len; i++) {
        const divNode = document.createElement('div');
        divNode.classList.add('panel-active')

        const inputNode = document.createElement('input')
        inputNode.type = 'checkbox';
        inputNode.checked = pie[i].enabled;
        inputNode.id = pie[i].text;
        inputNode.name = 'panels';
        inputNode.value = i;
        inputNode.onchange = menu.handlePanelSelection;

        const labelNode = document.createElement('label');
        labelNode.setAttribute('for', 'panels'); 
        labelNode.innerText = pie[i].text;

        divNode.appendChild(inputNode);
        divNode.appendChild(labelNode);

        // Need Weight (data), Color, and Foreground color (fcolor)
        content.appendChild(divNode);
    }
};

menu.toggleHelp = (event = null) => {
    const allow = ['help-icon', 'help-wrapper'];
    if (state.spinning === true) return;
    if (event !== null && !menu.targetContains(event.target, allow)) return;
    
    state.help = !state.help;

    const help = document.querySelector('.help-wrapper');
    const helpState = help.classList.toggle('hidden');
};
