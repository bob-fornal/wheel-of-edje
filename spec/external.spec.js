const external = require('../public/js/external');
const ctrl = require('./helpers/control.helper');
const store = require('./helpers/storage.helper');
const pr = require('./helpers/peer.helper');

describe('external', () => {
  let control, storage, peer;

  beforeEach(() => {
    external.reset();

    ctrl.init();
    control = ctrl.mock;

    store.init();
    storage = store.mock;

    pr.init();
    peer = pr.mock;
  });

  it('expects external to exist', () => {
    expect(external.activeSound).toEqual('SILENT');
    expect(external.group).toBeNull();
    expect(external.panels).toBeNull();

    expect(external.init).toEqual(jasmine.any(Function));
    expect(external.updateDisplay).toEqual(jasmine.any(Function));
    expect(external.triggerSpin).toEqual(jasmine.any(Function));
    expect(external.showSpinning).toEqual(jasmine.any(Function));
    expect(external.showActiveSound).toEqual(jasmine.any(Function));
    expect(external.addSpinButtons).toEqual(jasmine.any(Function));
    expect(external.addGroupButtons).toEqual(jasmine.any(Function));
    expect(external.calculateDisplayName).toEqual(jasmine.any(Function));
    expect(external.addIndividual).toEqual(jasmine.any(Function));
    expect(external.handleEnableBtn).toEqual(jasmine.any(Function));
    expect(external.handleDisableBtn).toEqual(jasmine.any(Function));
    expect(external.handleDeselection).toEqual(jasmine.any(Function));
    expect(external.handleSelection).toEqual(jasmine.any(Function));
    expect(external.showGroup).toEqual(jasmine.any(Function));
    expect(external.showWinner).toEqual(jasmine.any(Function));
    expect(external.hideWinner).toEqual(jasmine.any(Function));
    expect(external.closeWinner).toEqual(jasmine.any(Function));
    expect(external.setSound).toEqual(jasmine.any(Function));
    expect(external.triggerSeePrizes).toEqual(jasmine.any(Function));
    expect(external.triggerSeePeerLink).toEqual(jasmine.any(Function));
    expect(external.triggerClearPrizes).toEqual(jasmine.any(Function));
    expect(external.addPanelButtons).toEqual(jasmine.any(Function));
    expect(external.addPanel).toEqual(jasmine.any(Function));
    expect(external.showPanels).toEqual(jasmine.any(Function));
    expect(external.handlePanelEnable).toEqual(jasmine.any(Function));
    expect(external.handlePanelDisable).toEqual(jasmine.any(Function));
  });

  it('expects "init" to handle the correct events', () => {
    spyOn(control, 'init').and.stub();
    spyOn(storage, 'editInit').and.stub();
    spyOn(storage, 'getActiveSound').and.returnValue('metronome');
    spyOn(peer, 'init').and.stub();
    spyOn(external, 'updateDisplay').and.stub();

    external.init(control, storage, peer);
    expect(control.init).toHaveBeenCalled();
    expect(storage.editInit).toHaveBeenCalled();
    expect(external.activeSound).toEqual('metronome');
    expect(external.updateDisplay).toHaveBeenCalled();
    expect(peer.init).toHaveBeenCalled();
  });
});