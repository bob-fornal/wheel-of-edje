
let doc = {
    elements: {
        created: 0,
        types: []
    }
};

doc.init = () => {
    doc.elements = {
        created: 0,
        types: []
    };
};

doc.mock = {
    configurationFn: null,
    dataSounds: [],

    createElement: () => {
        const name = `UNDEFINED-${ doc.elements.created }`;
        const creation = doc.handleDocumentObjectCreation(name);
        doc.elements.types.push(creation);
        doc.elements[name] = creation;
        doc.elements.created++;
        return creation;
    },
    getElementById: (name) => {
        const id = `id-${ name }`;
        if (id in doc.elements) {
            if (doc.mock.configurationFn !== null) {
                doc.mock.configurationFn(doc.elements[id]);
                doc.mock.configurationFn = null;
            }
            return doc.elements[id];
        }
        doc.elements[id] = doc.handleDocumentObjectCreation(id);
        if (doc.mock.configurationFn !== null) {
            doc.mock.configurationFn(doc.elements[id]);
            doc.mock.configurationFn = null;
        }
        return doc.elements[id];
    },
    querySelectorAll: (name) => {
        if (doc.mock.configurationFn !== null) {
            const result = doc.mock.configurationFn();
            // process.stdout.write(name);
            doc.mock.configurationFn = null;
            return result;
        }
        return [];
    },
    querySelector: (name) => {
        if (name in doc.elements) {
            if (doc.mock.configurationFn !== null) {
                doc.mock.configurationFn(doc.elements[name]);
                doc.mock.configurationFn = null;
            }
            return doc.elements[name];
        }
        doc.elements[name] = doc.handleDocumentObjectCreation(name);
        if (doc.mock.configurationFn !== null) {
            doc.mock.configurationFn(doc.elements[name]);
            doc.mock.configurationFn = null;
        }
        return doc.elements[name];
    },

    getElement: name => doc.elements[name] || undefined
};   

doc.handleDocumentObjectCreation = (name) => {
    let obj = {
        name: name,
        innerText: '~~~NONE~~~',
        classList: {
            list: []
        },
        attributes: {}
    };
    
    obj.setAttribute = (key, values) => {
        obj.attributes[key] = values;
    };
    obj.appendChild = () => {};

    obj.classList.add = (className) => {
        obj.classList.list.push(className);
    };
    obj.classList.remove = (className) => {
        let list = obj.classList.list;
        list = list.filter(e => e !== className);
    };
    obj.classList.toggle = (className) => {
        let result = false;
        if (obj.classList.list.includes(className)) {
            result = false;
            obj.classList.list = obj.classList.list.filter(e => e !== className);
        } else {
            result = true;
            obj.classList.list.push(className);
        }
        return result;
    };

    return obj;
};


if (typeof module !== 'undefined' && module.hasOwnProperty('exports')) {
    module.exports = doc;
}