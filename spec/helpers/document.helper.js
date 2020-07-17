
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
        const creation = doc.handleDocumentObjectCreation();
        doc.elements.types.push(creation);
        doc.elements[`UNDEFINED-${ doc.elements.created }`] = creation;
        doc.elements.created++;
        return creation;
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
        doc.elements[name] = doc.handleDocumentObjectCreation();
        if (doc.mock.configurationFn !== null) {
            doc.mock.configurationFn(doc.elements[name]);
            doc.mock.configurationFn = null;
        }
        return doc.elements[name];
    },

    getElement: name => doc.elements[name] || undefined
};   

doc.handleDocumentObjectCreation = () => {
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
    module.exports = doc;
}