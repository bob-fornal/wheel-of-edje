
let store = {
    data: {}
};

store.init = () => {
    store.data = {};
};

store.mock = {
    getActiveSound: () => {},
    saveActiveSound: () => {},

    saveGroup: (group) => {
        store.data.group = group;
    },

    savePie: () => {}
};

if (typeof module !== 'undefined' && module.hasOwnProperty('exports')) {
    module.exports = store;
}
