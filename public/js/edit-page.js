
const edit = {
    defaultColorPattern: {
        color: '#bee767',
        fcolor: '#ffffff'
    },

    data: null,
    pattern: null,
    selected: null,
    preview: false,
    previewFn: null,
    enterToSave: false,
    saveFn: null,
    editAsOption: false,
    editAsType: 'LIST',

    skipHandleRowSelection: false
};

edit.reset = () => {
    edit.defaultColorPattern = {
        color: '#bee767',
        fcolor: '#ffffff'
    };
    
    edit.data = null;
    edit.pattern = null;
    edit.selected = null;
    edit.preview = false;
    edit.previewFn = null;
    edit.enterToSave = false;
    edit.saveFn = null;
    edit.editAsOption = false;
    edit.editAsType = 'LIST';
    
    edit.skipHandleRowSelection = false;
};

edit.determineType = (win = window) => {
    edit.params = new win.URLSearchParams(win.location.search);
    edit.type = edit.params.get('type');
};

edit.init = async(store = storage) => {
    edit.determineType();

    store.editInit();

    edit.generateQueries();
    edit.configuration();

    if (edit.editAsOption === true) {
        edit.editAsType = await store.getEditAsType();
        edit.selectEditAsType(edit.editAsType);
    }

    if (edit.editAsType === 'LIST') {
        edit.showList();
    } else {
        edit.showCSV();
    }
};

edit.generateQueries = (doc = document) => {
    edit.title = doc.querySelector('.title .specific');
    edit.add = doc.querySelector('.tooling .addition-button .add-type');
    edit.del = doc.querySelector('.tooling .delete-all-button .delete-type');
    edit.previewState = doc.querySelector('.tooling .preview-available .right');
    edit.enterToSaveState = doc.querySelector('.tooling .enter-to-save .right');
    edit.editAsState = doc.querySelector('.tooling .edit-as-type');
    edit.editAsLIST = doc.querySelector('.tooling .edit-as-type .left');
    edit.editAsCSV = doc.querySelector('.tooling .edit-as-type .right');
};

edit.generateAdditionalValueString = (value) => {
    return (value === '') ? '' : `(${ value })`;
};

edit.panelPattern = {
    order: ['text', 'additionalText', 'color', 'fcolor', 'data', 'enabled'],
    data: { skip: false, text: 'Weight', type: 'number', default: 10 },
    text: { skip: false, text: 'Title', type: 'string', default: '' },
    additionalText: { skip: false, text: 'Sub Title', type: 'string', default: '' },
    color: { skip: false, text: 'Background Color', type: 'color', default: edit.defaultColorPattern.color },
    fcolor: { skip: false, text: 'Foreground Color', type: 'color', default: edit.defaultColorPattern.fcolor },
    enabled: { skip: true, text: 'Enabled', type: 'boolean', default: true }
};
edit.groupPattern = {
    order: ['name'],
    name: { skip: false, text: 'Name', type: 'string', default: '' },
    prize: { skip: true, text: 'Prize', type: 'string', default: null },
    additional: { skip: true, text: 'Additional', type: 'string', default: null },
    enabled: { skip: true, text: 'Enabled', type: 'boolean', default: true }
};

edit.previewPanel = (dataPoint, doc = document) => {
    const completeMarker = doc.createElement('div');
    completeMarker.classList.add('panel-text');
    
    const marker = doc.createElement('div');
    marker.classList.add('panel-main-text');
    marker.innerText = dataPoint.text;
    completeMarker.appendChild(marker);

    const additionalMarker = doc.createElement('div');
    additionalMarker.classList.add('panel-additional-text');
    additionalMarker.innerText = edit.generateAdditionalValueString(dataPoint.additionalText);
    completeMarker.appendChild(additionalMarker);

    const panel = doc.createElement('div');
    panel.classList.add('panel-preview');
    panel.style.backgroundColor = dataPoint.color;
    panel.style.color = dataPoint.fcolor;
    panel.appendChild(completeMarker);

    return panel;
};

