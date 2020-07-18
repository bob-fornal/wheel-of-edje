
const edit = {
    defaultColorPattern: {
        color: '#bee767',
        fcolor: '#ffffff'
    },

    title: document.querySelector('.title .specific'),
    add: document.querySelector('.tooling .addition-button .add-type'),
    del: document.querySelector('.tooling .delete-all-button .delete-type'),
    previewState: document.querySelector('.tooling .preview-available .right'),
    enterToSaveState: document.querySelector('.tooling .enter-to-save .right'),
    editAsState: document.querySelector('.tooling .edit-as-type'),
    editAsLIST: document.querySelector('.tooling .edit-as-type .left'),
    editAsCSV: document.querySelector('.tooling .edit-as-type .right'),

    data: null,
    pattern: null,
    selected: null,
    preview: false,
    previewFn: null,
    enterToSave: false,
    saveFn: null,
    editAsOption: false,
    editAsType: 'LIST',

    generateAdditionalValueString: (value) => (value === '') ? '' : `(${ value })`,
    skipHandleRowSelection: false
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

edit.params = new URLSearchParams(location.search);
edit.type = edit.params.get('type');

    edit.previewPanel = (dataPoint) => {
        const completeMarker = document.createElement('div');
        completeMarker.classList.add('panel-text');
        const marker = document.createElement('div');
        marker.classList.add('panel-main-text');
        marker.innerText = dataPoint.text;
        completeMarker.appendChild(marker);

        additionalMarker = document.createElement('div');
        additionalMarker.classList.add('panel-additional-text');
        additionalMarker.innerText = edit.generateAdditionalValueString(dataPoint.additionalText);
        completeMarker.appendChild(additionalMarker);

        const panel = document.createElement('div');
        panel.classList.add('panel-preview');
        panel.style.backgroundColor = dataPoint.color;
        panel.style.color = dataPoint.fcolor;
        panel.appendChild(completeMarker);

        return panel;
    };

edit.configuration = () => {
    switch (edit.type) {
        case 'group':
            edit.pattern = edit.groupPattern;
            edit.data = storage.getGroup();
            edit.preview = false;
            edit.previewFn = null;
            edit.enterToSave = true;
            edit.saveFn = storage.saveGroup;
            edit.editAsOption = true;
    
            edit.title.innerText = 'Group Individuals';
            edit.add.innerText = 'INDIVIDUAL';
            edit.del.innerText = 'GROUP'
            break;
        case 'panels':
            edit.pattern = edit.panelPattern;
            edit.data = storage.getPie();
            edit.preview = true;
            edit.previewFn = edit.previewPanel;
            edit.enterToSave = false;
            edit.saveFn = storage.savePie;
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

edit.back = () => {
    window.location.href = 'index.html';
};

edit.selectEditAsType = (type = 'LIST') => {
    edit.editAsType = type;

    const addTooling = document.querySelector('.tooling .addition-button');
    const delTooling = document.querySelector('.tooling .delete-all-button');        

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

    storage.saveEditAsType(type);
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

edit.handleRowSelection = (event) => {
    if (edit.skipHandleRowSelection === true) {
        edit.skipHandleRowSelection = false;
        return;
    };
    if (event.target.nodeName !== 'DIV') return;

    if (edit.selected !== null) {
        const editorNode = document.querySelector('.element.selected .editor-node');
        editorNode.classList.add('hidden');

        edit.selected.target.classList.remove('selected');
        
        if (edit.preview === true) {
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
        }
    };

    const target = event.currentTarget;
    edit.handleSimpleSelection(target);
};

edit.handleDeleteAll = () => {
    edit.data = [];
    edit.selected = null;

    edit.showList();
    edit.saveFn(edit.data);
};

edit.handleMoveUp = (event) => {
    event.stopPropagation();
    if (edit.selected.index === 0) return;

    const hold1 = Object.assign({}, edit.selected.data);
    const hold2 = Object.assign({}, edit.data[edit.selected.index - 1]);

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

edit.handleSaveNew = (event) => {
    event.stopPropagation();

    const target = document.querySelector('.element-addition');
    let result = {};

    const strings = target.querySelectorAll('[datatype=string-edit]');
    strings.forEach(string => {
        const key = string.getAttribute('data-key');
        const type = edit.pattern[key].type;
        const value = (type === 'string') ? string.value : Number(string.value);

        result[key] = value;
    });

    const colors = target.querySelectorAll('[datatype=color-edit]');
    colors.forEach(color => {
        const key = color.getAttribute('data-key');
        const value = color.value;

        result[key] = value;
    });

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
    event.stopPropagation();

    const editorNode = edit.selected.target.querySelector('.editor-node');
    editorNode.classList.add('hidden');

    const strings = edit.selected.target.querySelectorAll('[datatype=string-edit]');
    strings.forEach(string => {
        const key = string.getAttribute('data-key');
        const type = edit.pattern[key].type;
        const value = (type === 'string') ? string.value : Number(string.value);

        edit.selected.data[key] = value;
    });

    const colors = edit.selected.target.querySelectorAll('[datatype=color-edit]');
    colors.forEach(color => {
        const key = color.getAttribute('data-key');
        const value = color.value;

        edit.selected.data[key] = value;
    });

    edit.selected.target.classList.remove('selected');
    edit.selected = null;

    edit.showList();
    edit.saveFn(edit.data);
};

edit.handleNextSelection = (currentIndex) => {
    const nextIndex = ((currentIndex + 1) > (edit.data.length - 1)) ? 0 : currentIndex + 1;
    const target = document.querySelector(`[data-index="${ nextIndex }"]`);

    edit.handleSimpleSelection(target);
    setTimeout(() => {
        const inputTarget = target.querySelector('[datatype="string-edit"]');
        inputTarget.focus();
    }, 20);
};

    edit.changePreviewPanelColor = ({ value, target }) => {
        if (edit.preview === true) {
            target.setAttribute('style', `background-color: ${ value.color }; color: ${ value.fcolor }`);
        }
    };

    edit.getSelector = (event) => {
        let selector = '';
        const additionNode = document.querySelector('.element-addition');
        if (additionNode.contains(event.target)) {
            selector = '.element-addition';
        } else {
            selector = '.element.selected';
        }
        return selector;
    };

edit.handleColorChange = (event) => {
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
    edit.changePreviewPanelColor({ value: style, target: document.querySelector(`${ selector } .panel-preview`) });
};

    edit.changePreviewPanelText = ({ value, target }) => {
        if (edit.preview === true) {
            target.innerText = value;
        }
    };

edit.handleStringKeyup = (event) => {
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
            value, target: document.querySelector(`${ selector } .panel-main-text`)
        });
    } else if (key === 'additionalText') {
        edit.changePreviewPanelText({
            value: edit.generateAdditionalValueString(value),
            target: document.querySelector(`${ selector } .panel-additional-text`)
        });
    }
}

edit.handleAddition = (event) => {
    const addition = document.querySelector('.element-addition');
    addition.classList.remove('hidden');
};

edit.addEditorNode = (div, first = false, last = false, add = false) => {
    const editorNode = document.createElement('div');
    if (add === true) {
        editorNode.classList.add('editor-node');
    } else {
        editorNode.classList.add('editor-node', 'hidden');
    }

    const upNode = document.createElement('img');
    upNode.classList.add('editor-icon', 'up');
    if (first === true) {
        upNode.classList.add('disabled');
        upNode.src = 'images/up-disabled.png';
    } else {
        upNode.src = 'images/up.png';
    }
    upNode.onclick = edit.handleMoveUp;
    upNode.title = 'Move Up';
    editorNode.appendChild(upNode);

    const downNode = document.createElement('img');
    downNode.classList.add('editor-icon', 'down');
    if (last === true) {
        downNode.classList.add('disabled');
        downNode.src = 'images/down-disabled.png';
    } else {
        downNode.src = 'images/down.png';
    }
    downNode.onclick = edit.handleMoveDown;
    downNode.title = 'Move Down';
    editorNode.appendChild(downNode);

    const saveNode = document.createElement('img');
    saveNode.classList.add('editor-icon', 'save');
    saveNode.src = 'images/save.png';
    if (add === true) {
        saveNode.onclick = edit.handleSaveNew;
        saveNode.title = 'Save New Row';
    } else {
        saveNode.onclick = edit.handleSaveSelection;
        saveNode.title = 'Save Row Changes';
    }
    editorNode.appendChild(saveNode);

    const deleteNode = document.createElement('img');
    deleteNode.classList.add('editor-icon', 'delete');
    if (add === true) {
        deleteNode.src = 'images/trash-disabled.png';
    } else {
        deleteNode.src = 'images/trash.png';
        deleteNode.onclick = edit.handleDeleteSelection;
    }
    deleteNode.title = 'Delete Row';
    editorNode.appendChild(deleteNode);

    div.appendChild(editorNode);    
};

edit.addStringNode = (div, subdata, key) => {
    const divContent = document.createElement('div');
    divContent.classList.add('element-content');
    divContent.setAttribute('datatype', 'string-view');
    divContent.innerText = subdata;
    div.appendChild(divContent);
    
    const inputContent = document.createElement('input');
    inputContent.type = 'text';
    inputContent.value = subdata;
    inputContent.setAttribute('datatype', 'string-edit');
    inputContent.setAttribute('data-key', key);
    inputContent.onkeyup = edit.handleStringKeyup;
    div.appendChild(inputContent);
};

edit.addColorNode = (div, subdata, key) => {
    const divContent = document.createElement('div');
    divContent.classList.add('element-content');
    divContent.setAttribute('datatype', 'color-view');
    divContent.setAttribute('style', `background-color: ${ subdata };`);
    div.appendChild(divContent);

    const inputContent = document.createElement('input');
    inputContent.type = 'color'
    inputContent.value = subdata;
    inputContent.setAttribute('datatype', 'color-edit');
    inputContent.onchange = edit.handleColorChange;
    inputContent.setAttribute('data-key', key);
    div.appendChild(inputContent);
};

edit.addElement = ({ element, j, divNode  }) => {
    const rowNode = document.createElement('div');
    rowNode.classList.add('row');

    const key = edit.pattern.order[j];
    const subpattern = edit.pattern[key];
    const subdata = element[key];

    if (subpattern.skip === false) {
        const divLabel = document.createElement('div');
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

edit.addDivNode = ({ element, content, i }) => {
    const divNode = document.createElement('div');
    divNode.setAttribute('data-index', i);
    divNode.onclick = edit.handleRowSelection;

    if (i === -1) {
        divNode.classList.add('element-addition', 'hidden');
        edit.addEditorNode(divNode, true, true, true);
    } else {
        divNode.classList.add('element');

        const first = (i === 0);
        const last = (i === (edit.data.length - 1));
        edit.addEditorNode(divNode, first, last);    
    }

    if (edit.previewFn !== null) {
        const previewHTML = edit.previewFn(element);
        divNode.appendChild(previewHTML);
    }

    for (let j = 0, j_len = edit.pattern.order.length; j < j_len; j++) {
        edit.addElement({ element, j, divNode });
    }
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

edit.showList = () => {
    const content = document.querySelector('.content');
    content.innerHTML = '';

    const addData = edit.generateAdditionData();
    edit.addDivNode({ element: addData, content, i: -1 });

    for (let i = 0, i_len = edit.data.length; i < i_len; i++) {
        edit.addDivNode({ element: edit.data[i], content, i });
    }
};

edit.saveAllViaCSV = () => {
    const textarea = document.querySelector('.csv-input');
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

edit.showCSV = () => {
    const content = document.querySelector('.content');
    content.innerHTML = '';

    let value = '';
    for (let i = 0, i_len = edit.data.length; i < i_len; i++) {
        if (i !== 0) {
            value += ",\n";
        }
        value += edit.data[i].name;
    }

    const inputDiv = document.createElement('div');
    const inputField = document.createElement('textarea');
    inputField.classList.add('csv-input');
    inputField.setAttribute('rows', edit.data.length + 2);
    inputField.setAttribute('cols', '40');
    inputField.value = value;
    inputDiv.appendChild(inputField);
    content.appendChild(inputDiv);

    const saveDiv = document.createElement('div');
    const saveButton = document.createElement('img');
    saveButton.classList.add('csv-save-button');
    saveButton.src = 'images/save.png';
    saveButton.title = "Save All Changes";
    saveButton.onclick = edit.saveAllViaCSV;
    saveDiv.appendChild(saveButton);
    content.appendChild(saveDiv);
};

edit.init = async () => {
    edit.configuration();

    if (edit.editAsOption === true) {
        edit.editAsType = await storage.getEditAsType();
        edit.selectEditAsType(edit.editAsType);
    }

    if (edit.editAsType === 'LIST') {
        edit.showList();
    } else {
        edit.showCSV();
    }
};

