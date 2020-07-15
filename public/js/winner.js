
const winner = {
    wrapper: document.querySelector('.winner-wrapper'),
    card: document.querySelector('.winner-card'),
    prize: document.querySelector('#prize'),
    prizeAdditional: document.querySelector('#prize-additional-information'),
    prizeAdditionalNeeded: document.querySelector('.prize-additional-information'),
    who: document.querySelector('#prize-who')
};

winner.open = (data) => {
    spinner.state.winnerOpen = true;
    winner.prize.innerText = data.text;
    winner.who.innerText = (spinner.state.activePerson === null) ? 'You' : spinner.state.activePerson.person;
    winner.card.setAttribute('style', `background-color: ${ data.color }; color: ${ data.fcolor }`);

    if (data.additionalText.length > 0) {
        winner.prizeAdditional.innerText = data.additionalText;
        winner.prizeAdditionalNeeded.classList.remove('hidden');
    }

    winner.wrapper.classList.remove('hidden');

    if (spinner.state.activePerson !== null) {
        spinner.state.activePerson.prize = data.text;
        spinner.state.activePerson.additional = data.additionalText;
        
        menu.clearActivePerson();
        storage.saveGroup(spinner.group);
    }
};

winner.close = () => {
    spinner.state.winnerOpen = false;
    winner.wrapper.classList.add('hidden');
    winner.prizeAdditionalNeeded.classList.add('hidden');
};
