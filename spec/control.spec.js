
const control = require('../public/js/control');
const win = require('./helpers/window.helper');
const ext = require('./helpers/external.helper');
const mnu = require('./helpers/menu.helper');
const spin = require('./helpers/spinner.helper');
const wnr = require('./helpers/winner.helper');
const doc = require('./helpers/document.helper');

describe('control', () => {
  let winner, spinner, menu, document, external, window;

  beforeEach(() => {
    win.init();
    window = win.mock;

    ext.init();
    external = ext.mock;

    mnu.init();
    menu = mnu.mock;

    spin.init();
    spinner = spin.mock;

    wnr.init();
    winner = wnr.mock;

    doc.init();
    document = doc.mock;

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

  it('expects "postMessage" to use broadcast channel to post message', () => {
    const type = 'control';
    const message = 'message';
    control.init(type, window);
    spyOn(control.bc, 'postMessage').and.stub();

    control.postMessage(message);
    expect(control.bc.postMessage).toHaveBeenCalledWith(message);
  });

  describe('getMessage', () => {
    it('expects "fromSpinner" to process winner display active', () => {
      const data = 'Prize';
      const message = { data: {
        command: 'spinner.winner-display-active',
        data: data
      } };
      spyOn(control.trigger, 'handleWinner').and.stub();
  
      control.getMessage.fromSpinner(message);
      expect(control.trigger.handleWinner).toHaveBeenCalledWith(data);
    });

    it('expects "fromControl" to process init', () => {
      const data = '';
      const message = { data: {
        command: 'control.init',
        data: data
      } };
      spyOn(control.spinner, 'disableControl').and.stub();

      control.getMessage.fromControl(message);
      expect(control.spinner.disableControl).toHaveBeenCalled();
    });

    it('expects "fromControl" to process spin clockwise', () => {
      const data = '';
      const message = { data: {
        command: 'control.spin-clockwise',
        data: data
      } };
      spyOn(control.spinner, 'spin').and.stub();

      control.getMessage.fromControl(message);
      expect(control.spinner.spin).toHaveBeenCalledWith('clockwise');
    });

    it('expects "fromControl" to process spin counter-clockwise', () => {
      const data = '';
      const message = { data: {
        command: 'control.spin-counter-clockwise',
        data: data
      } };
      spyOn(control.spinner, 'spin').and.stub();

      control.getMessage.fromControl(message);
      expect(control.spinner.spin).toHaveBeenCalledWith('counter-clockwise');
    });

    it('expects "fromControl" to process close winner', () => {
      const data = '';
      const message = { data: {
        command: 'control.close-winner',
        data: data
      } };
      spyOn(control.spinner, 'closeWinner').and.stub();

      control.getMessage.fromControl(message);
      expect(control.spinner.closeWinner).toHaveBeenCalled();
    });

    it('expects "fromControl" to process set sound', () => {
      const data = 'SILENT';
      const message = { data: {
        command: 'control.set-sound',
        data: data
      } };
      spyOn(control.spinner, 'setSound').and.stub();

      control.getMessage.fromControl(message);
      expect(control.spinner.setSound).toHaveBeenCalledWith(data);
    });

    it('expects "fromControl" to process select individual', () => {
      const data = 'individual';
      const message = { data: {
        command: 'control.select-individual',
        data: data
      } };
      spyOn(control.spinner, 'selectIndividual').and.stub();

      control.getMessage.fromControl(message);
      expect(control.spinner.selectIndividual).toHaveBeenCalledWith(data);
    });

    it('expects "fromControl" to process see prizes', () => {
      const data = '';
      const message = { data: {
        command: 'control.see-prizes',
        data: data
      } };
      spyOn(control.spinner, 'seePrizes').and.stub();

      control.getMessage.fromControl(message);
      expect(control.spinner.seePrizes).toHaveBeenCalled();
    });

    it('expects "fromControl" to process remove individual', () => {
      const data = '';
      const message = { data: {
        command: 'control.remove-individual',
        data: data
      } };
      spyOn(control.spinner, 'removeIndividual').and.stub();

      control.getMessage.fromControl(message);
      expect(control.spinner.removeIndividual).toHaveBeenCalled();
    });

    it('expects "fromControl" to process panel refresh', () => {
      const data = '';
      const message = { data: {
        command: 'control.panel-refresh',
        data: data
      } };
      spyOn(control.spinner, 'panelRefresh').and.stub();

      control.getMessage.fromControl(message);
      expect(control.spinner.panelRefresh).toHaveBeenCalled();
    });
  });

  describe('trigger', () => {
    it('expects "spinClockwise" to post appropriate message', () => {
      spyOn(control, 'postMessage').and.stub();

      control.trigger.spinClockwise();
      expect(control.postMessage).toHaveBeenCalledWith({ command: 'control.spin-clockwise' });
    });

    it('expects "spinCounterClockwise" to post appropriate message', () => {
      spyOn(control, 'postMessage').and.stub();

      control.trigger.spinCounterClockwise();
      expect(control.postMessage).toHaveBeenCalledWith({ command: 'control.spin-counter-clockwise' });
    });

    it('expects "handleWinner" to pass the index to show winner', () => {
      const index = 0;
      spyOn(external, 'showWinner').and.stub();

      control.trigger.handleWinner(index, external);
      expect(external.showWinner).toHaveBeenCalledWith(index);
    });

    it('expects "closeWinner" to post appropriate message', () => {
      spyOn(control, 'postMessage').and.stub();

      control.trigger.closeWinner();
      expect(control.postMessage).toHaveBeenCalledWith({ command: 'control.close-winner' });
    });

    it('expects "setSound" to post appropriate message', () => {
      const sound = 'SILENT';
      spyOn(control, 'postMessage').and.stub();

      control.trigger.setSound(sound);
      expect(control.postMessage).toHaveBeenCalledWith({ command: 'control.set-sound', data: sound });
    });

    it('expects "selectIndividual" to post appropriate message', () => {
      const index = 2;
      spyOn(control, 'postMessage').and.stub();

      control.trigger.selectIndividual(index);
      expect(control.postMessage).toHaveBeenCalledWith({ command: 'control.select-individual', data: index });
    });

    it('expects "seePrizes" to post appropriate message', () => {
      spyOn(control, 'postMessage').and.stub();

      control.trigger.seePrizes();
      expect(control.postMessage).toHaveBeenCalledWith({ command: 'control.see-prizes' });
    });

    it('expects "removeIndividual" to post appropriate message', () => {
      spyOn(control, 'postMessage').and.stub();

      control.trigger.removeIndividual();
      expect(control.postMessage).toHaveBeenCalledWith({ command: 'control.remove-individual' });
    });

    it('expects "panelRefresh" to post appropriate message', () => {
      const index = 3;
      spyOn(control, 'postMessage').and.stub();

      control.trigger.panelRefresh(index);
      expect(control.postMessage).toHaveBeenCalledWith({ command: 'control.panel-refresh', data: index });
    });
  });

  describe('spinner', () => {
    it('expects "disableControl" to turn off menu and set external control on', () => {
      menu.state.externalControl = false;
      spyOn(menu, 'toggle').and.stub();

      control.spinner.disableControl(menu);
      expect(menu.state.externalControl).toEqual(true);
      expect(menu.toggle).toHaveBeenCalled();
    });

    it('expects "spin" to start the wheel spinning', () => {
      const direction = 'direction';
      spyOn(spinner, 'toggleSpin').and.stub();

      control.spinner.spin(direction, spinner);
      expect(spinner.toggleSpin).toHaveBeenCalledWith(direction);
    });

    it('expects "winnerDisplay" to pass the correct message', () => {
      const index = 4;
      spyOn(control, 'postMessage').and.stub();

      control.spinner.winnerDisplay(index);
      expect(control.postMessage).toHaveBeenCalledWith({ command: 'spinner.winner-display-active', data: index});
    });

    it('expect "closeWinner" to close the winner display', () => {
      spyOn(winner, 'close').and.stub();

      control.spinner.closeWinner(winner);
      expect(winner.close).toHaveBeenCalled();
    });

    it('expects "setSound" to change the spin state appropriately', () => {
      const sound = 'metronome';
      spinner.state.activeSound = 'SILENT';

      control.spinner.setSound(sound, spinner);
      expect(spinner.state.activeSound).toEqual(sound);
    });

    it('expects "selectIndividual" to set state and display the active person', () => {
      spinner.state.activePerson = null;
      spinner.state.activePersonIndex = -1;
      spinner.group = [
        { name: '1' },
        { name: '2' },
        { name: '3' },
        { name: '4' },
        { name: '5' },
        { name: '6' }
      ];
      const index = 5;
      spyOn(menu, 'displayActivePerson').and.stub();

      control.spinner.selectIndividual(index, spinner, menu);
      expect(spinner.state.activePerson).toEqual({ name: '6' });
      expect(spinner.state.activePersonIndex).toEqual(5);
      expect(menu.displayActivePerson).toHaveBeenCalled();
    });

    it('expects "seePrizes" to open prizes modal', () => {
      document.configurationFn = (element) => {
        element.classList.contains = () => true;
      };
      spyOn(menu, 'seePrizes').and.stub();
      spyOn(menu, 'closePrizes').and.stub();

      control.spinner.seePrizes(menu, document);
      expect(menu.seePrizes).toHaveBeenCalled();
      expect(menu.closePrizes).not.toHaveBeenCalled();
    });

    it('expects "removeIndividual" to clear the active person', () => {
      spyOn(menu, 'clearActivePerson').and.stub();

      control.spinner.removeIndividual(menu);
      expect(menu.clearActivePerson).toHaveBeenCalled();
    });

    it('expects "panelRefresh" to initialize the panel', () => {
      spyOn(spinner, 'init').and.stub();

      control.spinner.panelRefresh(spinner);
      expect(spinner.init).toHaveBeenCalled();
    });
  });
});