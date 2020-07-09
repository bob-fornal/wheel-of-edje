
const defaultColorPattern = {
    color: '#bee767',
    fcolor: '#ffffff'
};

const panelPattern = {
    order: ['text', 'additionalText', 'color', 'fcolor', 'data', 'enabled'],
    data: { skip: false, text: 'Weight', type: 'number', default: 10 },
    text: { skip: false, text: 'Title', type: 'string', default: '' },
    additionalText: { skip: false, text: 'Sub Title', type: 'string', default: '' },
    color: { skip: false, text: 'Background Color', type: 'color', default: defaultColorPattern.color },
    fcolor: { skip: false, text: 'Foreground Color', type: 'color', default: defaultColorPattern.fcolor },
    enabled: { skip: true, text: 'Enabled', type: 'boolean', default: true }
};

const groupPattern = {
    order: ['person'],
    person: { skip: false, text: 'Name', type: 'string', default: '' },
    prize: { skip: true, text: 'Prize', type: 'string', default: null },
    additional: { skip: true, text: 'Additional', type: 'string', default: null },
    enabled: { skip: true, text: 'Enabled', type: 'boolean', default: true }
};

const params = new URLSearchParams(location.search);
const type = params.get('type');

const title = document.querySelector('.title .specific');
const add = document.querySelector('.tooling .addition-button .add-type');
const del = document.querySelector('.tooling .delete-all-button .delete-type');
const previewState = document.querySelector('.tooling .preview-available .right');
const enterToSaveState = document.querySelector('.tooling .enter-to-save .right');
const editAsState = document.querySelector('.tooling .edit-as-type');
const editAsLIST = document.querySelector('.tooling .edit-as-type .left');
const editAsCSV = document.querySelector('.tooling .edit-as-type .right');

let data = null;
let pattern = null;
let selected = null;
let preview = false;
let previewFn = null;
let enterToSave = false;
let saveFn = null;
let editAsOption = false
let editAsType = 'LIST';

    const previewPanel = (dataPoint) => {
        const completeMarker = document.createElement('div');
        completeMarker.classList.add('panel-text');
        const marker = document.createElement('div');
        marker.classList.add('panel-main-text');
        marker.innerText = dataPoint.text;
        completeMarker.appendChild(marker);

        additionalMarker = document.createElement('div');
        additionalMarker.classList.add('panel-additional-text');
        additionalMarker.innerText = generateAdditionalValueString(dataPoint.additionalText);
        completeMarker.appendChild(additionalMarker);

        const panel = document.createElement('div');
        panel.classList.add('panel-preview');
        panel.style.backgroundColor = dataPoint.color;
        panel.style.color = dataPoint.fcolor;
        panel.appendChild(completeMarker);

        return panel;
    };

switch (type) {
    case 'group':
        pattern = groupPattern;
        data = storage.getGroup();
        preview = false;
        previewFn = null;
        enterToSave = true;
        saveFn = storage.saveGroup;
        editAsOption = true;

        title.innerText = 'Group Individuals';
        add.innerText = 'INDIVIDUAL';
        del.innerText = 'GROUP'
        break;
    case 'panels':
        pattern = panelPattern;
        data = storage.getPie();
        preview = true;
        previewFn = previewPanel;
        enterToSave = false;
        saveFn = storage.savePie;
        editAsOption = false;

        title.innerText = 'Panels';
        add.innerText = 'PANEL';
        del.innerText = 'PANELS';
        break;
}
previewState.innerText = preview.toString().toUpperCase();
enterToSaveState.innerText = enterToSave.toString().toUpperCase();
if (editAsOption === true) {
    editAsState.classList.remove('hidden');
    editAsLIST.classList.add('selected');
    editAsCSV.classList.remove('selected');
    editAsType = 'LIST';
} else {
    editAsState.classList.add('hidden');
}

