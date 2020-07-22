
let store = {
    data: {}
};

store.init = () => {
    store.data = {};
};

store.mock = {
    getActiveSound: () => {},
    saveActiveSound: () => {},

    getGroup: () => {},
    saveGroup: (group) => {
        store.data.group = group;
    },

    getPie: () => {},
    savePie: () => {},

    saveEditAsType: () => {}
};

if (typeof module !== 'undefined' && module.hasOwnProperty('exports')) {
    module.exports = store;
}
