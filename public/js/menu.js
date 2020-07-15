
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
    if (spinner.spinning === true) return;
    if (event !== null && !menu.targetContains(event.target, allow)) return;
    
    spinner.state.menu = !spinner.state.menu;

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
        if (sounds[i].value === spinner.state.activeSound) {
            sounds[i].checked = true;
            break;
        }
    }
};

menu.clearActivePerson = () => {
    const active = document.querySelector('.group-active-person');
    active.innerText = '';
    active.classList.add('hidden');

    spinner.state.activePerson = null;
};

menu.showActivePerson = () => {
    const active = document.querySelector('.group-active-person');
    active.innerText = spinner.state.activePerson.person;
    active.classList.remove('hidden');

    menu.toggleGroup();
};

menu.handleIndividualSelection = (name) => {
    let individual = null;
    for (let i = 0, len = spinner.group.length; i < len; i++) {
        if (spinner.group[i].person === name) {
            individual = spinner.group[i];
            break;
        }
    }

    spinner.state.activePerson = individual;
    menu.showActivePerson();
};

menu.toggleGroup = (event = null) => {
    const allow = ['group-icon', 'group-menu-wrapper', 'cancel'];
    if (event !== null) {
        event.stopPropagation();
        event.preventDefault();
        if (!menu.targetContains(event.target, allow)) return;
    }

    spinner.state.groupMenu = !spinner.state.groupMenu;
    menu.displayGroupInMenu();
};

menu.clearPrizes = (event = null) => {
    for (let i = 0, len = spinner.group.length; i < len; i++) {
        spinner.group[i].prize = null;
    }
    storage.saveGroup(spinner.group);
    menu.displayGroupInMenu();
    menu.toggleGroup();
};

menu.seePrizes = () => {
    const prizesWrapper = document.querySelector('.prizes-wrapper');
    const prizes = document.querySelector('.prizes .content');

    prizes.innerHTML = '';
    for (let i = 0, len = spinner.group.length; i < len; i++) {
        if (spinner.group[i].enabled === true) {
            const divNode = document.createElement('div');
            divNode.classList.add('prize-row');

            const nameNode = document.createElement('div');
            nameNode.classList.add('name');
            nameNode.innerText = spinner.group[i].person;

            let prizeString = (spinner.group[i].prize === null) ? 'NO SPIN' : spinner.group[i].prize;
            prizeString += (spinner.group[i].additional === '') ? '' : ` (${ spinner.group[i].additional })`

            const prizeNode = document.createElement('div');
            prizeNode.classList.add('prize-won');
            prizeNode.innerText = (spinner.group[i].prize === null) ? 'NO SPIN' : prizeString;

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

    if (spinner.state.groupMenu === true) {
        groupMenu.innerHTML = '';

        const divNode3 = document.createElement('div');
        divNode3.classList.add('see-prizes');
        divNode3.innerText = 'SEE PRIZES';
        divNode3.onclick = menu.seePrizes;
        groupMenu.appendChild(divNode3);

        for (let i = 0, len = spinner.group.length; i < len; i++) {
            if (spinner.group[i].enabled === true) {
                const divNode = document.createElement('div');
                divNode.classList.add('individual');
                divNode.innerText = spinner.group[i].person;
                if (spinner.group[i].prize === null) {
                    divNode.onclick = menu.handleIndividualSelection.bind(this, spinner.group[i].person);
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

            const inputNode = document.createElement('input')
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
        divNode.classList.add('panel-active')

        const inputNode = document.createElement('input')
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