const back = () => {
    window.location.href = 'index.html';
};

    const selectEditAsType = (type = 'LIST') => {
        editAsType = type;

        const add = document.querySelector('.tooling .addition-button');
        const del = document.querySelector('.tooling .delete-all-button');        

        if (type === 'LIST') {
            editAsLIST.classList.add('selected');
            editAsCSV.classList.remove('selected');
            add.classList.remove('hidden');
            del.classList.remove('hidden');
            showList(); 
        } else if (type === 'CSV') {
            editAsLIST.classList.remove('selected');
            editAsCSV.classList.add('selected');
            add.classList.add('hidden');
            del.classList.add('hidden');
            showCSV(); 
        }

        storage.saveEditAsType(type);
    };

    const accessAdditionForm = () => {};

        const generateAdditionalValueString = (value) => (value === '') ? '' : `(${ value })`;

        let skipHandleRowSelection = false;

    const handleRowSelection = (event) => {
        if (skipHandleRowSelection === true) {
            skipHandleRowSelection = false;
            return;
        };
        if (event.target.nodeName !== 'DIV') return;

        if (selected !== null) {
            const editorNode = document.querySelector('.element.selected .editor-node');
            editorNode.classList.add('hidden');

            selected.target.classList.remove('selected');
            
            if (preview) {
                const value = selected.data.text;
                const additionalValue = selected.data.additionalText;
                changePreviewPanelText({
                    value, target: selected.target.querySelector('.panel-main-text')
                });
                changePreviewPanelText({
                    value: generateAdditionalValueString(additionalValue),
                    target: selected.target.querySelector('.panel-additional-text')
                });

                let style = {
                    color: selected.data.color,
                    fcolor: selected.data.fcolor
                };
                changePreviewPanelColor({
                    value: style,
                    target: selected.target.querySelector('.panel-preview')
                });
            }
        };

        const target = event.currentTarget;
        handleSimpleSelection(target);
    };

        const handleSimpleSelection = (target) => {
            const targetData = target.getAttribute('data-index');
            target.classList.add('selected');
            const index = Number(targetData);
    
            const editorNode = target.querySelector('.editor-node');
            editorNode.classList.remove('hidden');
    
            selected = {
                index: index,
                data: data[index],
                target: target
            };    
        };

    const handleDeleteAll = () => {
        data = [];
        selected = null;

        showList();
        saveFn(data);
    };

    const handleMoveUp = (event) => {
        event.stopPropagation();
        if (selected.index === 0) return;

        const hold1 = Object.assign({}, selected.data);
        const hold2 = Object.assign({}, data[selected.index - 1]);

        data[selected.index] = hold2;
        data[selected.index - 1] = hold1;
        selected = null;

        showList();
        saveFn(data);
    };

    const handleMoveDown = (event) => {
        event.stopPropagation();
        if (selected.index === (data.length - 1)) return;

        const hold1 = Object.assign({}, selected.data);
        const hold2 = Object.assign({}, data[selected.index + 1]);

        data[selected.index] = hold2;
        data[selected.index + 1] = hold1;
        selected = null;

        showList();
        saveFn(data);
    };

    const handleDeleteSelection = (event) => {
        event.stopPropagation();

        data.splice(selected.index, 1);
        selected = null;

        showList();
        saveFn(data);
    };

    const handleSaveNew = (event) => {
        event.stopPropagation();

        const target = document.querySelector('.element-addition');
        let result = {};

        const strings = target.querySelectorAll('[datatype=string-edit]');
        strings.forEach(string => {
            const key = string.getAttribute('data-key');
            const type = pattern[key].type;
            const value = (type === 'string') ? string.value : Number(string.value);

            result[key] = value;
        });

        const colors = target.querySelectorAll('[datatype=color-edit]');
        colors.forEach(color => {
            const key = color.getAttribute('data-key');
            const value = color.value;

            result[key] = value;
        });

        for (let key in pattern) {
            if (key !== 'order' && pattern[key].skip === true) {
                result[key] = pattern[key].default;
            }
        }

        data.unshift(result);

        showList();
        saveFn(data);
    };

    const handleSaveSelection = (event) => {
        event.stopPropagation();

        const editorNode = selected.target.querySelector('.editor-node');
        editorNode.classList.add('hidden');

        const strings = selected.target.querySelectorAll('[datatype=string-edit]');
        strings.forEach(string => {
            const key = string.getAttribute('data-key');
            const type = pattern[key].type;
            const value = (type === 'string') ? string.value : Number(string.value);

            selected.data[key] = value;
        });

        const colors = selected.target.querySelectorAll('[datatype=color-edit]');
        colors.forEach(color => {
            const key = color.getAttribute('data-key');
            const value = color.value;

            selected.data[key] = value;
        });

        selected.target.classList.remove('selected');
        selected = null;

        showList();
        saveFn(data);
    };

    const handleNextSelection = (currentIndex) => {
        const nextIndex = ((currentIndex + 1) > (data.length - 1)) ? 0 : currentIndex + 1;
        const target = document.querySelector(`[data-index="${ nextIndex }"]`);

        handleSimpleSelection(target);
        setTimeout(() => {
            const inputTarget = target.querySelector('[datatype="string-edit"]');
            inputTarget.focus();
        }, 20);
    };

        const changePreviewPanelColor = ({ value, target }) => {
            if (preview === true) {
                target.setAttribute('style', `background-color: ${ value.color }; color: ${ value.fcolor }`);
            }
        };

        const getSelector = (event) => {
            let selector = '';
            const additionNode = document.querySelector('.element-addition');
            if (additionNode.contains(event.target)) {
                selector = '.element-addition';
            } else {
                selector = '.element.selected';
            }
            return selector;
        };

    const handleColorChange = (event) => {
        event.stopPropagation();
        skipHandleRowSelection = true;

        const selector = getSelector(event);

        const key = event.target.getAttribute('data-key');
        const data = event.target.value;

        let style = (selector === '.element.selected') ? {
            color: selected.data.color,
            fcolor: selected.data.fcolor
        } : {
            color: defaultColorPattern.color,
            fcolor: defaultColorPattern.fcolor
        };
        if (key === 'color') {
            style.color = data;
        } else if (key === 'fcolor') {
            style.fcolor = data;
        }
        changePreviewPanelColor({ value: style, target: document.querySelector(`${ selector } .panel-preview`) });
    };

        const changePreviewPanelText = ({ value, target }) => {
            if (preview === true) {
                target.innerText = value;
            }
        };

    const handleStringKeyup = (event) => {
        let selector = getSelector(event);

        if (enterToSave === true && event.key === 'Enter') {
            const index = selected.index;
            handleSaveSelection(event);
            handleNextSelection(index);
            return;
        }

        const value = event.target.value;
        const key = event.target.getAttribute('data-key');
        if (key === 'text') {
            changePreviewPanelText({
                value, target: document.querySelector(`${ selector } .panel-main-text`)
            });
        } else if (key === 'additionalText') {
            changePreviewPanelText({
                value: generateAdditionalValueString(value),
                target: document.querySelector(`${ selector } .panel-additional-text`)
            });
        }
    }

    const handleAddition = (event) => {
        const addition = document.querySelector('.element-addition');
        addition.classList.remove('hidden');
    };

        const addEditorNode = (div, first = false, last = false, add = false) => {
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
            upNode.onclick = handleMoveUp;
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
            downNode.onclick = handleMoveDown;
            downNode.title = 'Move Down';
            editorNode.appendChild(downNode);

            const saveNode = document.createElement('img');
            saveNode.classList.add('editor-icon', 'save');
            saveNode.src = 'images/save.png';
            if (add === true) {
                saveNode.onclick = handleSaveNew;
                saveNode.title = 'Save New Row';
            } else {
                saveNode.onclick = handleSaveSelection;
                saveNode.title = 'Save Row Changes';
            }
            editorNode.appendChild(saveNode);
    
            const deleteNode = document.createElement('img');
            deleteNode.classList.add('editor-icon', 'delete');
            if (add === true) {
                deleteNode.src = 'images/trash-disabled.png';
            } else {
                deleteNode.src = 'images/trash.png';
                deleteNode.onclick = handleDeleteSelection;
            }
            deleteNode.title = 'Delete Row';
            editorNode.appendChild(deleteNode);
        
            div.appendChild(editorNode);    
        };

        const addStringNode = (div, subdata, key) => {
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
            inputContent.onkeyup = handleStringKeyup;
            div.appendChild(inputContent);
        };

        const addColorNode = (div, subdata, key) => {
            const divContent = document.createElement('div');
            divContent.classList.add('element-content');
            divContent.setAttribute('datatype', 'color-view');
            divContent.setAttribute('style', `background-color: ${ subdata };`);
            div.appendChild(divContent);

            const inputContent = document.createElement('input');
            inputContent.type = 'color'
            inputContent.value = subdata;
            inputContent.setAttribute('datatype', 'color-edit');
            inputContent.onchange = handleColorChange;
            inputContent.setAttribute('data-key', key);
            div.appendChild(inputContent);
        };

        const addElement = ({ element, j, divNode  }) => {
            const rowNode = document.createElement('div');
            rowNode.classList.add('row');

            const key = pattern.order[j];
            const subpattern = pattern[key];
            const subdata = element[key];

            if (subpattern.skip === false) {
                const divLabel = document.createElement('div');
                divLabel.classList.add('label');
                divLabel.innerText = subpattern.text;
                rowNode.appendChild(divLabel);

                // NON-EDITABLE
                if (['number', 'string'].includes(subpattern.type)) {
                    addStringNode(rowNode, subdata, key);
                } else if (['color'].includes(subpattern.type)) {
                    addColorNode(rowNode, subdata, key);
                } else if (['boolean'].includes(subpattern.type)) {
                    // Not Needed Yet
                }

                divNode.appendChild(rowNode);
            }            
        };

        const addDivNode = ({ element, content, i }) => {
            const divNode = document.createElement('div');
            divNode.setAttribute('data-index', i);
            divNode.onclick = handleRowSelection;

            if (i === -1) {
                divNode.classList.add('element-addition', 'hidden');
                addEditorNode(divNode, true, true, true);
            } else {
                divNode.classList.add('element');

                const first = (i === 0);
                const last = (i === (data.length - 1));
                addEditorNode(divNode, first, last);    
            }

            if (previewFn !== null) {
                const previewHTML = previewFn(element);
                divNode.appendChild(previewHTML);
            }

            for (let j = 0, j_len = pattern.order.length; j < j_len; j++) {
                addElement({ element, j, divNode });
            }
            content.appendChild(divNode);
        };

        const generateAdditionData = () => {
            let result = {};
            for (const key in pattern) {
                if (key !== 'order') {
                    result[key] = pattern[key].default;
                }
            }
            return result;
        };

    const showList = () => {
        const content = document.querySelector('.content');
        content.innerHTML = '';

        const addData = generateAdditionData();
        addDivNode({ element: addData, content, i: -1 });

        for (let i = 0, i_len = data.length; i < i_len; i++) {
            addDivNode({ element: data[i], content, i });
        }
    };

        const saveAllViaCSV = () => {
            const textarea = document.querySelector('.csv-input');
            const inputData = textarea.value.replace(/\n/g, '').split(',');
            
            const newStructure = [];
            for (let i = 0, len = inputData.length; i < len; i++) {
                const adjustedValue = inputData[i].trim();
                let structure = {};
                for (const property in pattern) {
                    if (property !== 'order') {
                        if (property === 'person') {
                            structure['person'] = adjustedValue;
                        } else {
                            structure[property] = pattern[property].default;
                        }
                    }
                }
                newStructure.push(structure);
            }
            
            data = newStructure;
            saveFn(data);
            showCSV();
        };

    const showCSV = () => {
        const content = document.querySelector('.content');
        content.innerHTML = '';

        let value = '';
        for (let i = 0, i_len = data.length; i < i_len; i++) {
            if (i !== 0) {
                value += ",\n";
            }
            value += data[i].person;
        }

        const inputDiv = document.createElement('div');
        const inputField = document.createElement('textarea');
        inputField.classList.add('csv-input');
        inputField.setAttribute('rows', data.length + 2);
        inputField.setAttribute('cols', '40');
        inputField.value = value;
        inputDiv.appendChild(inputField);
        content.appendChild(inputDiv);

        const saveDiv = document.createElement('div');
        const saveButton = document.createElement('img');
        saveButton.classList.add('csv-save-button');
        saveButton.src = 'images/save.png';
        saveButton.title = "Save All Changes";
        saveButton.onclick = saveAllViaCSV;
        saveDiv.appendChild(saveButton);
        content.appendChild(saveDiv);
    }

const init = async () => {
    if (editAsOption === true) {
        editAsType = await storage.getEditAsType();
        selectEditAsType(editAsType);
    }

    if (editAsType === 'LIST') {
        showList();
    } else {
        showCSV();
    }
};

init();
