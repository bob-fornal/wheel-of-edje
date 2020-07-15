
const winner = {
    wrapper: document.querySelector('.winner-wrapper'),
    card: document.querySelector('.winner-card'),
    prize: document.querySelector('#prize'),
    prizeAdditional: document.querySelector('#prize-additional-information'),
    prizeAdditionalNeeded: document.querySelector('.prize-additional-information'),
    who: document.querySelector('#prize-who')
};

winner.open = (data) => {
    state.winnerOpen = true;
    winner.prize.innerText = data.text;
    winner.who.innerText = (state.activePerson === null) ? 'You' : state.activePerson.person;
    winner.card.setAttribute('style', `background-color: ${ data.color }; color: ${ data.fcolor }`);

    if (data.additionalText.length > 0) {
        winner.prizeAdditional.innerText = data.additionalText;
        winner.prizeAdditionalNeeded.classList.remove('hidden');
    }

    winner.wrapper.classList.remove('hidden');

    if (state.activePerson !== null) {
        state.activePerson.prize = data.text;
        state.activePerson.additional = data.additionalText;
        
        menu.clearActivePerson();
        storage.saveGroup(group);
    }
};

winner.close = () => {
    state.winnerOpen = false;
    winner.wrapper.classList.add('hidden');
    winner.prizeAdditionalNeeded.classList.add('hidden');
};
