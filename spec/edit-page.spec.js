
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
});