edit.configuration = (store = storage) => {
    switch (true) {
        case (edit.type ==='group'):
            edit.pattern = edit.groupPattern;
            edit.data = store.getGroup();
            edit.preview = false;
            edit.previewFn = null;
            edit.enterToSave = true;
            edit.saveFn = store.saveGroup;
            edit.editAsOption = true;
    
            edit.title.innerText = 'Group Individuals';
            edit.add.innerText = 'INDIVIDUAL';
            edit.del.innerText = 'GROUP';
            break;
        case (edit.type === 'panels'):
            edit.pattern = edit.panelPattern;
            edit.data = store.getPie();
            edit.preview = true;
            edit.previewFn = edit.previewPanel;
            edit.enterToSave = false;
            edit.saveFn = store.savePie;
            edit.editAsOption = false;
    
            edit.title.innerText = 'Panels';
            edit.add.innerText = 'PANEL';
            edit.del.innerText = 'PANELS';
            break;
    }
    edit.previewState.innerText = edit.preview.toString().toUpperCase();
    edit.enterToSaveState.innerText = edit.enterToSave.toString().toUpperCase();
    if (edit.editAsOption === true) {
        edit.editAsState.classList.remove('hidden');
        edit.editAsLIST.classList.add('selected');
        edit.editAsCSV.classList.remove('selected');
        edit.editAsType = 'LIST';
    } else {
        edit.editAsState.classList.add('hidden');
    }    
};

edit.back = (win = window) => {
    win.history.back();
};

edit.selectEditAsType = (type = 'LIST', doc = document, store = storage) => {
    edit.editAsType = type;

    const addTooling = doc.querySelector('.tooling .addition-button');
    const delTooling = doc.querySelector('.tooling .delete-all-button');        

    if (type === 'LIST') {
        edit.editAsLIST.classList.add('selected');
        edit.editAsCSV.classList.remove('selected');
        addTooling.classList.remove('hidden');
        delTooling.classList.remove('hidden');
        edit.showList(); 
    } else if (type === 'CSV') {
        edit.editAsLIST.classList.remove('selected');
        edit.editAsCSV.classList.add('selected');
        addTooling.classList.add('hidden');
        delTooling.classList.add('hidden');
        edit.showCSV(); 
    }

    store.saveEditAsType(type);
};

edit.handleSimpleSelection = (target) => {
    const targetData = target.getAttribute('data-index');
    target.classList.add('selected');
    const index = Number(targetData);

    const editorNode = target.querySelector('.editor-node');
    editorNode.classList.remove('hidden');

    edit.selected = {
        index: index,
        data: edit.data[index],
        target: target
    };    
};

edit.handleEditPreview = () => {
    const value = edit.selected.data.text;
    const additionalValue = edit.selected.data.additionalText;

    edit.changePreviewPanelText({
        value, target: edit.selected.target.querySelector('.panel-main-text')
    });
    edit.changePreviewPanelText({
        value: edit.generateAdditionalValueString(additionalValue),
        target: edit.selected.target.querySelector('.panel-additional-text')
    });

    let style = {
        color: edit.selected.data.color,
        fcolor: edit.selected.data.fcolor
    };

    edit.changePreviewPanelColor({
        value: style,
        target: edit.selected.target.querySelector('.panel-preview')
    });
};

edit.handleRowSelection = (event, doc = document) => {
    if (edit.skipHandleRowSelection === true) {
        edit.skipHandleRowSelection = false;
        return;
    }
    if (event.target.nodeName !== 'DIV') return;

    if (edit.selected !== null) {
        const editorNode = doc.querySelector('.element.selected .editor-node');
        editorNode.classList.add('hidden');

        edit.selected.target.classList.remove('selected');
        
        if (edit.preview === true) {
            edit.handleEditPreview();
        }
    }

    const target = event.currentTarget;
    edit.handleSimpleSelection(target);
};

edit.handleDeleteAll = () => {
    edit.data = [];
    edit.selected = null;

    edit.showList();
    edit.saveFn(edit.data);
};

edit.handleMoveUp = (event, win = window) => {
    event.stopPropagation();
    if (edit.selected.index === 0) return;

    const hold1 = win.Object.assign({}, edit.selected.data);
    const hold2 = win.Object.assign({}, edit.data[edit.selected.index - 1]);

    edit.data[edit.selected.index] = hold2;
    edit.data[edit.selected.index - 1] = hold1;
    edit.selected = null;

    edit.showList();
    edit.saveFn(edit.data);
};

