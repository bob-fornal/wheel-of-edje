
const winnerWrapper = document.getElementsByClassName('winner-wrapper')[0];
const winnerCard = document.getElementsByClassName('winner-card')[0];
const winnerPrize = document.getElementById('prize');
const winnerWho = document.getElementById('prize-who');

const openWinner = (data) => {
    state.winnerOpen = true;
    winnerPrize.innerText = data.text;
    winnerWho.innerText = (state.activePerson === null) ? 'You' : state.activePerson.person;
    winnerCard.setAttribute('style', `background-color: ${data.color}; color: ${data.fcolor}`);
    winnerWrapper.classList.remove('hidden');

    if (state.activePerson !== null) {
        state.activePerson.prize = data.text;
        
        clearActivePerson();
        storage.saveGroup(group);
    }
};

const closeWinner = () => {
    state.winnerOpen = false;
    winnerWrapper.classList.add('hidden');
};
