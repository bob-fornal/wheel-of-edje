
const winnerWrapper = document.querySelector('.winner-wrapper');
const winnerCard = document.querySelector('.winner-card');
const winnerPrize = document.querySelector('#prize');
const winnerPrizeAdditional = document.querySelector('#prize-additional-information');
const winnerPrizeAdditionalNeeded = document.querySelector('.prize-additional-information');
const winnerWho = document.querySelector('#prize-who');

const openWinner = (data) => {
    state.winnerOpen = true;
    winnerPrize.innerText = data.text;
    winnerWho.innerText = (state.activePerson === null) ? 'You' : state.activePerson.person;
    winnerCard.setAttribute('style', `background-color: ${data.color}; color: ${data.fcolor}`);

    if (data.additionalText.length > 0) {
        winnerPrizeAdditional.innerText = data.additionalText;
        winnerPrizeAdditionalNeeded.classList.remove('hidden');
    }

    winnerWrapper.classList.remove('hidden');

    if (state.activePerson !== null) {
        state.activePerson.prize = data.text;
        state.activePerson.additional = data.additionalText;
        
        clearActivePerson();
        storage.saveGroup(group);
    }
};

const closeWinner = () => {
    state.winnerOpen = false;
    winnerWrapper.classList.add('hidden');
    winnerPrizeAdditionalNeeded.classList.add('hidden');
};
