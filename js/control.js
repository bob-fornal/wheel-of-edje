
const control = {
  bc: null // broadcast channel
};

control.reset = () => {
  control.bc = null;
};

control.init = (type = 'control', win = window) => {
  control.bc = new win.BroadcastChannel('le-spinner-control');
  
  switch(type) {
    case 'control':
      control.bc.onmessage = control.getMessage.fromSpinner;
      control.postMessage({ command: 'control.init' });
      break;
    case 'spinner':
      control.bc.onmessage = control.getMessage.fromControl;
      control.postMessage({ command: 'spinner.init' });
  }
};

control.postMessage = (message) => {
  control.bc.postMessage(message);
};

control.getMessage = {};

control.getMessage.fromSpinner = (message) => {
  const option = message.data.command;
  const data = (typeof message.data.data !== undefined) ? message.data.data : {};

  switch(true) {
    case (option === 'spinner.winner-display-active'):
      control.trigger.handleWinner(data);
      break;
  }
};

control.trigger = {};

control.trigger.spinClockwise = () => {
  control.postMessage({ command: 'control.spin-clockwise' });
};

control.trigger.spinCounterClockwise = () => {
  control.postMessage({ command: 'control.spin-counter-clockwise' });
};

control.trigger.handleWinner = (index, ext = external) => {
  ext.showWinner(index);
};

control.trigger.closeWinner = () => {
  control.postMessage({ command: 'control.close-winner' });
};

control.trigger.setSound = (sound) => {
  control.postMessage({
    command: 'control.set-sound',
    data: sound
  });
};

control.trigger.selectIndividual = (index) => {
  control.postMessage({
    command: 'control.select-individual',
    data: index
  });
};

control.trigger.seePrizes = () => {
  control.postMessage({ command: 'control.see-prizes' });
};

control.trigger.seePeerLink = () => {
  control.postMessage({ command: 'control.see-peer-link' });
};

control.trigger.removeIndividual = () => {
  control.postMessage({ command: 'control.remove-individual' });
};

control.trigger.panelRefresh = (index) => {
  control.postMessage({
    command: 'control.panel-refresh',
    data: index
  });
};

control.getMessage.fromControl = (message) => {
  const option = message.data.command;
  const data = (typeof message.data.data !== undefined) ? message.data.data : {};

  switch(true) {
    case (option === 'control.init'):
      control.spinner.disableControl();
      break;
    case (option === 'control.spin-clockwise'):
      control.spinner.spin('clockwise');
      break;
    case (option === 'control.spin-counter-clockwise'):
      control.spinner.spin('counter-clockwise');
      break;
    case (option === 'control.close-winner'):
      control.spinner.closeWinner();
      break;
    case (option === 'control.set-sound'):
      control.spinner.setSound(data);
      break;
    case (option === 'control.select-individual'):
      control.spinner.selectIndividual(data);
      break;
    case (option === 'control.see-prizes'):
      control.spinner.seePrizes();
      break;
    case (option === 'control.see-peer-link'):
      control.spinner.seePeerLink();
      break;
    case (option === 'control.remove-individual'):
      control.spinner.removeIndividual();
      break;
    case (option === 'control.panel-refresh'):
      control.spinner.panelRefresh();
      break;
  }
};

control.spinner = {};

control.spinner.disableControl = (mnu = menu) => {
  mnu.toggle();
  mnu.state.externalControl = true;
};

control.spinner.spin = (direction, spin = spinner) => {
  spin.toggleSpin(direction);
};

control.spinner.winnerDisplay = (index) => {
  control.postMessage({
    command: 'spinner.winner-display-active',
    data: index
  });
};

control.spinner.closeWinner = (wnr = winner) => {
  wnr.close();
};

control.spinner.setSound = (sound, spin = spinner) => {
  spin.state.activeSound = sound;
};

control.spinner.selectIndividual = (index, spin = spinner, mnu = menu) => {
  spin.state.activePerson = spin.group[index];
  spin.state.activePersonIndex = index;
  mnu.displayActivePerson();
};

control.spinner.seePrizes = (mnu = menu, doc = document) => {
  const prizesWrapper = doc.querySelector('.prizes-wrapper');
  if (prizesWrapper.classList.contains('hidden')) {
    mnu.seePrizes();
  } else {
    mnu.closePrizes();
  }
};

control.spinner.seePeerLink = (doc = document) => {
  const peerWrapper = doc.querySelector('.peer-wrapper');
  peerWrapper.classList.toggle('hidden');
};

control.spinner.removeIndividual = (mnu = menu) => {
  mnu.clearActivePerson();
};

control.spinner.panelRefresh = (spin = spinner) => {
  spin.init();
};

// For Unit Testing
if (typeof module !== 'undefined' && module.hasOwnProperty('exports')) {
  module.exports = control;
}