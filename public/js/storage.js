
const database = firebase.database();

const storage = {
    store: window.localStorage,
    init: () => {},

    sample: [
        { data: 10, text: 'Gift Card', additionalText: '', color: '#1e3d00', fcolor: '#ffffff', enabled: true },
        { data: 10, text: '1 EDJE Store Item', additionalText: 'up to $35', color: '#326204', fcolor: '#ffffff', enabled: true },
        { data: 10, text: 'Team Pizza Party', additionalText: 'up to 15', color: '#4f861b', fcolor: '#ffffff', enabled: true },
        { data: 10, text: 'Gift Card', additionalText: '', color: '#1e3d00', fcolor: '#ffffff', enabled: true },
        { data: 10, text: 'Mystery', additionalText: '', color: '#326204', fcolor: '#ffffff', enabled: true },
        { data: 10, text: 'Client Fat Friday', additionalText: '3 dozen donuts', color: '#4f861b', fcolor: '#ffffff', enabled: true },
        { data: 10, text: 'Chad Gives You $50 Cash', additionalText: '1 per QBR', color: '#000000', fcolor: '#ffff00', enabled: true },
        { data: 10, text: '1 EDJE Store Item', additionalText: 'up to $35', color: '#6da438', fcolor: '#ffffff', enabled: true },
        { data: 10, text: 'Cupcakes at Client', additionalText: '3 dozen', color: '#97ca66', fcolor: '#ffffff', enabled: true },
        { data: 10, text: 'Gift Card', additionalText: '', color: '#1e3d00', fcolor: '#ffffff', enabled: true },
        { data: 10, text: 'Lunch on EDJE', additionalText: 'plus 1, to $50', color: '#326204', fcolor: '#ffffff', enabled: true },
        { data: 10, text: 'Team Pizza Party', additionalText: 'up to 15', color: '#4f861b', fcolor: '#ffffff', enabled: true },
        { data: 10, text: 'Client Fat Friday', additionalText: '3 dozen donuts', color: '#6da438', fcolor: '#ffffff', enabled: true },
        { data: 10, text: 'Gift Card', additionalText: '', color: '#1e3d00', fcolor: '#ffffff', enabled: true },
        { data: 10, text: 'Steak Dinner From Omaha', additionalText: '$70', color: '#000000', fcolor: '#ffff00', enabled: true },
        { data: 10, text: '1 EDJE Store Item', additionalText: 'up to $35', color: '#326204', fcolor: '#ffffff', enabled: true },
        { data: 10, text: 'White Castle Slider Party', additionalText: '', color: '#4f861b', fcolor: '#ffffff', enabled: true },
        { data: 10, text: 'Lunch on EDJE', additionalText: 'plus 1, to $50', color: '#6da438', fcolor: '#ffffff', enabled: true }
    ],

    groupSample: [
        { person: 'Bob', enabled: true, prize: null, additional: null },
        { person: 'Jason', enabled: true, prize: null, additional: null },
        { person: 'Erica', enabled: true, prize: null, additional: null },
        { person: 'Bill', enabled: true, prize: null, additional: null },
        { person: 'Dave', enabled: true, prize: null, additional: null },
        { person: 'Wendy', enabled: true, prize: null, additional: null }
    ],

    activeSoundSample: 'metronome'
};

storage.getPie = (key = 'pie-default') => {
    const data = storage.store.getItem(key);
    if (data === null) {
        return storage.savePie(storage.sample, key);
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
        return storage.saveGroup(storage.groupSample, key);
    }
    return JSON.parse(data);
};

storage.saveGroup = (data, key = 'group-default') => {
    storage.store.setItem(key, JSON.stringify(data));
    return data;
};

storage.getActiveSound = (key = 'sound-default') => {
    const data = storage.store.getItem(key);
    if (data === null) {
        return storage.saveActiveSound(storage.activeSoundSample, key);
    }
    return JSON.parse(data);
};

storage.saveActiveSound = (data, key = 'sound-default') => {
    storage.store.setItem(key, JSON.stringify(data));
    return data;
};
