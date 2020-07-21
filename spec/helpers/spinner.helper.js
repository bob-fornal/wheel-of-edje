
let spin = {};

spin.init = () => {
    spin.mock.state = {
        winnerOpen: false,
        activePerson: null,
        activePersonIndex: -1,
        activeSound: null,
        spinning: false,
        help: false
    };
    spin.mock.group = [{ name: 'Bob' }];
};

spin.mock = {
    init: () => {},
    state: {
        winnerOpen: false,
        activePerson: null,
        activePersonIndex: -1,
        activeSound: null,
        spinning: false,
        help: false
    },
    group: [{ name: 'Bob' }]
};

if (typeof module !== 'undefined' && module.hasOwnProperty('exports')) {
    module.exports = spin;
}
