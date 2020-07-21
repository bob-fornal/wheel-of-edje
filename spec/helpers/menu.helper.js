
let menuHelper = {};

menuHelper.init = () => {};

menuHelper.mock = {
    state: {
        externalControl: false
    },
    clearActivePerson: () => {}
};

if (typeof module !== 'undefined' && module.hasOwnProperty('exports')) {
    module.exports = menuHelper;
}
