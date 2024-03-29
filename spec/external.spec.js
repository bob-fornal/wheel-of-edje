const external = require('../public/js/external');
const doc = require('./helpers/document.helper');
const ctrl = require('./helpers/control.helper');
const store = require('./helpers/storage.helper');
const pr = require('./helpers/peer.helper');

describe('external', () => {
  let document, control, storage, peer;

  beforeEach(() => {
    external.reset();

    ctrl.init();
    control = ctrl.mock;

    store.init();
    storage = store.mock;

    pr.init();
    peer = pr.mock;

    doc.init();
    document = doc.mock;
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
    expect(external.updateWinnerModals).toEqual(jasmine.any(Function));
    expect(external.updateWinner).toEqual(jasmine.any(Function));
    expect(external.updateWinnerIndividual).toEqual(jasmine.any(Function));
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

  it('expects "updateDisplay" to show everything', () => {
    spyOn(external, 'showActiveSound').and.stub();
    spyOn(external, 'showGroup').and.stub();
    spyOn(external, 'showPanels').and.stub();

    external.updateDisplay();
    expect(external.showActiveSound).toHaveBeenCalled();
    expect(external.showGroup).toHaveBeenCalled();
    expect(external.showPanels).toHaveBeenCalled();
  });

  it('expects "triggerSpin" to pass control clockwise and show spinning', () => {
    spyOn(control.trigger, 'spinClockwise').and.stub();
    spyOn(control.trigger, 'spinCounterClockwise').and.stub();
    spyOn(external, 'showSpinning').and.stub();

    external.triggerSpin('clockwise', control);
    expect(control.trigger.spinClockwise).toHaveBeenCalled();
    expect(control.trigger.spinCounterClockwise).not.toHaveBeenCalled();
    expect(external.showSpinning).toHaveBeenCalled();
  });

  it('expects "triggerSpin" to pass control counter-clockwise and show spinning', () => {
    spyOn(control.trigger, 'spinClockwise').and.stub();
    spyOn(control.trigger, 'spinCounterClockwise').and.stub();
    spyOn(external, 'showSpinning').and.stub();

    external.triggerSpin('counter-clockwise', control);
    expect(control.trigger.spinClockwise).not.toHaveBeenCalled();
    expect(control.trigger.spinCounterClockwise).toHaveBeenCalled();
    expect(external.showSpinning).toHaveBeenCalled();
  });

  it('expects "showSpinning" to change hidden state for elements', () => {
    external.showSpinning(document);
    const wrapper = document.getElement('.modal-wrapper');
    const spinning = document.getElement('.modal-wrapper .modal-spinning');
    const winner = document.getElement('.modal-wrapper .modal-winner');
    expect(wrapper.classList.list.includes('hidden')).toEqual(false);
    expect(spinning.classList.list.includes('hidden')).toEqual(false);
    expect(winner.classList.list.includes('hidden')).toEqual(true);
  });

  it('expects "showActiveSound" to set the classes correctly for metronome', () => {
    const sound = 'metronome';
    external.activeSound = sound;

    external.showActiveSound(document);
    const metronomeElement = document.getElement('#metronome');
    const zippoElement = document.getElement('#zippo');
    const silentElement = document.getElement('#SILENT');
    expect(metronomeElement.classList.list.includes('selected')).toEqual(true);
    expect(zippoElement.classList.list.includes('selected')).toEqual(false);
    expect(silentElement.classList.list.includes('selected')).toEqual(false);
  });

  it('expects "showActiveSound" to set the classes correctly for zippo', () => {
    const sound = 'zippo';
    external.activeSound = sound;

    external.showActiveSound(document);
    const metronomeElement = document.getElement('#metronome');
    const zippoElement = document.getElement('#zippo');
    const silentElement = document.getElement('#SILENT');
    expect(metronomeElement.classList.list.includes('selected')).toEqual(false);
    expect(zippoElement.classList.list.includes('selected')).toEqual(true);
    expect(silentElement.classList.list.includes('selected')).toEqual(false);
  });

  it('expects "showActiveSound" to set the classes correctly for SILENT', () => {
    const sound = 'SILENT';
    external.activeSound = sound;

    external.showActiveSound(document);
    const metronomeElement = document.getElement('#metronome');
    const zippoElement = document.getElement('#zippo');
    const silentElement = document.getElement('#SILENT');
    expect(metronomeElement.classList.list.includes('selected')).toEqual(false);
    expect(zippoElement.classList.list.includes('selected')).toEqual(false);
    expect(silentElement.classList.list.includes('selected')).toEqual(true);
  });

  it('expects "addSpinButtons" to add the enabled and disabled versions', () => {
    const index = 0;
    const type = 'clockwise';

    external.addSpinButtons(index, type, document);
    const spinBtn = document.getElement('UNDEFINED-0');
    const disabled = document.getElement('UNDEFINED-1');
    const enabled = document.getElement('UNDEFINED-2');
    expect(spinBtn.classList.list.includes('spin')).toEqual(true);
    expect(spinBtn.classList.list.includes(type)).toEqual(true);
    expect(spinBtn.attributes.index).toEqual(index);
    expect(disabled.classList.list.includes('img-disabled')).toEqual(true);
    expect(disabled.src).toEqual('images/clockwise-disabled.png');
    expect(enabled.classList.list.includes('img-enabled')).toEqual(true);
    expect(enabled.attributes.onClick).toEqual('external.triggerSpin(\'clockwise\')');
    expect(enabled.src).toEqual('images/clockwise.png');
  });

  it('expects "addGroupButtons" to add enable and disable buttons', () => {
    const node = { appendChild: () => {} };
    const individual = { enabled: true, prize: null };
    const index = 1;
    spyOn(external, 'addSpinButtons').and.stub();

    external.addGroupButtons(node, individual, index, document);
    const enableBtn = document.getElement('UNDEFINED-0');
    const disableBtn = document.getElement('UNDEFINED-1');
    expect(enableBtn.classList.list.includes('button')).toEqual(true);
    expect(enableBtn.classList.list.includes('single')).toEqual(true);
    expect(enableBtn.classList.list.includes('white')).toEqual(true);
    expect(enableBtn.classList.list.includes('enable')).toEqual(true);
    expect(enableBtn.classList.list.includes('w100')).toEqual(true);
    expect(enableBtn.innerText).toEqual('Enable');
    expect(enableBtn.attributes.index).toEqual(index);
    expect(enableBtn.onclick).toEqual(jasmine.any(Function));
    expect(disableBtn.classList.list.includes('button')).toEqual(true);
    expect(disableBtn.classList.list.includes('single')).toEqual(true);
    expect(disableBtn.classList.list.includes('green')).toEqual(true);
    expect(disableBtn.classList.list.includes('disable')).toEqual(true);
    expect(disableBtn.classList.list.includes('w100')).toEqual(true);
    expect(disableBtn.innerText).toEqual('Disable');
    expect(disableBtn.attributes.index).toEqual(index);
    expect(disableBtn.onclick).toEqual(jasmine.any(Function));
  });

  it('expects "addGroupButtons" to add a selector button', () => {
    const node = { appendChild: () => {} };
    const individual = { enabled: true, prize: null };
    const index = 2;
    spyOn(external, 'addSpinButtons').and.stub();

    external.addGroupButtons(node, individual, index, document);
    const selectorBtn = document.getElement('UNDEFINED-2');
    expect(selectorBtn.classList.list.includes('button')).toEqual(true);
    expect(selectorBtn.classList.list.includes('single')).toEqual(true);
    expect(selectorBtn.classList.list.includes('orange')).toEqual(true);
    expect(selectorBtn.classList.list.includes('selector')).toEqual(true);
    expect(selectorBtn.classList.list.includes('w100')).toEqual(true);
    expect(selectorBtn.innerText).toEqual('Select');
    expect(selectorBtn.attributes.index).toEqual(index);
    expect(selectorBtn.onclick).toEqual(jasmine.any(Function));
  });

  it('expects "addGroupButtons" to generate CW and CCW spin buttons', () => {
    const node = { appendChild: () => {} };
    const individual = { enabled: true, prize: null };
    const index = 3;
    spyOn(external, 'addSpinButtons').and.stub();

    external.addGroupButtons(node, individual, index, document);
    expect(external.addSpinButtons).toHaveBeenCalledWith(index, 'clockwise');
    expect(external.addSpinButtons).toHaveBeenCalledWith(index, 'counter-clockwise');
  });

  it('expects "addGroupButtons" to generate a no buttons container', () => {
    const node = { appendChild: () => {} };
    const individual = { enabled: true, prize: null };
    const index = 4;
    spyOn(external, 'addSpinButtons').and.stub();

    external.addGroupButtons(node, individual, index, document);
    const noButtonsContainer = document.getElement('UNDEFINED-3');
    expect(noButtonsContainer.classList.list.includes('no-buttons')).toEqual(true);
    expect(noButtonsContainer.innerText).toEqual('.');
  });

  it('expects "addGroupButtons" to set state when individual enabled is true', () => {
    const node = { appendChild: () => {} };
    const individual = { enabled: true, prize: null };
    const index = 4;
    spyOn(external, 'addSpinButtons').and.stub();

    external.addGroupButtons(node, individual, index, document);
    const enableBtn = document.getElement('UNDEFINED-0');
    const disableBtn = document.getElement('UNDEFINED-1');
    const selectorBtn = document.getElement('UNDEFINED-2');
    expect(enableBtn.classList.list.includes('hidden')).toEqual(true);
    expect(disableBtn.classList.list.includes('hidden')).toEqual(false);
    expect(selectorBtn.classList.list.includes('hidden')).toEqual(false);
  });

  it('expects "addGroupButtons" to set state when individual enabled is false', () => {
    const node = { appendChild: () => {} };
    const individual = { enabled: false, prize: null };
    const index = 4;
    spyOn(external, 'addSpinButtons').and.stub();

    external.addGroupButtons(node, individual, index, document);
    const enableBtn = document.getElement('UNDEFINED-0');
    const disableBtn = document.getElement('UNDEFINED-1');
    const selectorBtn = document.getElement('UNDEFINED-2');
    expect(enableBtn.classList.list.includes('hidden')).toEqual(false);
    expect(disableBtn.classList.list.includes('hidden')).toEqual(true);
    expect(selectorBtn.classList.list.includes('hidden')).toEqual(true);
  });

  it('expects "addGroupButtons" to set state when individual prize is null', () => {
    const node = { appendChild: () => {} };
    const individual = { enabled: true, prize: null };
    const index = 4;
    spyOn(external, 'addSpinButtons').and.stub();

    external.addGroupButtons(node, individual, index, document);
    const enableBtn = document.getElement('UNDEFINED-0');
    const disableBtn = document.getElement('UNDEFINED-1');
    const selectorBtn = document.getElement('UNDEFINED-2');
    const noButtonsContainer = document.getElement('UNDEFINED-3');
    expect(enableBtn.classList.list.includes('hidden')).toEqual(true);
    expect(disableBtn.classList.list.includes('hidden')).toEqual(false);
    expect(selectorBtn.classList.list.includes('hidden')).toEqual(false);
    expect(noButtonsContainer.classList.list.includes('hidden')).toEqual(true);
  });


  it('expects "addGroupButtons" to set state when individual prize is not null', () => {
    const node = { appendChild: () => {} };
    const individual = { enabled: true, prize: 'prize' };
    const index = 4;
    const mockBtn = { classList: { add: () => {} } };
    spyOn(external, 'addSpinButtons').and.returnValue(mockBtn);

    external.addGroupButtons(node, individual, index, document);
    const enableBtn = document.getElement('UNDEFINED-0');
    const disableBtn = document.getElement('UNDEFINED-1');
    const selectorBtn = document.getElement('UNDEFINED-2');
    const noButtonsContainer = document.getElement('UNDEFINED-3');
    expect(enableBtn.classList.list.includes('hidden')).toEqual(true);
    expect(disableBtn.classList.list.includes('hidden')).toEqual(true);
    expect(selectorBtn.classList.list.includes('hidden')).toEqual(true);
    expect(noButtonsContainer.classList.list.includes('hidden')).toEqual(false);
  });

  it('expects "calculateDisplayName" to handle name with no prize', () => {
    const individual = { name: 'Bob', prize: null, additional: null };

    const result = external.calculateDisplayName(individual);
    expect(result).toEqual('Bob (No Prize)');
  });

  it('expects "calculateDisplayName" to handle name with prize, no additional', () => {
    const individual = { name: 'Bob', prize: 'prize', additional: '' };

    const result = external.calculateDisplayName(individual);
    expect(result).toEqual('Bob (prize)');
  });

  it('expects "calculateDisplayName" to handle name with prize and additional', () => {
    const individual = { name: 'Bob', prize: 'prize', additional: 'additional' };

    const result = external.calculateDisplayName(individual);
    expect(result).toEqual('Bob (prize, additional)');
  });

  it('expects "addIndividual" to create an element for an individual', () => {
    const node = { appendChild: () => {} };
    const individual = {};
    const index = 5;
    spyOn(external, 'calculateDisplayName').and.returnValue('Bob-5');

    external.addIndividual(node, individual, index, document);
    const element = document.getElement('UNDEFINED-0');
    expect(element.classList.list.includes('individual')).toEqual(true);
    expect(element.innerText).toEqual('Bob-5');
    expect(element.attributes.index).toEqual(index);
    expect(element.onclick).toEqual(jasmine.any(Function));
  });

  it('expects "handleEnableBtn" to set state appropriately', () => {
    const index = '6';
    const event = { target: { getAttribute: () => index } };
    external.group = [0, 1, 2, 3, 4, 5, { name: 'Bob-6', enabled: true }];
    spyOn(storage, 'saveGroup').and.stub();

    external.handleEnableBtn(event, document, storage);
    const enableBtn = document.getElement('.group [index="6"] .button.enable');
    const disableBtn = document.getElement('.group [index="6"] .button.disable');
    const selectionBtn = document.getElement('.group [index="6"] .button.selector');
    expect(enableBtn.classList.list.includes('hidden')).toEqual(true);
    expect(disableBtn.classList.list.includes('hidden')).toEqual(false);
    expect(selectionBtn.classList.list.includes('hidden')).toEqual(false);
    expect(external.group[6].enabled).toEqual(true);
    expect(storage.saveGroup).toHaveBeenCalled();
  });

  it('expects "handleDisableBtn" to set state appropriately', () => {
    const index = '7';
    const event = { target: { getAttribute: () => index } };
    external.group = [0, 1, 2, 3, 4, 5, 6, { name: 'Bob-7', enabled: true }];
    spyOn(external, 'handleDeselection').and.stub();
    spyOn(storage, 'saveGroup').and.stub();

    external.handleDisableBtn(event, document, storage);
    const enableBtn = document.getElement('.group [index="7"] .button.enable');
    const disableBtn = document.getElement('.group [index="7"] .button.disable');
    const selectionBtn = document.getElement('.group [index="7"] .button.selector');
    expect(enableBtn.classList.list.includes('hidden')).toEqual(false);
    expect(disableBtn.classList.list.includes('hidden')).toEqual(true);
    expect(selectionBtn.classList.list.includes('hidden')).toEqual(true);
    expect(external.handleDeselection).toHaveBeenCalledWith(+index);
    expect(external.group[7].enabled).toEqual(false);
    expect(storage.saveGroup).toHaveBeenCalled();
  });

  it('expects "handleDeselection" to clear all selected', () => {
    const index = 8;
    let selectionCount = 0;
    const selections = [0, 1, 2, 3, 4, 5, 6, 7, {
      classList: { remove: () => { selectionCount++; } }
    }];
    let individualCount = 0;
    const individuals = [0, 1, 2, 3, 4, 5, 6, 7, {
      classList: { remove: () => { individualCount++; } }
    }];
    let countSpins = 0;
    const spins = [
      { classList: { remove: () => { countSpins++; } } },
      { classList: { remove: () => { countSpins++; } } },
      { classList: { remove: () => { countSpins++; } } },
      { classList: { remove: () => { countSpins++; } } },
      { classList: { remove: () => { countSpins++; } } },
      { classList: { remove: () => { countSpins++; } } },
      { classList: { remove: () => { countSpins++; } } },
      { classList: { remove: () => { countSpins++; } } },
      { classList: { remove: () => { countSpins++; } } }
    ];
    document.configurationFn = (type) => {
      let result = null;
      switch(true) {
        case (type === '.group .button.selector'):
          result = selections;
          break;
        case (type === '.group .individual'):
          result = individuals;
          break;
        case (type === '.group [index="8"] .spin'):
          result = spins;
          break;
      }
      return result;
    };
    spyOn(control.trigger, 'removeIndividual').and.stub();

    external.handleDeselection(index, control, document);
    expect(selectionCount).toEqual(1);
    expect(individualCount).toEqual(1);
    expect(countSpins).toEqual(9);
    expect(control.trigger.removeIndividual).toHaveBeenCalled();
  });

  it('expects "handleSelection" to take a number and process state', () => {
    const event = 0;
    let countSelectAdd = 0;
    let countSelectRemove = 0;
    const selections = [{
      classList: { add: () => { countSelectAdd++; }, remove: () => { countSelectRemove++; } }
    },{
      classList: { add: () => { countSelectAdd++; }, remove: () => { countSelectRemove++; } }
    },{
      classList: { add: () => { countSelectAdd++; }, remove: () => { countSelectRemove++; } }
    }];
    let countIndividualAdd = 0;
    let countIndividualRemove = 0;
    const individuals = [{
      classList: { add: () => { countIndividualAdd++; }, remove: () => { countIndividualRemove++; } }
    },{
      classList: { add: () => { countIndividualAdd++; }, remove: () => { countIndividualRemove++; } }
    },{
      classList: { add: () => { countIndividualAdd++; }, remove: () => { countIndividualRemove++; } }
    }];
    let countSpinAdd = 0;
    let countSpinRemove = 0;
    const spins = [{
      classList: { add: () => { countSpinAdd++; }, remove: () => { countSpinRemove++; } },
      getAttribute: () => '0'
    },{
      classList: { add: () => { countSpinAdd++; }, remove: () => { countSpinRemove++; } },
      getAttribute: () => '1'
    },{
      classList: { add: () => { countSpinAdd++; }, remove: () => { countSpinRemove++; } },
      getAttribute: () => '2'
    }];
    document.configurationFn = (type) => {
      let result = null;
      switch(true) {
        case (type === '.group .button.selector'):
          result = selections;
          break;
        case (type === '.group .individual'):
          result = individuals;
          break;
        case (type === '.group .spin'):
          result = spins;
          break;
      }
      return result;
    };
    spyOn(external, 'handleDeselection').and.stub();
    spyOn(control.trigger, 'selectIndividual').and.stub();

    external.handleSelection(event, control, document);
    expect(external.handleDeselection).not.toHaveBeenCalled();
    expect(countSelectAdd).toEqual(1);
    expect(countSelectRemove).toEqual(2);
    expect(countIndividualAdd).toEqual(1);
    expect(countIndividualRemove).toEqual(2);
    expect(countSpinAdd).toEqual(1);
    expect(countSpinRemove).toEqual(2);
    expect(control.trigger.selectIndividual).toHaveBeenCalledWith(0);
  });

  it('expects "handleSelection" to take an event and process state', () => {
    const event = { target: {
      classList: { contains: () => false },
      getAttribute: () => '1' }
    };
    let countSelectAdd = 0;
    let countSelectRemove = 0;
    const selections = [{
      classList: { add: () => { countSelectAdd++; }, remove: () => { countSelectRemove++; } }
    },{
      classList: { add: () => { countSelectAdd++; }, remove: () => { countSelectRemove++; } }
    },{
      classList: { add: () => { countSelectAdd++; }, remove: () => { countSelectRemove++; } }
    }];
    let countIndividualAdd = 0;
    let countIndividualRemove = 0;
    const individuals = [{
      classList: { add: () => { countIndividualAdd++; }, remove: () => { countIndividualRemove++; } }
    },{
      classList: { add: () => { countIndividualAdd++; }, remove: () => { countIndividualRemove++; } }
    },{
      classList: { add: () => { countIndividualAdd++; }, remove: () => { countIndividualRemove++; } }
    }];
    let countSpinAdd = 0;
    let countSpinRemove = 0;
    const spins = [{
      classList: { add: () => { countSpinAdd++; }, remove: () => { countSpinRemove++; } },
      getAttribute: () => '0'
    },{
      classList: { add: () => { countSpinAdd++; }, remove: () => { countSpinRemove++; } },
      getAttribute: () => '1'
    },{
      classList: { add: () => { countSpinAdd++; }, remove: () => { countSpinRemove++; } },
      getAttribute: () => '2'
    }];
    document.configurationFn = (type) => {
      let result = null;
      switch(true) {
        case (type === '.group .button.selector'):
          result = selections;
          break;
        case (type === '.group .individual'):
          result = individuals;
          break;
        case (type === '.group .spin'):
          result = spins;
          break;
      }
      return result;
    };
    spyOn(external, 'handleDeselection').and.stub();
    spyOn(control.trigger, 'selectIndividual').and.stub();

    external.handleSelection(event, control, document);
    expect(external.handleDeselection).not.toHaveBeenCalled();
    expect(countSelectAdd).toEqual(1);
    expect(countSelectRemove).toEqual(2);
    expect(countIndividualAdd).toEqual(1);
    expect(countIndividualRemove).toEqual(2);
    expect(countSpinAdd).toEqual(1);
    expect(countSpinRemove).toEqual(2);
    expect(control.trigger.selectIndividual).toHaveBeenCalledWith(1);
  });

  it('expects "handleSelection" to take a selected event and deselect', () => {
    const event = { target: {
      classList: { contains: () => true },
      getAttribute: () => '1' }
    };
    let countSelectAdd = 0;
    let countSelectRemove = 0;
    const selections = [{
      classList: { add: () => { countSelectAdd++; }, remove: () => { countSelectRemove++; } }
    },{
      classList: { add: () => { countSelectAdd++; }, remove: () => { countSelectRemove++; } }
    },{
      classList: { add: () => { countSelectAdd++; }, remove: () => { countSelectRemove++; } }
    }];
    let countIndividualAdd = 0;
    let countIndividualRemove = 0;
    const individuals = [{
      classList: { add: () => { countIndividualAdd++; }, remove: () => { countIndividualRemove++; } }
    },{
      classList: { add: () => { countIndividualAdd++; }, remove: () => { countIndividualRemove++; } }
    },{
      classList: { add: () => { countIndividualAdd++; }, remove: () => { countIndividualRemove++; } }
    }];
    let countSpinAdd = 0;
    let countSpinRemove = 0;
    const spins = [{
      classList: { add: () => { countSpinAdd++; }, remove: () => { countSpinRemove++; } },
      getAttribute: () => '0'
    },{
      classList: { add: () => { countSpinAdd++; }, remove: () => { countSpinRemove++; } },
      getAttribute: () => '1'
    },{
      classList: { add: () => { countSpinAdd++; }, remove: () => { countSpinRemove++; } },
      getAttribute: () => '2'
    }];
    document.configurationFn = (type) => {
      let result = null;
      switch(true) {
        case (type === '.group .button.selector'):
          result = selections;
          break;
        case (type === '.group .individual'):
          result = individuals;
          break;
        case (type === '.group .spin'):
          result = spins;
          break;
      }
      return result;
    };
    spyOn(external, 'handleDeselection').and.stub();
    spyOn(control.trigger, 'selectIndividual').and.stub();

    external.handleSelection(event, control, document);
    expect(external.handleDeselection).toHaveBeenCalled();
    expect(countSelectAdd).toEqual(0);
    expect(countSelectRemove).toEqual(0);
    expect(countIndividualAdd).toEqual(0);
    expect(countIndividualRemove).toEqual(0);
    expect(countSpinAdd).toEqual(0);
    expect(countSpinRemove).toEqual(0);
    expect(control.trigger.selectIndividual).not.toHaveBeenCalled();
  });

  it('expects "showGroup" to reset HTML and add a row for each individual', () => {
    const group = [1, 2];
    spyOn(storage, 'getGroup').and.returnValue(group);
    spyOn(external, 'addGroupButtons').and.stub();
    spyOn(external, 'addIndividual').and.stub();

    external.showGroup(storage, document);
    const node = document.getElement('.group .content');
    const row1 = document.getElement('UNDEFINED-0');
    const row2 = document.getElement('UNDEFINED-1');
    expect(node.innerHTML).toEqual('');
    expect(row1.classList.list.includes('row'));
    expect(row1.attributes.index).toEqual(0);
    expect(row2.classList.list.includes('row'));
    expect(row2.attributes.index).toEqual(1);
    expect(external.addGroupButtons).toHaveBeenCalledTimes(2);
    expect(external.addIndividual).toHaveBeenCalledTimes(2);
  });

  it('expects "updateWinnerModals" to switch visible modals', () => {
    external.updateWinnerModals(document);
    const spinning = document.getElement('.modal-wrapper .modal-spinning');
    const winner = document.getElement('.modal-wrapper .modal-winner');
    expect(spinning.classList.list.includes('hidden')).toEqual(true);
    expect(winner.classList.list.includes('hidden')).toEqual(false);
  });

  it('expects "updateWinner" to set text with additional', () => {
    const person = { name: 'Bob', prize: 'prize', additional: 'additional' };
    
    external.updateWinner(person, document);
    const individual = document.getElement('.individual-winner');
    const prize = document.getElement('.prize');
    const prizeAdditional = document.getElement('.prize-additional');
    expect(individual.innerText).toEqual('Bob');
    expect(prize.innerText).toEqual('prize');
    expect(prizeAdditional.innerText).toEqual('additional');
    expect(prizeAdditional.classList.list.includes('hidden')).toEqual(false);
  });

  it('expects "updateWinner" to set text without additional', () => {
    const person = { name: 'Bob', prize: 'prize', additional: '' };
    
    external.updateWinner(person, document);
    const individual = document.getElement('.individual-winner');
    const prize = document.getElement('.prize');
    const prizeAdditional = document.getElement('.prize-additional');
    expect(individual.innerText).toEqual('Bob');
    expect(prize.innerText).toEqual('prize');
    expect(prizeAdditional.innerText).not.toEqual('additional');
    expect(prizeAdditional.classList.list.includes('hidden')).toEqual(true);
  });

  it('expects "updateWinnerIndividual" to set name and update button states', () => {
    const index = 0;
    const person = {};
    let countButtonAdd = 0;
    let countButtonRemove = 0;
    const buttons = [{
      classList: { add: () => { countButtonAdd++; }, remove: () => { countButtonRemove++; } }
    },{
      classList: { add: () => { countButtonAdd++; }, remove: () => { countButtonRemove++; } }
    },{
      classList: { add: () => { countButtonAdd++; }, remove: () => { countButtonRemove++; } }
    }];
    let countSpinAdd = 0;
    let countSpinRemove = 0;
    const spins = [{
      classList: { add: () => { countSpinAdd++; }, remove: () => { countSpinRemove++; } }
    },{
      classList: { add: () => { countSpinAdd++; }, remove: () => { countSpinRemove++; } }
    },{
      classList: { add: () => { countSpinAdd++; }, remove: () => { countSpinRemove++; } }
    }];
    document.configurationFn = (type) => {
      let result = null;
      switch(true) {
        case (type === '.group [index="0"] .button'):
          result = buttons;
          break;
        case (type === '.group [index="0"] .spin'):
          result = spins;
          break;
      }
      return result;
    };
    spyOn(external, 'calculateDisplayName').and.returnValue('Bob');

    external.updateWinnerIndividual(index, person, document);
    const selected = document.getElement('.group [index="0"] .individual');
    const noButtons = document.getElement('.group [index="0"] .no-buttons');
    expect(selected.classList.list.includes('selected')).toEqual(false);
    expect(selected.classList.list.includes('remote-selection')).toEqual(false);
    expect(selected.innerText).toEqual('Bob');
    expect(countButtonAdd).toEqual(3);
    expect(countButtonRemove).toEqual(3);
    expect(countSpinAdd).toEqual(3);
    expect(countSpinRemove).toEqual(0);
    expect(noButtons.classList.list.includes('hidden')).toEqual(false);
  });

  it('expects "showWinner" to get group and set state', () => {
    const index = 0;
    const group = [{ name: 'Bob' }];
    spyOn(storage, 'getGroup').and.returnValue(group);
    spyOn(external, 'updateWinnerModals').and.stub();
    spyOn(external, 'updateWinner').and.stub();
    spyOn(external, 'updateWinnerIndividual').and.stub();

    external.showWinner(index, storage);
    expect(storage.getGroup).toHaveBeenCalled();
    expect(external.updateWinnerModals).toHaveBeenCalled();
    expect(external.updateWinner).toHaveBeenCalled();
    expect(external.updateWinnerIndividual).toHaveBeenCalled();
  });

  it('expects "hideWinner" to set state appropriately', () => {
    external.hideWinner(document);
    const wrapper = document.getElement('.modal-wrapper');
    const spinning = document.getElement('.modal-wrapper .modal-spinning');
    const winner = document.getElement('.modal-wrapper .modal-winner');
    const prizeAdditional = document.getElement('.prize-additional');
    expect(wrapper.classList.list.includes('hidden')).toEqual(true);
    expect(spinning.classList.list.includes('hidden')).toEqual(false);
    expect(winner.classList.list.includes('hidden')).toEqual(true);
    expect(prizeAdditional.classList.list.includes('hidden')).toEqual(true);
  });

  it('expects "closeWinner" to initiate close throughout the systems', () => {
    spyOn(peer, 'closeWinner').and.stub();
    spyOn(control.trigger, 'closeWinner').and.stub();
    spyOn(external, 'hideWinner').and.stub();

    external.closeWinner(peer, control);
    expect(peer.closeWinner).toHaveBeenCalled();
    expect(control.trigger.closeWinner).toHaveBeenCalled();
    expect(external.hideWinner).toHaveBeenCalled();
  });

  it('expects "setSound" to set, show, and save the active sound', () => {
    const sound = 'sound';
    external.activeSound = '';
    spyOn(external, 'showActiveSound').and.stub();
    spyOn(storage, 'saveActiveSound').and.stub();
    spyOn(control.trigger, 'setSound').and.stub();

    external.setSound(sound, control, storage);
    expect(external.activeSound).toEqual(sound);
    expect(external.showActiveSound).toHaveBeenCalled();
    expect(storage.saveActiveSound).toHaveBeenCalled();
    expect(control.trigger.setSound).toHaveBeenCalled();
  });

  it('expects "triggerSeePrizes" to call control trigger', () => {
    spyOn(control.trigger, 'seePrizes').and.stub();

    external.triggerSeePrizes(control);
    expect(control.trigger.seePrizes).toHaveBeenCalled();
  });

  it('expects "triggerSeePeerLink" to call control trigger', () => {
    spyOn(control.trigger, 'seePeerLink').and.stub();

    external.triggerSeePeerLink(control);
    expect(control.trigger.seePeerLink).toHaveBeenCalled();
  });
});