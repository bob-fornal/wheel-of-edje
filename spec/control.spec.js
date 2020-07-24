
const control = require('../public/js/control');
const win = require('./helpers/window.helper');

describe('control', () => {
  let window;

  beforeEach(() => {
    win.init();
    window = win.mock;

    control.reset();
  });

  it('expects control to contain ...', () => {
    expect(control.bc).toBeNull();
    expect(control.getMessage).toEqual(jasmine.any(Object));

    expect(control.init).toEqual(jasmine.any(Function));
    expect(control.postMessage).toEqual(jasmine.any(Function));
    expect(control.getMessage.fromSpinner).toEqual(jasmine.any(Function));
    expect(control.getMessage.fromControl).toEqual(jasmine.any(Function));
    
    expect(control.trigger).toEqual(jasmine.any(Object));
    expect(control.trigger.spinClockwise).toEqual(jasmine.any(Function));
    expect(control.trigger.spinCounterClockwise).toEqual(jasmine.any(Function));
    expect(control.trigger.handleWinner).toEqual(jasmine.any(Function));
    expect(control.trigger.closeWinner).toEqual(jasmine.any(Function));
    expect(control.trigger.setSound).toEqual(jasmine.any(Function));
    expect(control.trigger.selectIndividual).toEqual(jasmine.any(Function));
    expect(control.trigger.seePrizes).toEqual(jasmine.any(Function));
    expect(control.trigger.removeIndividual).toEqual(jasmine.any(Function));
    expect(control.trigger.panelRefresh).toEqual(jasmine.any(Function));

    expect(control.spinner).toEqual(jasmine.any(Object));
    expect(control.spinner.disableControl).toEqual(jasmine.any(Function));
    expect(control.spinner.spin).toEqual(jasmine.any(Function));
    expect(control.spinner.winnerDisplay).toEqual(jasmine.any(Function));
    expect(control.spinner.closeWinner).toEqual(jasmine.any(Function));
    expect(control.spinner.setSound).toEqual(jasmine.any(Function));
    expect(control.spinner.selectIndividual).toEqual(jasmine.any(Function));
    expect(control.spinner.seePrizes).toEqual(jasmine.any(Function));
    expect(control.spinner.removeIndividual).toEqual(jasmine.any(Function));
    expect(control.spinner.panelRefresh).toEqual(jasmine.any(Function));
  });

  it('expects "init" to initialize broadcast for control', () => {
    const type = 'control';
    spyOn(control, 'postMessage').and.stub();

    control.init(type, window);
    expect(control.bc).toEqual(jasmine.any(Object));
    expect(control.bc.onmessage).toEqual(jasmine.any(Function));
    expect(control.postMessage).toHaveBeenCalledWith({ command: 'control.init' });
  });

  it('expects "init" to initialize broadcast for spinner', () => {
    const type = 'spinner';
    spyOn(control, 'postMessage').and.stub();

    control.init(type, window);
    expect(control.bc).toEqual(jasmine.any(Object));
    expect(control.bc.onmessage).toEqual(jasmine.any(Function));
    expect(control.postMessage).toHaveBeenCalledWith({ command: 'spinner.init' });
  });
});