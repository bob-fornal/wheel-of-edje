
const ctrl = {};

ctrl.init = () => {};

ctrl.mock = {
  init: () => {},
  spinner: {},
  trigger: {}
};

ctrl.mock.spinner.winnerDisplay = () => {};

ctrl.mock.trigger.removeIndividual = () => {};
ctrl.mock.trigger.selectIndividual = () => {};
ctrl.mock.trigger.spinClockwise = () => {};
ctrl.mock.trigger.spinCounterClockwise = () => {};

if (typeof module !== 'undefined' && module.hasOwnProperty('exports')) {
  module.exports = ctrl;
}
