
const external = {
  activeSound: 'SILENT',
  group: null,
  panels: null
};

external.init = (ctrl = control, store = storage) => {
  ctrl.init();
  store.editInit();

  external.activeSound = storage.getActiveSound();
  external.updateDisplay();

  peer.init();
};

external.updateDisplay = () => {
  external.showActiveSound();
  external.showGroup();
  external.showPanels();
};

external.triggerSpin = (direction = 'clockwise') => {
  console.log(direction);
  if (direction === 'clockwise') {
    control.trigger.spinClockwise();
  } else {
    control.trigger.spinCounterClockwise();
  }
  external.showSpinning();
};

external.showSpinning = (doc = document) => {
  const wrapper = doc.querySelector('.modal-wrapper');
  const spinning = doc.querySelector('.modal-wrapper .modal-spinning');
  const winner = doc.querySelector('.modal-wrapper .modal-winner');

  wrapper.classList.remove('hidden');
  spinning.classList.remove('hidden');
  winner.classList.add('hidden');
};

external.showActiveSound = (doc = document) => {
  const sounds = ['metronome', 'zippo', 'SILENT'];
  sounds.forEach(sound => {
    const soundElement = doc.querySelector(`#${ sound }`);
    if (sound === external.activeSound) {
      soundElement.classList.add('selected');
    } else {
      soundElement.classList.remove('selected');
    }
  });
};

external.addSpinButtons = (index, type, doc = document) => {
  const spinBtn = doc.createElement('div');
  spinBtn.classList.add('spin', type);
  spinBtn.setAttribute('index', index);

  const imgDisabled = doc.createElement('img');
  imgDisabled.classList.add('img-disabled');
  imgDisabled.src = `images/${ type }-disabled.png`;

  const imgEnabled = doc.createElement('img');
  imgEnabled.classList.add('img-enabled');
  imgEnabled.setAttribute('onClick', `external.triggerSpin('${ type }')`);
  imgEnabled.src = `images/${ type }.png`;

  spinBtn.appendChild(imgDisabled);
  spinBtn.appendChild(imgEnabled);

  return spinBtn;
};

external.addGroupButtons = (node, individual, index, doc = document) => {
  const enableBtn = doc.createElement('div');
  enableBtn.classList.add('button', 'single', 'white', 'enable', 'w100');
  enableBtn.innerText = 'Enable';
  enableBtn.setAttribute('index', index);
  enableBtn.onclick = external.handleEnableBtn;

  const disableBtn = doc.createElement('div');
  disableBtn.classList.add('button', 'single', 'green', 'disable', 'w100');
  disableBtn.innerText = 'Disable';
  disableBtn.setAttribute('index', index);
  disableBtn.onclick = external.handleDisableBtn;

  const selectorBtn = doc.createElement('div');
  selectorBtn.classList.add('button', 'single', 'orange', 'selector', 'w100');
  selectorBtn.innerText = 'Select';
  selectorBtn.setAttribute('index', index);
  selectorBtn.onclick = external.handleSelection;

  const cwBtn = external.addSpinButtons(index, 'clockwise');
  const ccwBtn = external.addSpinButtons(index, 'counter-clockwise');
  
  const noButtonsContainer = doc.createElement('div');
  noButtonsContainer.classList.add('no-buttons');
  noButtonsContainer.innerText = ".";

  if (individual.enabled === true) {
    enableBtn.classList.add('hidden');
    selectorBtn.classList.remove('hidden');
  } else {
    disableBtn.classList.add('hidden');
    selectorBtn.classList.add('hidden');
  }

  if (individual.prize === null) {
    noButtonsContainer.classList.add('hidden');
  } else {
    enableBtn.classList.add('hidden');
    disableBtn.classList.add('hidden');
    selectorBtn.classList.add('hidden');
    cwBtn.classList.add('hidden');
    ccwBtn.classList.add('hidden');
  }

  node.appendChild(noButtonsContainer);
  node.appendChild(enableBtn);
  node.appendChild(disableBtn);
  node.appendChild(selectorBtn);
  node.appendChild(cwBtn);
  node.appendChild(ccwBtn);
};

external.calculateDisplayName = (individual) => {
  let prize;
  if (individual.prize === null) {
    prize = 'No Prize';
  } else {
    prize = individual.prize;
    prize = prize + ((individual.additional === '') ? '' : `, ${ individual.additional }`);  
  }
  prize = ` (${ prize })`;
  const name = `${ individual.name }${ prize }`;
  return name;
};

external.addIndividual = (node, individual, index, doc = document) => {
  const element = doc.createElement('div');
  element.classList.add('individual');
  element.innerText = external.calculateDisplayName(individual);
  element.setAttribute('index', index);
  element.onclick = external.handleSelection;
  
  node.appendChild(element);
};

