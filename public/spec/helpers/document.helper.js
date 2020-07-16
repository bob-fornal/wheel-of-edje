
let document = {
    elements: {
        created: 0,
        types: []
    }
};

document.init = () => {
    document.elements = {
        created: 0,
        types: []
    };
};

document.mock = {
    configurationFn: null,
    dataSounds: [],

    createElement: () => {
        const creation = document.handleDocumentObjectCreation();
        document.elements.types.push(creation);
        document.elements[`UNDEFINED-${ document.elements.created }`] = creation;
        document.elements.created++;
        return creation;
    },
    querySelectorAll: (name) => {
        if (document.mock.configurationFn !== null) {
            const result = document.mock.configurationFn();
            // process.stdout.write(name);
            document.mock.configurationFn = null;
            return result;
        }
        return [];
    },
    querySelector: (name) => {
        document.elements[name] = document.handleDocumentObjectCreation();
        if (document.mock.configurationFn !== null) {
            document.mock.configurationFn(document.elements[name]);
            document.mock.configurationFn = null;
        }
        return document.elements[name];
    },

    getElement: name => document.elements[name] || undefined
};   

document.handleDocumentObjectCreation = () => {
    let obj = {
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
        let list = obj.classList.list;
        if (list.includes(className) === true) {
            result = false;
            obj.classList.remove(className);
        } else {
            result = true;
            obj.classList.add(className);
        }
        return result;
    }

    return obj;
};


if (typeof module !== 'undefined' && module.hasOwnProperty('exports')) {
    module.exports = document;
}