edit.handleMoveDown = (event) => {
    event.stopPropagation();
    if (edit.selected.index === (edit.data.length - 1)) return;

    const hold1 = Object.assign({}, edit.selected.data);
    const hold2 = Object.assign({}, edit.data[edit.selected.index + 1]);

    edit.data[edit.selected.index] = hold2;
    edit.data[edit.selected.index + 1] = hold1;
    edit.selected = null;

    edit.showList();
    edit.saveFn(edit.data);
};

edit.handleDeleteSelection = (event) => {
    event.stopPropagation();

    edit.data.splice(edit.selected.index, 1);
    edit.selected = null;

    edit.showList();
    edit.saveFn(edit.data);
};

edit.coreSaveType = (result, target, pattern, matchValue) => {
    const data = target.querySelectorAll(pattern);
    data.forEach(datum => {
        const key = datum.getAttribute('data-key');
        const type = edit.pattern[key].type;
        const value = matchValue(datum, type);

        result[key] = value;
    });
};

edit.coreSave = (event, target, result) => {
    event.stopPropagation();

    let pattern = '[datatype=string-edit]';
    let matchValue = (datum, type = '') => (type === 'string') ? datum.value : Number(datum.value);
    edit.coreSaveType(result, target, pattern, matchValue);

    pattern = '[datatype=color-edit]';
    matchValue = (datum) => datum.value;
    edit.coreSaveType(result, target, pattern, matchValue);

    return result;
};

edit.handleSaveNew = (event, doc = document) => {
    const target = doc.querySelector('.element-addition');
    let result = edit.coreSave(event, target, {});

    for (let key in edit.pattern) {
        if (key !== 'order' && edit.pattern[key].skip === true) {
            result[key] = edit.pattern[key].default;
        }
    }

    edit.data.unshift(result);

    edit.showList();
    edit.saveFn(edit.data);
};

edit.handleSaveSelection = (event) => {
    const target = edit.selected.target;
    const editorNode = target.querySelector('.editor-node');
    editorNode.classList.add('hidden');

    edit.coreSave(event, target, edit.selected.data);

    target.classList.remove('selected');
    edit.selected = null;

    edit.showList();
    edit.saveFn(edit.data);
};

edit.handleNextSelection = (currentIndex, doc = document) => {
    const nextIndex = ((currentIndex + 1) > (edit.data.length - 1)) ? 0 : currentIndex + 1;
    const target = doc.querySelector(`[data-index="${ nextIndex }"]`);

    edit.handleSimpleSelection(target);
    setTimeout(() => {
        const inputTarget = target.querySelector('[datatype="string-edit"]');
        inputTarget.focus();
    }, 20);
};

edit.changePreviewPanelColor = ({ value, target }) => {
    if (edit.preview === true) {
        target.setAttribute('style', `background-color: ${ value.color }; color: ${ value.fcolor };`);
    }
};

edit.getSelector = (event, doc = document) => {
    let selector = '';
    const additionNode = doc.querySelector('.element-addition');
    if (additionNode.contains(event.target)) {
        selector = '.element-addition';
    } else {
        selector = '.element.selected';
    }
    return selector;
};

edit.handleColorChange = (event, doc = document) => {
    event.stopPropagation();
    edit.skipHandleRowSelection = true;

    const selector = edit.getSelector(event);

    const key = event.target.getAttribute('data-key');
    const value = event.target.value;

    let style = (selector === '.element.selected') ? {
        color: edit.selected.data.color,
        fcolor: edit.selected.data.fcolor
    } : {
        color: edit.defaultColorPattern.color,
        fcolor: edit.defaultColorPattern.fcolor
    };

    if (key === 'color') {
        style.color = value;
    } else if (key === 'fcolor') {
        style.fcolor = value;
    }

    edit.changePreviewPanelColor({ value: style, target: doc.querySelector(`${ selector } .panel-preview`) });
};

edit.changePreviewPanelText = ({ value, target }) => {
    if (edit.preview === true) {
        target.innerText = value;
    }
};

