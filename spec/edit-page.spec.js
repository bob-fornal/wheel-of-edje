
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
    expect(edit.createEditorNode).toEqual(jasmine.any(Function));
    expect(edit.createUpNode).toEqual(jasmine.any(Function));
    expect(edit.createDownNode).toEqual(jasmine.any(Function));
    expect(edit.createSaveNode).toEqual(jasmine.any(Function));
    expect(edit.createDeleteNode).toEqual(jasmine.any(Function));
    expect(edit.addEditorNode).toEqual(jasmine.any(Function));
    expect(edit.addStringNode).toEqual(jasmine.any(Function));
    expect(edit.addColorNode).toEqual(jasmine.any(Function));
    expect(edit.addElement).toEqual(jasmine.any(Function));
    expect(edit.addDivNodeEditor).toEqual(jasmine.any(Function));
    expect(edit.addDivNodeElements).toEqual(jasmine.any(Function));
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

  it('expects "handleDeleteAll" to clear data, selected, show list, and save', () => {
    edit.data = ['1', '2', '3'];
    edit.selected = 'selected';
    spyOn(edit, 'showList').and.stub();
    spyOn(edit, 'saveFn').and.stub();

    edit.handleDeleteAll();
    expect(edit.data).toEqual([]);
    expect(edit.selected).toBeNull();
    expect(edit.showList).toHaveBeenCalled();
    expect(edit.saveFn).toHaveBeenCalled();
  });

  it('expects "handleMoveUp" to not move when index = 0', () => {
    const event = { stopPropagation: () => {} };
    edit.data =[
      { item: '1' },
      { item: '2' },
      { item: '3' },
      { item: '4' },
      { item: '5' }
    ];
    edit.selected = {};
    edit.selected.index = 0;
    edit.selected.data = edit.data[edit.selected.index];
    spyOn(edit, 'showList').and.stub();
    spyOn(edit, 'saveFn').and.stub();

    edit.handleMoveUp(event, window);
    expect(edit.data[1]).not.toEqual({ item: '3' });
    expect(edit.data[2]).not.toEqual({ item: '2' });
    expect(edit.selected).not.toBeNull();
    expect(edit.showList).not.toHaveBeenCalled();
    expect(edit.saveFn).not.toHaveBeenCalled();
  });

  it('expects "handleMoveUp" to move selected by index, show list, and save', () => {
    const event = { stopPropagation: () => {} };
    edit.data =[
      { item: '1' },
      { item: '2' },
      { item: '3' },
      { item: '4' },
      { item: '5' }
    ];
    edit.selected = {};
    edit.selected.index = 2;
    edit.selected.data = edit.data[edit.selected.index];
    spyOn(edit, 'showList').and.stub();
    spyOn(edit, 'saveFn').and.stub();

    edit.handleMoveUp(event, window);
    expect(edit.data[1]).toEqual({ item: '3' });
    expect(edit.data[2]).toEqual({ item: '2' });
    expect(edit.selected).toBeNull();
    expect(edit.showList).toHaveBeenCalled();
    expect(edit.saveFn).toHaveBeenCalled();
  });

  it('expects "handleMoveDown" to not move when index = EOL', () => {
    const event = { stopPropagation: () => {} };
    edit.data =[
      { item: '1' },
      { item: '2' },
      { item: '3' },
      { item: '4' },
      { item: '5' }
    ];
    edit.selected = {};
    edit.selected.index = 4;
    edit.selected.data = edit.data[edit.selected.index];
    spyOn(edit, 'showList').and.stub();
    spyOn(edit, 'saveFn').and.stub();

    edit.handleMoveDown(event, window);
    expect(edit.data[2]).not.toEqual({ item: '4' });
    expect(edit.data[3]).not.toEqual({ item: '3' });
    expect(edit.selected).not.toBeNull();
    expect(edit.showList).not.toHaveBeenCalled();
    expect(edit.saveFn).not.toHaveBeenCalled();
  });
  
  it('expects "handleMoveDown" to move selected by index, show list, and save', () => {
    const event = { stopPropagation: () => {} };
    edit.data =[
      { item: '1' },
      { item: '2' },
      { item: '3' },
      { item: '4' },
      { item: '5' }
    ];
    edit.selected = {};
    edit.selected.index = 2;
    edit.selected.data = edit.data[edit.selected.index];
    spyOn(edit, 'showList').and.stub();
    spyOn(edit, 'saveFn').and.stub();

    edit.handleMoveDown(event, window);
    expect(edit.data[2]).toEqual({ item: '4' });
    expect(edit.data[3]).toEqual({ item: '3' });
    expect(edit.selected).toBeNull();
    expect(edit.showList).toHaveBeenCalled();
    expect(edit.saveFn).toHaveBeenCalled();
  });

  it('expects "handleDeleteSelection" to remove , show list, and save', () => {
    const event = { stopPropagation: () => {} };
    edit.data =[
      { item: '1' },
      { item: '2' },
      { item: '3' },
      { item: '4' },
      { item: '5' }
    ];
    edit.selected = {};
    edit.selected.index = 2;
    edit.selected.data = edit.data[edit.selected.index];
    spyOn(edit, 'showList').and.stub();
    spyOn(edit, 'saveFn').and.stub();

    edit.handleDeleteSelection(event);
    expect(edit.data.includes({ item: '3' })).toEqual(false);
    expect(edit.selected).toBeNull();
    expect(edit.showList).toHaveBeenCalled();
    expect(edit.saveFn).toHaveBeenCalled();
  });

  it('expects "handleSaveNew" to build a proper group object', () => {
    const event = { stopPropagation: () => {} };
    document.configurationFn = (element) => {
      element.querySelectorAll = (attr) => {
        let result = [];
        switch (true) {
          case (attr === '[datatype=string-edit]'):
            result = [
              { getAttribute: () => 'name', value: 'Bob' }
            ];
            break;
          case (attr === '[datatype=color-edit]'):
            result = [];
            break;
        }
        return result;
      };
    };
    edit.pattern = edit.groupPattern;
    edit.data = [];
    spyOn(edit, 'showList').and.stub();
    spyOn(edit, 'saveFn').and.stub();
    const result = {
      name: 'Bob',
      prize: null,
      additional: null,
      enabled: true
    };

    edit.handleSaveNew(event, document);
    expect(edit.data).toEqual([result]);
    expect(edit.showList).toHaveBeenCalled();
    expect(edit.saveFn).toHaveBeenCalled();
  });

  it('expects "handleSaveNew" to build a proper panel object', () => {
    const event = { stopPropagation: () => {} };
    document.configurationFn = (element) => {
      element.querySelectorAll = (attr) => {
        let result = [];
        switch (true) {
          case (attr === '[datatype=string-edit]'):
            result = [
              { getAttribute: () => 'data', value: 10 },
              { getAttribute: () => 'text', value: 'Prize' },
              { getAttribute: () => 'additionalText', value: 'Additional' }
            ];
            break;
          case (attr === '[datatype=color-edit]'):
            result = [
              { getAttribute: () => 'color', value: 'black' },
              { getAttribute: () => 'fcolor', value: 'white' }
            ];
            break;
        }
        return result;
      };
    };
    edit.pattern = edit.panelPattern;
    edit.data = [];
    spyOn(edit, 'showList').and.stub();
    spyOn(edit, 'saveFn').and.stub();
    const result = {
      data: 10,
      text: 'Prize',
      additionalText: 'Additional',
      color: 'black',
      fcolor: 'white',
      enabled: true
    };

    edit.handleSaveNew(event, document);
    expect(edit.data).toEqual([result]);
    expect(edit.showList).toHaveBeenCalled();
    expect(edit.saveFn).toHaveBeenCalled();
  });

  it('expects "coreSaveType" to get elements and process complex values', () => {
    const matchValue = (datum, type = '') => (type === 'string') ? datum.value : Number(datum.value);
    edit.pattern = {
      'key1': { type: 'string' },
      'key2': { type: 'string' },
      'key3': { type: 'string' },
      'key4': { type: 'number' }
    };
    document.configurationFn = () => [
      { getAttribute: () => 'key1', value: 'value1' },
      { getAttribute: () => 'key2', value: 'value2' },
      { getAttribute: () => 'key3', value: 'value3' },
      { getAttribute: () => 'key4', value: '7' }
    ];
    const expectedResult = {
      'key1': 'value1',
      'key2': 'value2',
      'key3': 'value3',
      'key4': 7,
    };

    let result = {};
    edit.coreSaveType(result, document, 'pattern', matchValue);
    expect(result).toEqual(expectedResult);
  });

  it('expects "coreSaveType" to get elements and process simple values', () => {
    const matchValue = (datum) => datum.value;
    edit.pattern = {
      'key1': { type: 'string' },
      'key2': { type: 'string' },
      'key3': { type: 'string' },
      'key4': { type: 'string' }
    };
    document.configurationFn = () => [
      { getAttribute: () => 'key1', value: 'value1' },
      { getAttribute: () => 'key2', value: 'value2' },
      { getAttribute: () => 'key3', value: 'value3' },
      { getAttribute: () => 'key4', value: '7' }
    ];
    const expectedResult = {
      'key1': 'value1',
      'key2': 'value2',
      'key3': 'value3',
      'key4': '7',
    };

    let result = {};
    edit.coreSaveType(result, document, 'pattern', matchValue);
    expect(result).toEqual(expectedResult);
  });

  it('expects "coreSave" to handle data construction for saves', () => {
    const event = { stopPropagation: () => {} };
    spyOn(edit, 'coreSaveType').and.stub();

    const result = edit.coreSave(event, '', {});
    expect(result).toEqual({});
    expect(edit.coreSaveType).toHaveBeenCalledTimes(2);
  });

  it('expects "handleSaveNew" to build a result adding defaults for skipped pattern values', () => {
    const event = {};
    edit.pattern = edit.groupPattern;
    edit.data = [];
    spyOn(edit, 'coreSave').and.returnValue({ name: 'Bob' });
    spyOn(edit, 'showList').and.stub();
    spyOn(edit, 'saveFn').and.stub();
    const expectedResult = [{
      name: 'Bob',
      prize: null,
      additional: null,
      enabled: true
    }];

    edit.handleSaveNew(event, document);
    expect(edit.data).toEqual(expectedResult);
    expect(edit.showList).toHaveBeenCalled();
    expect(edit.saveFn).toHaveBeenCalled();
  });

  it('expects "handleSaveSelection" to update selected data', () => {
    const event = {};
    edit.selected = {};
    edit.selected.target = document.querySelector('1');
    edit.selected.target.classList.add('selected');
    edit.selected.target.querySelector = () => {
      return document.querySelector('2');
    };
    spyOn(edit, 'coreSave').and.stub();
    spyOn(edit, 'showList').and.stub();
    spyOn(edit, 'saveFn').and.stub();

    edit.handleSaveSelection(event);
    const target = document.getElement('1');
    const editor = document.getElement('2');
    expect(editor.classList.list.includes('hidden')).toEqual(true);
    expect(edit.coreSave).toHaveBeenCalled();
    expect(edit.selected).toBeNull();
    expect(edit.showList).toHaveBeenCalled();
    expect(edit.saveFn).toHaveBeenCalled();
  });

  it('expects "handleNextSelection" to get target and set focus', () => {
    jasmine.clock().install();

    let focusFired = false;
    const handleFocus = () => {
      focusFired = true;
    };
    document.configurationFn = (element) => {
      element.querySelector = () => {
        return { focus: handleFocus };
      };
    };
    edit.data = [1, 2, 3, 4, 5];
    spyOn(edit, 'handleSimpleSelection').and.stub();

    edit.handleNextSelection(0, document);
    jasmine.clock().tick(20);
    expect(edit.handleSimpleSelection).toHaveBeenCalled();
    expect(focusFired).toEqual(true);

    jasmine.clock().uninstall();
  });

  it('expects "changePreviewPanelColor" to set target attributes', () => {
    const value = { color: 'background', fcolor: 'foreground' };
    let result;
    const target = {
      setAttribute: (type, data) => {
        result = { type, data };
      }
    };
    edit.preview = true;

    edit.changePreviewPanelColor({ value, target });
    expect(result).toEqual({
      "type": "style",
      "data": "background-color: background; color: foreground;"
    });
  });

  it('expects "getSelector" to determine addition node was selected', () => {
    const event = { target: '' };
    document.configurationFn = (element) => {
      element.contains = () => true;
    };

    const result = edit.getSelector(event, document);
    expect(result).toEqual('.element-addition');
  });

  it('expects "getSelector" to determine selected node was selected', () => {
    const event = { target: '' };
    document.configurationFn = (element) => {
      element.contains = () => false;
    };

    const result = edit.getSelector(event, document);
    expect(result).toEqual('.element.selected');
  });

  it('expects "handleColorChange" to skip selection, determine colors and change', () => {
    const event = {
      stopPropagation: () => {},
      target: { getAttribute: () => 'color', value: 'color-background' }
    };
    edit.skipHandleRowSelection = false;
    edit.selected = { data: { color: 'background', fcolor: 'foreground' } };
    spyOn(edit, 'getSelector').and.returnValue('.element.selected');
    spyOn(edit, 'changePreviewPanelColor').and.stub();

    edit.handleColorChange(event, document);
    expect(edit.skipHandleRowSelection).toEqual(true);
    expect(edit.changePreviewPanelColor).toHaveBeenCalledWith({
      value: { color: 'color-background', fcolor: 'foreground' },
      target: jasmine.any(Object)
    });
  });

  it('expects "handleColorChange" to skip selection, determine colors and change', () => {
    const event = {
      stopPropagation: () => {},
      target: { getAttribute: () => 'fcolor', value: 'color-foreground' }
    };
    edit.skipHandleRowSelection = false;
    edit.selected = { data: { color: 'background', fcolor: 'foreground' } };
    spyOn(edit, 'getSelector').and.returnValue('.element.selected');
    spyOn(edit, 'changePreviewPanelColor').and.stub();

    edit.handleColorChange(event, document);
    expect(edit.skipHandleRowSelection).toEqual(true);
    expect(edit.changePreviewPanelColor).toHaveBeenCalledWith({
      value: { color: 'background', fcolor: 'color-foreground' },
      target: jasmine.any(Object)
    });
  });

  it('expects "handleColorChange" to skip selection, determine colors and change', () => {
    const event = {
      stopPropagation: () => {},
      target: { getAttribute: () => 'color', value: 'color-background' }
    };
    edit.skipHandleRowSelection = false;
    edit.selected = { data: { color: 'background', fcolor: 'foreground' } };
    spyOn(edit, 'getSelector').and.returnValue('.element-addition');
    spyOn(edit, 'changePreviewPanelColor').and.stub();

    edit.handleColorChange(event, document);
    expect(edit.skipHandleRowSelection).toEqual(true);
    expect(edit.changePreviewPanelColor).toHaveBeenCalledWith({
      value: { color: 'color-background', fcolor: '#ffffff' },
      target: jasmine.any(Object)
    });
  });

  it('expects "handleColorChange" to skip selection, determine colors and change', () => {
    const event = {
      stopPropagation: () => {},
      target: { getAttribute: () => 'fcolor', value: 'color-foreground' }
    };
    edit.skipHandleRowSelection = false;
    edit.selected = { data: { color: 'background', fcolor: 'foreground' } };
    spyOn(edit, 'getSelector').and.returnValue('.element-addition');
    spyOn(edit, 'changePreviewPanelColor').and.stub();

    edit.handleColorChange(event, document);
    expect(edit.skipHandleRowSelection).toEqual(true);
    expect(edit.changePreviewPanelColor).toHaveBeenCalledWith({
      value: { color: '#bee767', fcolor: 'color-foreground' },
      target: jasmine.any(Object)
    });
  });

  it('expects "changePreviewPanelText" to set target inner text', () => {
    const value = 'value';
    const target = { innerText: '~~~NONE~~~' };
    edit.preview = true;

    edit.changePreviewPanelText({ value, target });
    expect(target.innerText).toEqual(value);
  });

  it('expects "changePreviewPanelText" to not set target inner text', () => {
    const value = 'value';
    const target = { innerText: '~~~NONE~~~' };
    edit.preview = false;

    edit.changePreviewPanelText({ value, target });
    expect(target.innerText).not.toEqual(value);
  });

  it('expects "handleStringKeyup" to save and move to next selection on ENTER', () => {
    const event = { key: 'Enter', target: { value: 'value', getAttribute: () => 'text' } };
    edit.selected = {index: 2 };
    edit.enterToSave = true;
    spyOn(edit, 'getSelector').and.returnValue('NONE');
    spyOn(edit, 'handleSaveSelection').and.stub();
    spyOn(edit, 'handleNextSelection').and.stub();
    spyOn(edit, 'changePreviewPanelText').and.stub();

    edit.handleStringKeyup(event, document);
    expect(edit.handleSaveSelection).toHaveBeenCalled();
    expect(edit.handleNextSelection).toHaveBeenCalled();
    expect(edit.changePreviewPanelText).not.toHaveBeenCalled();
  });

  it('expects "handleStringKeyup" to change preview panel text', () => {
    const event = { key: 'Enter', target: { value: 'value', getAttribute: () => 'text' } };
    edit.selected = {index: 2 };
    edit.enterToSave = false;
    spyOn(edit, 'getSelector').and.returnValue('NONE');
    spyOn(edit, 'handleSaveSelection').and.stub();
    spyOn(edit, 'handleNextSelection').and.stub();
    spyOn(edit, 'changePreviewPanelText').and.stub();

    edit.handleStringKeyup(event, document);
    expect(edit.handleSaveSelection).not.toHaveBeenCalled();
    expect(edit.handleNextSelection).not.toHaveBeenCalled();
    expect(edit.changePreviewPanelText).toHaveBeenCalled();
  });

  it('expects "handleStringKeyup" to change preview panel additional text', () => {
    const event = { key: 'Enter', target: { value: 'value', getAttribute: () => 'additionalText' } };
    edit.selected = {index: 2 };
    edit.enterToSave = false;
    spyOn(edit, 'getSelector').and.returnValue('NONE');
    spyOn(edit, 'handleSaveSelection').and.stub();
    spyOn(edit, 'handleNextSelection').and.stub();
    spyOn(edit, 'changePreviewPanelText').and.stub();

    edit.handleStringKeyup(event, document);
    expect(edit.handleSaveSelection).not.toHaveBeenCalled();
    expect(edit.handleNextSelection).not.toHaveBeenCalled();
    expect(edit.changePreviewPanelText).toHaveBeenCalled();
  });

  it('expects "handleAddition" to remote hidden class from addition element', () => {
    document.configurationFn = (element) => {
      element.classList.add('hidden');
    };

    edit.handleAddition(document);
    const addition = document.getElement('.element-addition');
    expect(addition.classList.list.includes('hidden')).toEqual(false);
  });

  it('expects "createEditorNode" to return non-hidden element', () => {
    const add =  true;

    const element = edit.createEditorNode(add, document);
    expect(element.classList.list.includes('editor-node')).toEqual(true);
    expect(element.classList.list.includes('hidden')).toEqual(false);
  });

  it('expects "createEditorNode" to return hidden element', () => {
    const add =  false;

    const element = edit.createEditorNode(add, document);
    expect(element.classList.list.includes('editor-node')).toEqual(true);
    expect(element.classList.list.includes('hidden')).toEqual(true);
  });

  it('expects "createUpNode" to return enabled element', () => {
    const first = false;

    const element = edit.createUpNode(first, document);
    expect(element.classList.list.includes('editor-icon')).toEqual(true);
    expect(element.classList.list.includes('up')).toEqual(true);
    expect(element.src).toEqual('images/up.png');
    expect(element.onclick).toEqual(jasmine.any(Function));
    expect(element.title).toEqual('Move Up');
  });

  it('expects "createUpNode" to return disabled element', () => {
    const first = true;

    const element = edit.createUpNode(first, document);
    expect(element.classList.list.includes('editor-icon')).toEqual(true);
    expect(element.classList.list.includes('up')).toEqual(true);
    expect(element.classList.list.includes('disabled')).toEqual(true);
    expect(element.src).toEqual('images/up-disabled.png');
    expect(element.onclick).toEqual(jasmine.any(Function));
    expect(element.title).toEqual('Move Up');
  });

  it('expects "createDownNode" to return enabled element', () => {
    const last = false;

    const element = edit.createDownNode(last, document);
    expect(element.classList.list.includes('editor-icon')).toEqual(true);
    expect(element.classList.list.includes('down')).toEqual(true);
    expect(element.src).toEqual('images/down.png');
    expect(element.onclick).toEqual(jasmine.any(Function));
    expect(element.title).toEqual('Move Down');
  });

  it('expects "createDownNode" to return disabled element', () => {
    const last = true;

    const element = edit.createDownNode(last, document);
    expect(element.classList.list.includes('editor-icon')).toEqual(true);
    expect(element.classList.list.includes('down')).toEqual(true);
    expect(element.classList.list.includes('disabled')).toEqual(true);
    expect(element.src).toEqual('images/down-disabled.png');
    expect(element.onclick).toEqual(jasmine.any(Function));
    expect(element.title).toEqual('Move Down');
  });

  it('expects "createSaveNode" to return save new element', () => {
    const add = true;

    const element = edit.createSaveNode(add, document);
    expect(element.classList.list.includes('editor-icon')).toEqual(true);
    expect(element.classList.list.includes('save')).toEqual(true);
    expect(element.src).toEqual('images/save.png');
    expect(element.onclick).toEqual(jasmine.any(Function));
    expect(element.title).toEqual('Save New Row');
  });

  it('expects "createSaveNode" to return save row changes element', () => {
    const add = false;

    const element = edit.createSaveNode(add, document);
    expect(element.classList.list.includes('editor-icon')).toEqual(true);
    expect(element.classList.list.includes('save')).toEqual(true);
    expect(element.src).toEqual('images/save.png');
    expect(element.onclick).toEqual(jasmine.any(Function));
    expect(element.title).toEqual('Save Row Changes');
  });

  it('expects "createDeleteNode" to return disabled element', () => {
    const add = true;

    const element = edit.createDeleteNode(add, document);
    expect(element.classList.list.includes('editor-icon')).toEqual(true);
    expect(element.classList.list.includes('delete')).toEqual(true);
    expect(element.src).toEqual('images/trash-disabled.png');
    expect(element.onclick).not.toEqual(jasmine.any(Function));
    expect(element.title).toEqual('Delete Row');
  });

  it('expects "createDeleteNode" to return enabled element', () => {
    const add = false;

    const element = edit.createDeleteNode(add, document);
    expect(element.classList.list.includes('editor-icon')).toEqual(true);
    expect(element.classList.list.includes('delete')).toEqual(true);
    expect(element.src).toEqual('images/trash.png');
    expect(element.onclick).toEqual(jasmine.any(Function));
    expect(element.title).toEqual('Delete Row');
  });

  it('expects "addEditorNode" to build the proper structure', () => {
    const node = {
      appendChild: () => {}
    };
    const editorNode = {
      appendChild: () => {}
    };
    spyOn(edit, 'createEditorNode').and.returnValue(editorNode);
    spyOn(edit, 'createUpNode').and.stub();
    spyOn(edit, 'createDownNode').and.stub();
    spyOn(edit, 'createSaveNode').and.stub();
    spyOn(edit, 'createDeleteNode').and.stub();

    edit.addEditorNode(node);
    expect(edit.createEditorNode).toHaveBeenCalled();
    expect(edit.createUpNode).toHaveBeenCalled();
    expect(edit.createDownNode).toHaveBeenCalled();
    expect(edit.createSaveNode).toHaveBeenCalled();
    expect(edit.createDeleteNode).toHaveBeenCalled();
  });

  it('expects "addStringNode" to add view and edit forms', () => {
    const div = {
      nodes: []
    };
    div.appendChild = (element) => {
      div.nodes.push(element);
    };
    const subdata = 'the text';
    const key = 'key';

    edit.addStringNode(div,subdata, key, document);
    const content = div.nodes[0];
    const input = div.nodes[1];
    expect(content.classList.list.includes('element-content')).toEqual(true);
    expect(content.attributes.datatype).toEqual('string-view');
    expect(content.innerText).toEqual(subdata);
    expect(input.type).toEqual('text');
    expect(input.value).toEqual(subdata);
    expect(input.attributes.datatype).toEqual('string-edit');
    expect(input.attributes['data-key']).toEqual(key);
    expect(input.onkeyup).toEqual(jasmine.any(Function));
  });

  it('expects "addColorNode" to add view and edit forms', () => {
    const div = {
      nodes: []
    };
    div.appendChild = (element) => {
      div.nodes.push(element);
    };
    const subdata = 'the text';
    const key = 'key';

    edit.addColorNode(div,subdata, key, document);
    const content = div.nodes[0];
    const input = div.nodes[1];
    expect(content.classList.list.includes('element-content')).toEqual(true);
    expect(content.attributes.datatype).toEqual('color-view');
    expect(content.attributes.style).toEqual('background-color: the text;');
    expect(input.type).toEqual('color');
    expect(input.value).toEqual(subdata);
    expect(input.attributes.datatype).toEqual('color-edit');
    expect(input.onchange).toEqual(jasmine.any(Function));
    expect(input.attributes['data-key']).toEqual(key);
  });

  it('expects "addElement" to generate a data row', () => {
    const element = {
      data1: { text: 'data1-text', type: 'string' },
      data2: { text: 'data2-text', type: 'string' }
    };
    const div = {
      nodes: []
    };
    div.appendChild = (element) => {
      div.nodes.push(element);
    };
    edit.pattern = {
      order: ['data1', 'data2'],
      data1: { skip: false },
      data2: { skip: true }
    };
    spyOn(edit, 'addStringNode').and.stub();
    spyOn(edit, 'addColorNode').and.stub();

    edit.addElement({ element, j: 0, divNode: div }, document);
    const row = div.nodes[0];
    const label = document.getElement('UNDEFINED-1');
    expect(label).toBeDefined();
    expect(row.classList.list.includes('row')).toEqual(true);
    expect(label.classList.list.includes('label')).toEqual(true);
  });

  it('expects "addElement" to skip a data row', () => {
    const element = {
      data1: { text: 'data1-text', type: 'string' },
      data2: { text: 'data2-text', type: 'string' }
    };
    const div = {
      nodes: []
    };
    div.appendChild = (element) => {
      div.nodes.push(element);
    };
    edit.pattern = {
      order: ['data1', 'data2'],
      data1: { skip: false },
      data2: { skip: true }
    };
    spyOn(edit, 'addStringNode').and.stub();
    spyOn(edit, 'addColorNode').and.stub();

    edit.addElement({ element, j: 1, divNode: div }, document);
    const row = div.nodes[0];
    const label = document.getElement('UNDEFINED-1');
    expect(label).not.toBeDefined();
    expect(row).not.toBeDefined();
  });

  it('expects "addDivNodeEditor" to add hidden editor for new element', () => {
    const i = -1;
    const node = document.querySelector('node');
    edit.data = [1, 2, 3];
    spyOn(edit, 'addEditorNode').and.stub();

    edit.addDivNodeEditor(i, node);
    expect(node.classList.list.includes('element-addition'));
    expect(node.classList.list.includes('hidden'));
    expect(edit.addEditorNode).toHaveBeenCalledWith(jasmine.any(Object), true, true, true);
  });

  it('expects "addDivNodeEditor" to add element', () => {
    const i = 0;
    const node = document.querySelector('node');
    edit.data = [1, 2, 3];
    spyOn(edit, 'addEditorNode').and.stub();

    edit.addDivNodeEditor(i, node);
    expect(node.classList.list.includes('element'));
    expect(edit.addEditorNode).toHaveBeenCalledWith(jasmine.any(Object), true, false);
  });

  it('expects "addDivNodeElements" to add elements based on pattern order', () => {
    const element = 'element';
    const divNode = 'node';
    edit.pattern = { order: [1, 2, 3, 4, 5]};
    spyOn(edit, 'addElement').and.stub();

    edit.addDivNodeElements(element, divNode);
    expect(edit.addElement).toHaveBeenCalledWith(jasmine.objectContaining({ element, divNode }));
    expect(edit.addElement).toHaveBeenCalledTimes(5);
  });
});