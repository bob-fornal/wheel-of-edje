
let spin = {};

spin.init = () => {
    spin.mock.state = {
        winnerOpen: false,
        activePerson: null
    };
    spin.mock.group = [{ name: 'Bob' }];
};

spin.mock = {
    state: {
        winnerOpen: false,
        activePerson: null,
        activeSound: null
    },
    group: [{ name: 'Bob' }]
};

if (typeof module !== 'undefined' && module.hasOwnProperty('exports')) {
    module.exports = spin;
}
