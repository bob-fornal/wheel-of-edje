
const winner = {};

winner.init = (doc = document) => {
    winner.queries = {
        wrapper: doc.querySelector('.winner-wrapper'),
        card: doc.querySelector('.winner-card'),
        prize: doc.querySelector('#prize'),
        prizeAdditional: doc.querySelector('#prize-additional-information'),
        prizeAdditionalNeeded: doc.querySelector('.prize-additional-information'),
        who: doc.querySelector('#prize-who')
    }
};

winner.getActivePerson = (activePerson) => {
    return (activePerson === null) ? 'You' : activePerson;
};

winner.setText = (data, activePerson) => {
    // set text and style
    winner.queries.prize.innerText = data.text;
    winner.queries.who.innerText = winner.getActivePerson(activePerson);
    winner.queries.card.setAttribute('style', `background-color: ${ data.color }; color: ${ data.fcolor };`);

    // set alternate text
    if (data.additionalText.length > 0) {
        winner.queries.prizeAdditional.innerText = data.additionalText;
        winner.queries.prizeAdditionalNeeded.classList.remove('hidden');
    }
};

winner.handlePerson = (data, spin = spinner, defMenu = menu, store = storage) => {
    // if person: set prize, clear, and save
    if (spin.state.activePerson !== null) {
        spin.state.activePerson.prize = data.text;
        spin.state.activePerson.additional = data.additionalText;
        
        defMenu.clearActivePerson();
        store.saveGroup(spin.group);
    }

};

winner.open = (data, spin = spinner) => {
    winner.setText(data, spin.state.activePerson);

    spin.state.winnerOpen = true;
    winner.queries.wrapper.classList.remove('hidden');

    winner.handlePerson(data, spin);
};

winner.close = (spin = spinner) => {
    spin.state.winnerOpen = false;
    winner.queries.wrapper.classList.add('hidden');
    winner.queries.prizeAdditionalNeeded.classList.add('hidden');
};

// For Unit Testing
if (typeof module !== 'undefined' && module.hasOwnProperty('exports')) {
    module.exports = winner;
}