
let spin = {};

spin.init = () => {
    spin.mock.state = {
        winnerOpen: false,
        activePerson: null
    };
    spin.mock.group = [{ person: 'Bob' }];
};

spin.mock = {
    state: {
        winnerOpen: false,
        activePerson: null,
        activeSound: null
    },
    group: [{ person: 'Bob' }]
};

if (typeof module !== 'undefined' && module.hasOwnProperty('exports')) {
    module.exports = spin;
}