external.handleEnableBtn = (event, doc = document, store = storage) => {
  const index = +event.target.getAttribute('index');
  const enableBtn = doc.querySelector(`.group [index="${ index }"] .button.enable`);
  const disableBtn = doc.querySelector(`.group [index="${ index }"] .button.disable`);
  const selectionBtn = doc.querySelector(`.group [index="${ index }"] .button.selector`);

  enableBtn.classList.add('hidden');
  disableBtn.classList.remove('hidden');
  selectionBtn.classList.remove('hidden');

  const person = external.group[index];
  person.enabled = true;
  store.saveGroup(external.group);
};

external.handleDisableBtn = (event, doc = document, store = storage) => {
  const index = +event.target.getAttribute('index');
  const enableBtn = doc.querySelector(`.group [index="${ index }"] .button.enable`);
  const disableBtn = doc.querySelector(`.group [index="${ index }"] .button.disable`);
  const selectionBtn = doc.querySelector(`.group [index="${ index }"] .button.selector`);

  enableBtn.classList.remove('hidden');
  disableBtn.classList.add('hidden');
  selectionBtn.classList.add('hidden');

  external.handleDeselection(index);

  const person = external.group[index];
  person.enabled = false;
  store.saveGroup(external.group);

};

external.handleDeselection = (index, doc = document) => {
  const selections = doc.querySelectorAll('.group .button.selector');
  const individuals = doc.querySelectorAll('.group .individual');
  const spins = doc.querySelectorAll(`.group [index="${ index }"] .spin`);

  selections[index].classList.remove('selected');
  individuals[index].classList.remove('selected');
  spins.forEach(spinBtn => {
    spinBtn.classList.remove('enabled');
  });

  control.trigger.removeIndividual();
};

external.handleSelection = (event = null, doc = document) => {
  const selections = doc.querySelectorAll('.group .button.selector');
  const individuals = doc.querySelectorAll('.group .individual');
  const spinBtn = doc.querySelectorAll('.group .spin');

  let index, alreadySelected;
  if (typeof event !== 'number') {
    index = +event.target.getAttribute('index');
    alreadySelected = event.target.classList.contains('selected');  
  } else if (typeof event === 'number') {
    index = event;
    alreadySelected = false;
  }
  if (alreadySelected) {
    external.handleDeselection(index);
    return;
  }

  selections.forEach((select, i) => {
    if (i === index) {
      select.classList.add('selected');
    } else {
      select.classList.remove('selected');
    }
  });
  individuals.forEach((person, i) => {
    if (i === index) {
      person.classList.add('selected');
    } else {
      person.classList.remove('selected');
    }
  });
  spinBtn.forEach(btn => {
    const btnIndex = +btn.getAttribute('index');
    if (btnIndex === index) {
      btn.classList.add('enabled');
    } else {
      btn.classList.remove('enabled');
    }
  });
  control.trigger.selectIndividual(index);
};

external.showGroup = (store = storage, doc = document) => {
  const divNode = doc.querySelector('.group .content');
  divNode.innerHTML = '';
  external.group = store.getGroup();

  external.group.forEach((individual, index) => {
    const row = doc.createElement('div');
    row.classList.add('row');
    row.setAttribute('index', index);

    external.addGroupButtons(row, individual, index);
    external.addIndividual(row, individual, index);
    divNode.appendChild(row);
  });
};

external.showWinner = (index, doc = document, store = storage) => {
  external.group = store.getGroup();
  const person = external.group[index];

  const spinning = doc.querySelector('.modal-wrapper .modal-spinning');
  const winner = doc.querySelector('.modal-wrapper .modal-winner');

  const individual = doc.querySelector('.individual-winner');
  const prize = doc.querySelector('.prize');
  const prizeAdditional = doc.querySelector('.prize-additional');

  individual.innerText = person.name;
  prize.innerText = person.prize;
  if (person.additional.length > 0) {
    prizeAdditional.innerText = person.additional;
    prizeAdditional.classList.remove('hidden');
  } else {
    prizeAdditional.classList.add('hidden');
  }

  spinning.classList.add('hidden');
  winner.classList.remove('hidden');

  const individualSelected = doc.querySelector(`.group [index="${ index }"] .individual`);
  const buttons = doc.querySelectorAll(`.group [index="${ index }"] .button`);
  const spinBtns = doc.querySelectorAll(`.group [index="${ index }"] .spin`);
  const noButtons = doc.querySelector(`.group [index="${ index }"] .no-buttons`);
  individualSelected.classList.remove('selected');
  individualSelected.classList.remove('remote-selection');
  individualSelected.innerText = external.calculateDisplayName(person);
  buttons.forEach(btn => {
    btn.classList.add('hidden');
    btn.classList.remove('selected');
  });
  spinBtns.forEach(btn => {
    btn.classList.add('hidden');
  });
  noButtons.classList.remove('hidden');
};

