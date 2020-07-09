
const panelPattern = {
    order: ['text', 'additionalText', 'color', 'fcolor', 'data', 'enabled'],
    data: { skip: false, text: 'Weight', type: 'number', default: 10 },
    text: { skip: false, text: 'Title', type: 'string', default: '' },
    additionalText: { skip: false, text: 'Sub Title', type: 'string', default: '' },
    color: { skip: false, text: 'Background Color', type: 'color', default: '#bee767' },
    fcolor: { skip: false, text: 'Foreground Color', type: 'color', default: '#ffffff' },
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
const add = document.querySelector('.tooling .add-type');
const del = document.querySelector('.tooling .delete-all-button .delete-type');
const previewState = document.querySelector('.tooling .preview-available .right');

let data = null;
let pattern = null;
let selected = null;
let preview = false;
let previewFn = null;
let saveFn = null;

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
        saveFn = storage.saveGroup;

        title.innerText = 'Group Individuals';
        add.innerText = 'INDIVIDUAL';
        del.innerText = 'GROUP'
        break;
    case 'panels':
        pattern = panelPattern;
        data = storage.getPie();
        preview = true;
        previewFn = previewPanel;
        saveFn = storage.savePie;

        title.innerText = 'Panels';
        add.innerText = 'PANEL';
        del.innerText = 'PANELS';
        break;
}
previewState.innerText = preview.toString().toUpperCase();


const back = () => {
    window.location.href = 'index.html';
};

    const createAdditionForm = () => {};

        const generateAdditionalValueString = (value) => (value === '') ? '' : `(${ value })`;

    const handleRowSelection = (event) => {
       if (event.target.nodeName !== 'DIV') return;

        if (selected !== null) {
            const editorNode = document.querySelector('.element.selected .editor-node');
            editorNode.classList.add('hidden');

            selected.target.classList.remove('selected');
            
            if (preview) {
                const value = selected.data.text;
                const additionalValue = selected.data.additionalText;
                changePreviewPanel({
                    value, target: selected.target.querySelector('.panel-main-text')
                });
                changePreviewPanel({
                    value: generateAdditionalValueString(value),
                    target: selected.target.querySelector('.panel-additional-text')
                });
            }
        };

        const target = event.currentTarget;
        const targetData = target.getAttribute('data');
        target.classList.add('selected');
        const connection = JSON.parse(targetData);

        const editorNode = target.querySelector('.editor-node');
        editorNode.classList.remove('hidden');

        selected = {
            data: data[connection.i],
            target: target
        };
    };

    const handleSaveSelection = (event) => {
        event.stopPropagation();

        const editorNode = selected.target.querySelector('.editor-node');
        editorNode.classList.add('hidden');

        const strings = selected.target.querySelectorAll('[type=string-edit');
        strings.forEach(string => {
            const key = string.getAttribute('data-key');
            const type = pattern[key].type;
            const value = (type === 'string') ? string.value : Number(string.value);

            selected.data[key] = value;
        });
        console.log(data);

        selected.target.classList.remove('selected');
        selected = null;

        saveFn(data);
    };

    // const handleColorChange = (event) => {
    //     console.log({ target: event.target });
    //     console.log({ data: event.target.attributes.data, value: event.target.value });
    //     const target = JSON.parse(event.target.attributes.data);
    // };

        const changePreviewPanel = ({ value, target }) => {
            if (preview === true) {
                target.innerText = value;
            }
        };

    const handleStringKeyup = (event) => {
        const value = event.target.value;
        const key = event.target.getAttribute('data-key');
        if (key === 'text') {
            changePreviewPanel({
                value, target: document.querySelector('.element.selected .panel-main-text')
            });
        } else if (key === 'additionalText') {
            changePreviewPanel({
                value: generateAdditionalValueString(value),
                target: document.querySelector('.element.selected .panel-additional-text')
            });
        }
    }

        const addEditorNode = (div) => {
            const editorNode = document.createElement('div');
            editorNode.classList.add('editor-node', 'hidden');
    
            const upNode = document.createElement('img');
            upNode.classList.add('editor-icon', 'up');
            upNode.src = 'images/up.png';
            upNode.title = 'Move Up';
            editorNode.appendChild(upNode);
    
            const downNode = document.createElement('img');
            downNode.classList.add('editor-icon', 'down');
            downNode.src = 'images/down.png';
            downNode.title = 'Move Down';
            editorNode.appendChild(downNode);

            const saveNode = document.createElement('img');
            saveNode.classList.add('editor-icon', 'save');
            saveNode.src = 'images/save.png';
            saveNode.onclick = handleSaveSelection;
            saveNode.title = 'Save Row Changes';
            editorNode.appendChild(saveNode);
    
            const deleteNode = document.createElement('img');
            deleteNode.classList.add('editor-icon', 'delete');
            deleteNode.src = 'images/trash.png';
            deleteNode.title = 'Delete Row';
            editorNode.appendChild(deleteNode);
        
            div.appendChild(editorNode);    
        };

    const showList = () => {
        const content = document.querySelector('.content');
        content.innerHTML = '';

        for (let i = 0, i_len = data.length; i < i_len; i++) {
            const divNode = document.createElement('div');
            divNode.classList.add('element');
            divNode.setAttribute('data', `{ "i": ${ i } }`);
            divNode.onclick = handleRowSelection;

            addEditorNode(divNode);
            if (previewFn !== null) {
                const previewHTML = previewFn(data[i]);
                divNode.appendChild(previewHTML);
            }

            const element = data[i];
            for (let j = 0, j_len = pattern.order.length; j < j_len; j++) {
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
                        const divContent = document.createElement('div');
                        divContent.classList.add('element-content');
                        divContent.setAttribute('type', 'string-view');
                        divContent.innerText = subdata;
                        rowNode.appendChild(divContent);
                        
                        const inputContent = document.createElement('input');
                        inputContent.type = 'text';
                        inputContent.value = subdata;
                        inputContent.setAttribute('type', 'string-edit');
                        inputContent.setAttribute('data-key', key);
                        inputContent.onkeyup = handleStringKeyup;
                        rowNode.appendChild(inputContent);

                    } else if (['color'].includes(subpattern.type)) {
                        const divContent = document.createElement('div');
                        divContent.classList.add('element-content', 'color-view');
                        divContent.setAttribute('type', 'color');
                        divContent.setAttribute('style', `background-color: ${ subdata };`)
                        // const divContent = document.createElement('input');
                        // divContent.classList.add('element-content');
                        // divContent.type = 'color'
                        // divContent.value = subdata;
                        // divContent.onchange = handleColorChange;
                        // divContent.setAttribute('data', `{ "i": ${ i }, "key": "${ key }" }`)
                        rowNode.appendChild(divContent);
                    } else if (['boolean'].includes(subpattern.type)) {

                    }

                    divNode.appendChild(rowNode);
                }
            }
            content.appendChild(divNode);
        }
    };

const init = () => {
    createAdditionForm();
    showList();
};

init();
console.log({ data, pattern });