edit.handleStringKeyup = (event, doc = document) => {
    let selector = edit.getSelector(event);

    if (edit.enterToSave === true && event.key === 'Enter') {
        const index = edit.selected.index;
        edit.handleSaveSelection(event);
        edit.handleNextSelection(index);
        return;
    }

    const value = event.target.value;
    const key = event.target.getAttribute('data-key');
    if (key === 'text') {
        edit.changePreviewPanelText({
            value, target: doc.querySelector(`${ selector } .panel-main-text`)
        });
    } else if (key === 'additionalText') {
        edit.changePreviewPanelText({
            value: edit.generateAdditionalValueString(value),
            target: doc.querySelector(`${ selector } .panel-additional-text`)
        });
    }
};

edit.handleAddition = (doc = document) => {
    const addition = doc.querySelector('.element-addition');
    addition.classList.remove('hidden');
};

edit.createEditorNode = (add, doc = document) => {
    const node = doc.createElement('div');
    if (add === true) {
        node.classList.add('editor-node');
    } else {
        node.classList.add('editor-node', 'hidden');
    }
    return node;
};

edit.createUpNode = (first, doc = document) => {
    const node = doc.createElement('img');
    node.classList.add('editor-icon', 'up');
    if (first === true) {
        node.classList.add('disabled');
        node.src = 'images/up-disabled.png';
    } else {
        node.src = 'images/up.png';
    }
    node.onclick = edit.handleMoveUp;
    node.title = 'Move Up';
    return node;
};

edit.createDownNode = (last, doc = document) => {
    const node = doc.createElement('img');
    node.classList.add('editor-icon', 'down');
    if (last === true) {
        node.classList.add('disabled');
        node.src = 'images/down-disabled.png';
    } else {
        node.src = 'images/down.png';
    }
    node.onclick = edit.handleMoveDown;
    node.title = 'Move Down';
    return node;
};

edit.createSaveNode = (add, doc = document) => {
    const node = doc.createElement('img');
    node.classList.add('editor-icon', 'save');
    node.src = 'images/save.png';
    if (add === true) {
        node.onclick = edit.handleSaveNew;
        node.title = 'Save New Row';
    } else {
        node.onclick = edit.handleSaveSelection;
        node.title = 'Save Row Changes';
    }
    return node;
};

edit.createDeleteNode = (add, doc = document) => {
    const node = doc.createElement('img');
    node.classList.add('editor-icon', 'delete');
    if (add === true) {
        node.src = 'images/trash-disabled.png';
    } else {
        node.src = 'images/trash.png';
        node.onclick = edit.handleDeleteSelection;
    }
    node.title = 'Delete Row';
    return node;
};

edit.addEditorNode = (node, first = false, last = false, add = false) => {
    const editorNode = edit.createEditorNode(add);

    const upNode = edit.createUpNode(first);
    editorNode.appendChild(upNode);

    const downNode = edit.createDownNode(last);
    editorNode.appendChild(downNode);

    const saveNode = edit.createSaveNode(add);
    editorNode.appendChild(saveNode);

    const deleteNode = edit.createDeleteNode(add);
    editorNode.appendChild(deleteNode);

    node.appendChild(editorNode);    
};

edit.addStringNode = (div, subdata, key, doc = document) => {
    const divContent = doc.createElement('div');
    divContent.classList.add('element-content');
    divContent.setAttribute('datatype', 'string-view');
    divContent.innerText = subdata;
    div.appendChild(divContent);
    
    const inputContent = doc.createElement('input');
    inputContent.type = 'text';
    inputContent.value = subdata;
    inputContent.setAttribute('datatype', 'string-edit');
    inputContent.setAttribute('data-key', key);
    inputContent.onkeyup = edit.handleStringKeyup;
    div.appendChild(inputContent);
};

edit.addColorNode = (div, subdata, key, doc = document) => {
    const divContent = doc.createElement('div');
    divContent.classList.add('element-content');
    divContent.setAttribute('datatype', 'color-view');
    divContent.setAttribute('style', `background-color: ${ subdata };`);
    div.appendChild(divContent);

    const inputContent = doc.createElement('input');
    inputContent.type = 'color';
    inputContent.value = subdata;
    inputContent.setAttribute('datatype', 'color-edit');
    inputContent.onchange = edit.handleColorChange;
    inputContent.setAttribute('data-key', key);
    div.appendChild(inputContent);
};

