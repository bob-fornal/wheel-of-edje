
const storage = {
    store: null,

    pieDefault: [],
    groupDefault: [],
    activeSoundDefault: '',
    editAsTypeDefault: ''
};

storage.iterativeInit = (base, fn) => {
    if (!!base && typeof base[fn] === 'function') {
        base[fn]();
    } else {
        setTimeout(() => {
            iterativeInit();
        }, 100);
    }
};

storage.configureStorageDefaultData = () => {
    fetch("data/original.json")
        .then(response => response.json())
        .then(json => {
            storage.pieDefault = json['pie-default'];
            storage.groupDefault = json['group-default'];
            storage.activeSoundDefault = json['sound-default'];
            storage.editAsTypeDefault = json['edit-type-default'];

            storage.iterativeInit(spinner, 'init');
            storage.iterativeInit(winner, 'init');

            return json;
        });
};

storage.init = (win = window, defMenu = menu) => {
    storage.store = win.localStorage;

    storage.configureStorageDefaultData();
    storage.clearLoader();
    defMenu.init();
};

storage.editInit = (win = window) => {
    storage.store = win.localStorage;
};

storage.upgrades = {};

storage.upgrades.check = (type, data) => {
    switch(type) {
        case 'group':
            data = storage.upgrades.handlePersonToName(data);
            break;
    }

    return data;
};

storage.upgrades.handlePersonToName = (data) => {
    let upgradeOccurred = false;

    data.forEach((individual => {
        if ('person' in individual) {
            upgradeOccurred = true;
            individual.name = individual.person;
            delete individual.person;
        }
    }));

    if (upgradeOccurred === true) {
        storage.saveGroup(data);
    }

    return data;
};

storage.clearLoader = () => {
    setTimeout(() => {
        const loader = document.querySelector('.loader');
        loader.classList.add('fade-out');
        setTimeout(() => {
            loader.classList.add('hidden');
            loader.classList.remove('fade-out');
        }, 1900);
    }, 500);
};

storage.getPie = (key = 'pie-default') => {
    const data = storage.store.getItem(key);
    if (data === null) {
        return storage.savePie(storage.pieDefault, key);
    }
    return JSON.parse(data);
};

storage.savePie = (data, key = 'pie-default') => {
    storage.store.setItem(key, JSON.stringify(data));
    return data;
};

storage.getGroup = (key = 'group-default') => {
    const data = storage.store.getItem(key);
    
    if (data === null) {
        return storage.saveGroup(storage.groupDefault, key);
    }
    
    return storage.upgrades.check('group', JSON.parse(data));
};

storage.saveGroup = (data, key = 'group-default') => {
    storage.store.setItem(key, JSON.stringify(data));
    return data;
};

storage.getActiveSound = (key = 'sound-default') => {
    const data = storage.store.getItem(key);
    if (data === null) {
        return storage.saveActiveSound(storage.activeSoundDefault, key);
    }
    return JSON.parse(data);
};

storage.saveActiveSound = (data, key = 'sound-default') => {
    storage.store.setItem(key, JSON.stringify(data));
    return data;
};

storage.getEditAsType = (key = 'edit-type-default') => {
    const data = storage.store.getItem(key);
    if (data === null) {
        return storage.saveEditAsType(storage.editAsTypeDefault, key);
    }
    return JSON.parse(data);
};

storage.saveEditAsType = (data, key = 'edit-type-default') => {
    data = (data === '') ? 'LIST' : data;
    storage.store.setItem(key, JSON.stringify(data));
    return data;
};