external.hideWinner = (doc = document) => {
  const wrapper = doc.querySelector('.modal-wrapper');
  const spinning = doc.querySelector('.modal-wrapper .modal-spinning');
  const winner = doc.querySelector('.modal-wrapper .modal-winner');
  const prizeAdditional = doc.querySelector('.prize-additional');

  wrapper.classList.add('hidden');
  spinning.classList.remove('hidden');
  winner.classList.add('hidden');
  prizeAdditional.classList.add('hidden');
};

external.closeWinner = () => {
  peer.closeWinner();
  control.trigger.closeWinner();
  external.hideWinner();
};

external.setSound = (sound, store = storage) => {
  external.activeSound = sound;
  external.showActiveSound();
  store.saveActiveSound(sound);

  control.trigger.setSound(sound);
};

external.triggerSeePrizes = () => {
  control.trigger.seePrizes();
};

external.triggerSeePeerLink = () => {
  control.trigger.seePeerLink();
};

external.triggerClearPrizes = (store = storage) => {
  external.group.forEach(individual => {
    individual.prize = null;
    individual.additional = null;
  });

  store.saveGroup(external.group);
  external.showGroup();
};

external.addPanelButtons = (node, panel, index, doc = document) => {
  const enableBtn = doc.createElement('div');
  enableBtn.classList.add('button', 'single', 'white', 'enable', 'w100');
  enableBtn.innerText = 'Enable';
  enableBtn.setAttribute('index', index);
  enableBtn.onclick = external.handlePanelEnable;

  const disableBtn = doc.createElement('div');
  disableBtn.classList.add('button', 'single', 'green', 'disable', 'w100');
  disableBtn.innerText = 'Disable';
  disableBtn.setAttribute('index', index);
  disableBtn.onclick = external.handlePanelDisable;

  if (panel.enabled === true) {
    enableBtn.classList.add('hidden');
  } else {
    disableBtn.classList.add('hidden');
  }

  node.appendChild(enableBtn);
  node.appendChild(disableBtn);
};

external.addPanel = (node, panel, index, doc = document) => {
  const style = `color: ${ panel.fcolor }; background-color: ${ panel.color }`;
  const content = doc.createElement('div');
  content.classList.add('panel');
  content.innerText = panel.text;
  content.setAttribute('index', index);
  content.setAttribute('style', style);
  // content.onclick = external.handleSelection;

  const contentAdditional = doc.createElement('div');
  contentAdditional.classList.add('panel-additional');
  contentAdditional.setAttribute('index', index);
  let additional = panel.additionalText;
  if (additional.length === 0) {
    additional = "NONE";
    contentAdditional.classList.add('hide-borders');
  } else {
    contentAdditional.setAttribute('style', style);
  }
  contentAdditional.innerText = additional;

  node.appendChild(content);
  node.appendChild(contentAdditional);
};

external.showPanels = (doc = document, store = storage) => {
  const content = doc.querySelector('.rewards .content');
  content.innerHTML = '';

  external.panels = store.getPie();
  external.panels.forEach((panel, index) => {
    const row = doc.createElement('div');
    row.classList.add('row');
    row.setAttribute('index', index);

    external.addPanelButtons(row, panel, index);
    external.addPanel(row, panel, index);
    content.appendChild(row);
  });
};

external.handlePanelEnable = (event, doc = document, store = storage) => {
  const index = +event.target.getAttribute('index');
  const disableBtn = doc.querySelector(`.rewards [index="${ index}"] .disable`);
  const enableBtn = doc.querySelector(`.rewards [index="${ index}"] .enable`);

  disableBtn.classList.remove('hidden');
  enableBtn.classList.add('hidden');

  external.panels[index].enabled = true;
  store.savePie(external.panels);

  control.trigger.panelRefresh();
};

external.handlePanelDisable = (event, doc = document, store = storage) => {
  const index = +event.target.getAttribute('index');
  const disableBtn = doc.querySelector(`.rewards [index="${ index}"] .disable`);
  const enableBtn = doc.querySelector(`.rewards [index="${ index}"] .enable`);

  disableBtn.classList.add('hidden');
  enableBtn.classList.remove('hidden');

  external.panels[index].enabled = false;
  store.savePie(external.panels);

  control.trigger.panelRefresh();
};
