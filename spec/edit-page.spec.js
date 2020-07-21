
const edit = require('../public/js/edit-page');
const doc = require('./helpers/document.helper');
const store = require('./helpers/storage.helper');

describe('editing page', () => {
  let storage, document;

  beforeEach(() => {
    store.init();
    storage = store.mock;

    doc.init();
    document = doc.mock;
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
});