edit.addElement = ({ element, j, divNode  }, doc = document) => {
    const rowNode = doc.createElement('div');
    rowNode.classList.add('row');

    const key = edit.pattern.order[j];
    const subpattern = edit.pattern[key];
    const subdata = element[key];

    if (subpattern.skip === false) {
        const divLabel = doc.createElement('div');
        divLabel.classList.add('label');
        divLabel.innerText = subpattern.text;
        rowNode.appendChild(divLabel);

        // NON-EDITABLE
        if (['number', 'string'].includes(subpattern.type)) {
            edit.addStringNode(rowNode, subdata, key);
        } else if (['color'].includes(subpattern.type)) {
            edit.addColorNode(rowNode, subdata, key);
        } else if (['boolean'].includes(subpattern.type)) {
            // Not Needed Yet
        }

        divNode.appendChild(rowNode);
    }            
};

edit.addDivNodeEditor = (i, divNode) => {
    if (i === -1) {
        divNode.classList.add('element-addition', 'hidden');
        edit.addEditorNode(divNode, true, true, true);
    } else {
        const first = (i === 0);
        const last = (i === (edit.data.length - 1));

        divNode.classList.add('element');
        edit.addEditorNode(divNode, first, last);    
    }
};

edit.addDivNodeElements = (element, divNode) => {
    for (let j = 0, j_len = edit.pattern.order.length; j < j_len; j++) {
        edit.addElement({ element, j, divNode });
    }
};

edit.addDivNode = ({ element, content, i }, doc = document) => {
    const divNode = doc.createElement('div');
    divNode.setAttribute('data-index', i);
    divNode.onclick = edit.handleRowSelection;

    edit.addDivNodeEditor(i, divNode);

    if (edit.previewFn !== null) {
        const previewHTML = edit.previewFn(element);
        divNode.appendChild(previewHTML);
    }

    edit.addDivNodeElements(element, divNode);
    content.appendChild(divNode);
};

edit.generateAdditionData = () => {
    let result = {};
    for (const key in edit.pattern) {
        if (key !== 'order') {
            result[key] = edit.pattern[key].default;
        }
    }
    return result;
};

edit.showList = (doc = document) => {
    const content = doc.querySelector('.content');
    content.innerHTML = '';

    const addData = edit.generateAdditionData();
    edit.addDivNode({ element: addData, content, i: -1 });

    for (let i = 0, i_len = edit.data.length; i < i_len; i++) {
        edit.addDivNode({ element: edit.data[i], content, i });
    }
};

edit.saveAllViaCSV = (doc = document) => {
    const textarea = doc.querySelector('.csv-input');
    const inputData = textarea.value.replace(/\n/g, '').split(',');
    
    const newStructure = [];
    for (let i = 0, len = inputData.length; i < len; i++) {
        const adjustedValue = inputData[i].trim();
        let structure = {};
        for (const property in edit.pattern) {
            if (property !== 'order') {
                if (property === 'name') {
                    structure.name = adjustedValue;
                } else {
                    structure[property] = edit.pattern[property].default;
                }
            }
        }
        newStructure.push(structure);
    }
    
    edit.data = newStructure;
    edit.saveFn(edit.data);
    edit.showCSV();
};

edit.assembleCSV = () => {
    let value = '';
    for (let i = 0, i_len = edit.data.length; i < i_len; i++) {
        if (i !== 0) {
            value += ",\n";
        }
        value += edit.data[i].name;
    }
    return value;
};

edit.showCSV = (doc = document) => {
    const content = doc.querySelector('.content');
    content.innerHTML = '';

    const value = edit.assembleCSV();

    const inputDiv = doc.createElement('div');
    const inputField = doc.createElement('textarea');
    inputField.classList.add('csv-input');
    inputField.setAttribute('rows', edit.data.length + 2);
    inputField.setAttribute('cols', '40');
    inputField.value = value;
    inputDiv.appendChild(inputField);
    content.appendChild(inputDiv);

    const saveDiv = doc.createElement('div');
    const saveButton = doc.createElement('img');
    saveButton.classList.add('csv-save-button');
    saveButton.src = 'images/save.png';
    saveButton.title = 'Save All Changes';
    saveButton.onclick = edit.saveAllViaCSV;
    saveDiv.appendChild(saveButton);
    content.appendChild(saveDiv);
};

// For Unit Testing
if (typeof module !== 'undefined' && module.hasOwnProperty('exports')) {
    module.exports = edit;
}