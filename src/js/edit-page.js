
const panelPattern = {
    order: ['text', 'color', 'fcolor', 'data', 'enabled'],
    data: { skip: false, text: 'Weight', type: 'number', default: 10 },
    text: { skip: false, text: 'Title', type: 'string', default: 'Prize' },
    color: { skip: false, text: 'Background Color', type: 'color', default: '#bee767' },
    fcolor: { skip: false, text: 'Foreground Color', type: 'color', default: '#ffffff' },
    enabled: { skip: true, text: 'Enabled', type: 'boolean', default: true }
};

const groupPattern = {
    order: ['person', 'prize', 'enabled'],
    person: { skip: false, text: 'Name', type: 'string', default: '' },
    prize: { skip: true, text: 'Prize', type: 'string', default: null },
    enabled: { skip: true, text: 'Enabled', type: 'boolean', default: true }
};

const params = new URLSearchParams(location.search);
const type = params.get('type');

const title = document.querySelector('.title .specific');
const add = document.querySelector('.addition .add-type');

let data = null;
let pattern = null;
let selected = null;

switch (type) {
    case 'group':
        title.innerText = 'Group';
        add.innerText = 'GROUP';
        pattern = groupPattern;
        data = storage.getGroup();
        break;
    case 'panels':
        title.innerText = 'Panels';
        add.innerText = 'PANEL';
        pattern = panelPattern;
        data = storage.getPie();
        break;
}

const back = () => {
    window.location.href = 'index.html';
};

    const createAdditionForm = () => {};

    const handleRowSelection = (event) => {
        if (selected !== null) {
            const editorNode = document.querySelector('.element.selected .editor-node');
            editorNode.classList.add('hidden');

            selected.target.classList.remove('selected');
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

        console.log('saving');

        const editorNode = selected.target.querySelector('.editor-node');
        editorNode.classList.add('hidden');

        selected.target.classList.remove('selected');
        selected = null;
    };

    // const handleColorChange = (event) => {
    //     console.log({ target: event.target });
    //     console.log({ data: event.target.attributes.data, value: event.target.value });
    //     const target = JSON.parse(event.target.attributes.data);
    // };

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
                        divContent.classList.add('element-content', 'non-editable');
                        divContent.innerText = subdata;
                        rowNode.appendChild(divContent);    
                    } else if (['color'].includes(subpattern.type)) {
                        const divContent = document.createElement('div');
                        divContent.classList.add('element-content', 'non-editable', 'color-view');
                        divContent.setAttribute('style', `background-color: ${ subdata };`)
                        // const divContent = document.createElement('input');
                        // divContent.classList.add('element-content', 'non-editable');
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