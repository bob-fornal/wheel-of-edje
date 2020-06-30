
const storage = {
    store: window.localStorage,
    init: () => {},

    sample: [
        { data: 10, text: 'Pizza Party', color: '#93c760', fcolor: '#ffffff', enabled: true },
        { data: 10, text: 'Meat Box', color: '#000000', fcolor: '#ffff00', enabled: true },
        { data: 10, text: 'Prize 3', color: '#6ca437', fcolor: '#ffffff', enabled: true },
        { data: 10, text: 'Prize 4', color: '#4f861b', fcolor: '#ffffff', enabled: true },
        { data: 10, text: 'Prize 5', color: '#305e03', fcolor: '#ffffff', enabled: true },
        { data: 10, text: 'Prize 6', color: '#93c760', fcolor: '#ffffff', enabled: true },
        { data: 10, text: 'Prize 7', color: '#bee767', fcolor: '#000000', enabled: true },
        { data: 10, text: 'Prize 8', color: '#6ca437', fcolor: '#ffffff', enabled: true }
    ],

    groupSample: [
        { person: 'Bob', enabled: true, prize: null },
        { person: 'Jason', enabled: true, prize: null },
        { person: 'Erica', enabled: true, prize: null },
        { person: 'Bill', enabled: true, prize: null },
        { person: 'Dave', enabled: true, prize: null },
        { person: 'Wendy', enabled: true, prize: null }
    ]
};

storage.getPie = (key = 'default') => {
    const data = storage.store.getItem(key);
    if (data === null) {
        storage.store.setItem(key, JSON.stringify(storage.sample));
        return storage.sample;
    }
    return JSON.parse(data);
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
