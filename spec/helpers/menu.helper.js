
let mnu = {};

mnu.init = () => {};

mnu.mock = {
    state: {
        externalControl: false
    },
    
    clearActivePerson: () => {},
    closePrizes: () => {},
    
    displayActivePerson: () => {},
    
    seePrizes: () => {},
    
    toggle: () => {}
};

if (typeof module !== 'undefined' && module.hasOwnProperty('exports')) {
    module.exports = mnu;
}
