
const edit = require('../public/js/edit-page');
const doc = require('./helpers/document.helper');
const store = require('./helpers/storage.helper');
const win = require('./helpers/window.helper');

describe('editing page', () => {
  let storage, document, window;

  beforeEach(() => {
    store.init();
    storage = store.mock;

    doc.init();
    document = doc.mock;

    win.init();
    window = win.mock;

    edit.reset();
  });

  it('expects edit to exist', () => {
    expect(edit).toBeDefined();

    expect(edit.defaultColorPattern.color).toEqual('#bee767');
    expect(edit.defaultColorPattern.fcolor).toEqual('#ffffff');

    expect(edit.data).toBeNull();
    expect(edit.pattern).toBeNull();
    expect(edit.selected).toBeNull();
    expect(edit.preview).toEqual(false);
    expect(edit.previewFn).toBeNull();
    expect(edit.enterToSave).toEqual(false);
    expect(edit.saveFn).toBeNull();
    expect(edit.editAsOption).toEqual(false);
    expect(edit.editAsType).toEqual('LIST');

    expect(edit.skipHandleRowSelection).toEqual(false);
  });

  it('expects edit to contain functions', () => {
    expect(edit.determineType).toEqual(jasmine.any(Function));
    expect(edit.init).toEqual(jasmine.any(Function));
    expect(edit.generateQueries).toEqual(jasmine.any(Function));
    expect(edit.generateAdditionalValueString).toEqual(jasmine.any(Function));

    expect(edit.panelPattern).toEqual(jasmine.any(Object));
    expect(edit.groupPattern).toEqual(jasmine.any(Object));

    expect(edit.previewPanel).toEqual(jasmine.any(Function));
    expect(edit.configuration).toEqual(jasmine.any(Function));
    expect(edit.back).toEqual(jasmine.any(Function));
    expect(edit.selectEditAsType).toEqual(jasmine.any(Function));
    expect(edit.handleSimpleSelection).toEqual(jasmine.any(Function));
    expect(edit.handleEditPreview).toEqual(jasmine.any(Function));
    expect(edit.handleRowSelection).toEqual(jasmine.any(Function));
    expect(edit.handleDeleteAll).toEqual(jasmine.any(Function));
    expect(edit.handleMoveUp).toEqual(jasmine.any(Function));
    expect(edit.handleMoveDown).toEqual(jasmine.any(Function));
    expect(edit.handleDeleteSelection).toEqual(jasmine.any(Function));
    expect(edit.handleSaveNew).toEqual(jasmine.any(Function));
    expect(edit.handleSaveSelection).toEqual(jasmine.any(Function));
    expect(edit.handleNextSelection).toEqual(jasmine.any(Function));
    expect(edit.changePreviewPanelColor).toEqual(jasmine.any(Function));
    expect(edit.getSelector).toEqual(jasmine.any(Function));
    expect(edit.handleColorChange).toEqual(jasmine.any(Function));
    expect(edit.changePreviewPanelText).toEqual(jasmine.any(Function));
    expect(edit.handleStringKeyup).toEqual(jasmine.any(Function));
    expect(edit.handleAddition).toEqual(jasmine.any(Function));
    expect(edit.addEditorNode).toEqual(jasmine.any(Function));
    expect(edit.addStringNode).toEqual(jasmine.any(Function));
    expect(edit.addColorNode).toEqual(jasmine.any(Function));
    expect(edit.addElement).toEqual(jasmine.any(Function));
    expect(edit.addDivNode).toEqual(jasmine.any(Function));
    expect(edit.generateAdditionData).toEqual(jasmine.any(Function));
    expect(edit.showList).toEqual(jasmine.any(Function));
    expect(edit.saveAllViaCSV).toEqual(jasmine.any(Function));
    expect(edit.showCSV).toEqual(jasmine.any(Function));
  });

  it('expects "determineType" to set type parameter', () => {
    window.returnFn = () => 'LIST';

    edit.determineType(window);
    expect(edit.type).toEqual('LIST');
  });

  it('expects "generateQueries" to setup all dom queries', () => {
    spyOn(document, 'querySelector').and.stub();

    edit.generateQueries(document);
    expect(document.querySelector).toHaveBeenCalledTimes(8);
  });

  it('expects "generateAdditionalValueString" to return an empty string', () => {
    const value = '';

    const result = edit.generateAdditionalValueString(value);
    expect(result).toEqual('');
  });

  it('expects "generateAdditionalValueString" to wrap a value in parens', () => {
    const value = 'VALUE';

    const result = edit.generateAdditionalValueString(value);
    expect(result).toEqual('(VALUE)');
  });

  it('expects "panelPattern" to contain array order that exist as keys', () => {
    const panel = edit.panelPattern;
    const order = panel.order;
    const keys = Object.keys(panel);

    let match = true;
    order.forEach(innerKey => {
      if (!keys.includes(innerKey)) {
        match = false;
      }
    });
    expect(match).toEqual(true);
  });

  it('expects "groupPattern" to contain array order that exist as keys', () => {
    const group = edit.groupPattern;
    const order = group.order;
    const keys = Object.keys(group);

    let match = true;
    order.forEach(innerKey => {
      if (!keys.includes(innerKey)) {
        match = false;
      }
    });
    expect(match).toEqual(true);
  });

  it('expects "panelPattern" items to contain certain elements', () => {
    const panel = edit.panelPattern;
    const order = panel.order;
    const contain = ['skip', 'text', 'type', 'default'];

    let match = true;
    order.forEach(key => {
      const item = panel[key];
      const itemKeys = Object.keys(item);
      contain.forEach(innerKey => {
        if (!itemKeys.includes(innerKey)) {
          match = false;
        }
      });
    });
  });

  it('expects "groupPattern" items to contain certain elements', () => {
    const group = edit.groupPattern;
    const order = group.order;
    const contain = ['skip', 'text', 'type', 'default'];

    let match = true;
    order.forEach(key => {
      const item = group[key];
      const itemKeys = Object.keys(item);
      contain.forEach(innerKey => {
        if (!itemKeys.includes(innerKey)) {
          match = false;
        }
      });
    });
  });

  it('expects "previewPanel" to take a data point and generate the preview', () => {
    const data = { text: 'text', additionalText: 'additional', color: 'color', fcolor: 'fcolor' };
    spyOn(edit, 'generateAdditionalValueString').and.returnValue('(additional)');

    edit.previewPanel(data, document);
    const completeMarker = document.getElement('UNDEFINED-0');
    const marker = document.getElement('UNDEFINED-1');
    const additionalMarker = document.getElement('UNDEFINED-2');
    const panel = document.getElement('UNDEFINED-3');
    expect(completeMarker.classList.list.includes('panel-text')).toEqual(true);
    expect(marker.classList.list.includes('panel-main-text')).toEqual(true);
    expect(marker.innerText).toEqual(data.text);
    expect(additionalMarker.classList.list.includes('panel-additional-text')).toEqual(true);
    expect(additionalMarker.innerText).toEqual('(additional)');
    expect(panel.classList.list.includes('panel-preview')).toEqual(true);
    expect(panel.style.backgroundColor).toEqual('color');
    expect(panel.style.color).toEqual('fcolor');
  });

  it('expects "configuration" to configure for group properly', () => {
    edit.type = 'group';
    edit.generateQueries(document);
    spyOn(storage, 'getGroup').and.returnValue('group data');
    spyOn(storage, 'getPie').and.returnValue('pie data');

    edit.configuration(storage);
    expect(edit.pattern).toEqual(jasmine.any(Object));
    expect(edit.data).toEqual('group data');
    expect(edit.preview).toEqual(false);
    expect(edit.previewFn).toBeNull();
    expect(edit.enterToSave).toEqual(true);
    expect(edit.saveFn).toEqual(jasmine.any(Function));
    expect(edit.editAsOption).toEqual(true);
    expect(edit.title.innerText).toEqual('Group Individuals');
    expect(edit.add.innerText).toEqual('INDIVIDUAL');
    expect(edit.del.innerText).toEqual('GROUP');
    
    expect(edit.previewState.innerText).toEqual('FALSE');
    expect(edit.enterToSaveState.innerText).toEqual('TRUE');
    expect(edit.editAsType).toEqual('LIST');
  });

  it('expects "configuration" to configure for panels properly', () => {
    edit.type = 'panels';
    edit.editAsType = 'PANELS';
    edit.generateQueries(document);
    spyOn(storage, 'getGroup').and.returnValue('group data');
    spyOn(storage, 'getPie').and.returnValue('pie data');

    edit.configuration(storage);
    expect(edit.pattern).toEqual(jasmine.any(Object));
    expect(edit.data).toEqual('pie data');
    expect(edit.preview).toEqual(true);
    expect(edit.previewFn).toEqual(jasmine.any(Function));
    expect(edit.enterToSave).toEqual(false);
    expect(edit.saveFn).toEqual(jasmine.any(Function));
    expect(edit.editAsOption).toEqual(false);
    expect(edit.title.innerText).toEqual('Panels');
    expect(edit.add.innerText).toEqual('PANEL');
    expect(edit.del.innerText).toEqual('PANELS');
    
    expect(edit.previewState.innerText).toEqual('TRUE');
    expect(edit.enterToSaveState.innerText).toEqual('FALSE');
    expect(edit.editAsType).toEqual('PANELS');
  });

  it('expects "back" to use history.back', () => {
    spyOn(window.history, 'back').and.stub();

    edit.back(window);
    expect(window.history.back).toHaveBeenCalled();
  });

  it('expects "selectEditAsType" to configure for LIST type', () => {
    const type = 'LIST';
    spyOn(edit, 'showList').and.stub();
    spyOn(edit, 'showCSV').and.stub();
    spyOn(storage, 'saveEditAsType').and.stub();
    edit.generateQueries(document);

    edit.selectEditAsType(type, document, storage);
    const addTooling = document.getElement('.tooling .addition-button');
    const delTooling = document.getElement('.tooling .delete-all-button');        
    expect(edit.editAsType).toEqual(type);
    expect(edit.editAsLIST.classList.list.includes('selected')).toEqual(true);
    expect(edit.editAsCSV.classList.list.includes('selected')).toEqual(false);
    expect(addTooling.classList.list.includes('hidden')).toEqual(false);
    expect(delTooling.classList.list.includes('hidden')).toEqual(false);
    expect(edit.showList).toHaveBeenCalled();
    expect(storage.saveEditAsType).toHaveBeenCalled();
  });

  it('expects "selectEditAsType" to configure for CSV type', () => {
    const type = 'CSV';
    spyOn(edit, 'showList').and.stub();
    spyOn(edit, 'showCSV').and.stub();
    spyOn(storage, 'saveEditAsType').and.stub();
    edit.generateQueries(document);

    edit.selectEditAsType(type, document, storage);
    const addTooling = document.getElement('.tooling .addition-button');
    const delTooling = document.getElement('.tooling .delete-all-button');        
    expect(edit.editAsType).toEqual(type);
    expect(edit.editAsLIST.classList.list.includes('selected')).toEqual(false);
    expect(edit.editAsCSV.classList.list.includes('selected')).toEqual(true);
    expect(addTooling.classList.list.includes('hidden')).toEqual(true);
    expect(delTooling.classList.list.includes('hidden')).toEqual(true);
    expect(edit.showCSV).toHaveBeenCalled();
    expect(storage.saveEditAsType).toHaveBeenCalled();
  });

  it('expects "handleSimpleSelection" to open editor target and store selected information', () => {
    const target = document.querySelector('target');
    target.setAttribute('data-index', '1');
    target.querySelector = document.querySelector;
    edit.data = ['a', 'b', 'c', 'd'];

    edit.handleSimpleSelection(target);
    const editor = document.getElement('.editor-node');
    expect(target.classList.list.includes('selected'));
    expect(editor.classList.list.includes('hidden')).toEqual(false);
    expect(edit.selected.index).toEqual(1);
    expect(edit.selected.data).toEqual('b');
  });

  it('expects "handleEditPreview" to updated text and colors', () => {
    const target = document.querySelector('target');
    target.querySelector = document.querySelector;
    edit.selected = {};
    edit.selected.target = target;
    edit.selected.data = {
      text: 'text', additionalText: 'additional',
      color: 'color', fcolor: 'fcolor'
    };
    spyOn(edit, 'changePreviewPanelText').and.stub();
    spyOn(edit, 'changePreviewPanelColor').and.stub();

    edit.handleEditPreview();
    expect(edit.changePreviewPanelText).toHaveBeenCalledTimes(2);
    expect(edit.changePreviewPanelColor).toHaveBeenCalledTimes(1);
  });

  it('expects "handleRowSelection" to skip row selection if set', () => {
    const event = { target: { nodeName: 'DIV' }, currentTarget: 'target' };
    const target = document.querySelector('target');
    target.querySelector = document.querySelector;
    target.classList.add('selected');
    edit.skipHandleRowSelection = true;
    edit.preview = false;
    edit.selected = {};
    edit.selected.target = target;
    spyOn(edit, 'handleEditPreview').and.stub();
    spyOn(edit, 'handleSimpleSelection').and.stub();

    edit.handleRowSelection(event, document);
    expect(edit.handleEditPreview).not.toHaveBeenCalled();
    expect(edit.handleSimpleSelection).not.toHaveBeenCalled();
  });

  it('expects "handleRowSelection" to skip row selection if target is not DIV', () => {
    const event = { target: { nodeName: 'SPAN' }, currentTarget: 'target' };
    const target = document.querySelector('target');
    target.querySelector = document.querySelector;
    target.classList.add('selected');
    edit.skipHandleRowSelection = false;
    edit.preview = false;
    edit.selected = {};
    edit.selected.target = target;
    spyOn(edit, 'handleEditPreview').and.stub();
    spyOn(edit, 'handleSimpleSelection').and.stub();

    edit.handleRowSelection(event, document);
    expect(edit.handleEditPreview).not.toHaveBeenCalled();
    expect(edit.handleSimpleSelection).not.toHaveBeenCalled();
  });

  it('expects "handleRowSelection" to show editor and deselect target', () => {
    const event = { target: { nodeName: 'DIV' }, currentTarget: 'target' };
    const target = document.querySelector('target');
    target.querySelector = document.querySelector;
    target.classList.add('selected');
    edit.skipHandleRowSelection = false;
    edit.preview = false;
    edit.selected = {};
    edit.selected.target = target;
    spyOn(edit, 'handleEditPreview').and.stub();
    spyOn(edit, 'handleSimpleSelection').and.stub();

    edit.handleRowSelection(event, document);
    const editor = document.getElement('.element.selected .editor-node');
    expect(editor.classList.list.includes('hidden')).toEqual(true);
    expect(edit.handleEditPreview).not.toHaveBeenCalled();
    expect(edit.handleSimpleSelection).toHaveBeenCalled();
  });

  it('expects "handleRowSelection" to show editor, deselect target, and preview', () => {
    const event = { target: { nodeName: 'DIV' }, currentTarget: 'target' };
    const target = document.querySelector('target');
    target.querySelector = document.querySelector;
    target.classList.add('selected');
    edit.skipHandleRowSelection = false;
    edit.preview = true;
    edit.selected = {};
    edit.selected.target = target;
    spyOn(edit, 'handleEditPreview').and.stub();
    spyOn(edit, 'handleSimpleSelection').and.stub();

    edit.handleRowSelection(event, document);
    const editor = document.getElement('.element.selected .editor-node');
    expect(editor.classList.list.includes('hidden')).toEqual(true);
    expect(edit.handleEditPreview).toHaveBeenCalled();
    expect(edit.handleSimpleSelection).toHaveBeenCalled();
  });
});