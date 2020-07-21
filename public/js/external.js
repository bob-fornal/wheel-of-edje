
const external = {
  activeSound: 'SILENT',
  group: null
};

external.init = (ctrl = control, store = storage) => {
  ctrl.init();
  store.editInit();

  external.activeSound = storage.getActiveSound();
  external.updateDisplay();
};

external.updateDisplay = () => {
  external.showActiveSound();
  external.showGroup();
};

external.triggerSpin = (direction = 'clockwise') => {
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
  
  if (individual.enabled === true) {
    enableBtn.classList.add('hidden');
  } else {
    disableBtn.classList.add('hidden');
  }

  const noButtonsContainer = doc.createElement('div');
  noButtonsContainer.classList.add('no-buttons');
  noButtonsContainer.innerText = ".";

  if (individual.prize === null) {
    noButtonsContainer.classList.add('hidden');
  } else {
    enableBtn.classList.add('hidden');
    disableBtn.classList.add('hidden');
    selectorBtn.classList.add('hidden');
  }

  node.appendChild(noButtonsContainer);
  node.appendChild(enableBtn);
  node.appendChild(disableBtn);
  node.appendChild(selectorBtn);
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

external.addIndividual = (row, individual, index, doc = document) => {
  const element = doc.createElement('div');
  element.classList.add('individual');
  element.innerText = external.calculateDisplayName(individual);
  element.setAttribute('index', index);
  
  row.appendChild(element);
};

external.handleEnableBtn = (event, doc = document) => {
  const index = event.target.getAttribute('index');
  const enableBtn = doc.querySelector(`.group [index="${ index }"] .button.enable`);
  const disableBtn = doc.querySelector(`.group [index="${ index }"] .button.disable`);
  const selectionBtn = doc.querySelector(`.group .[index="${ index }"] button.selector`);
  enableBtn.classList.add('hidden');
  disableBtn.classList.remove('hidden');
  selectionBtn.classList.remove('hidden');
};

external.handleDisableBtn = (event, doc = document) => {
  const index = event.target.getAttribute('index');
  const enableBtn = doc.querySelector(`.group [index="${ index }"] .button.enable`);
  const disableBtn = doc.querySelector(`.group [index="${ index }"] .button.disable`);
  const selectionBtn = doc.querySelector(`.group [index="${ index }"] .button.selector`);
  enableBtn.classList.remove('hidden');
  disableBtn.classList.add('hidden');
  selectionBtn.classList.add('hidden');

  external.handleDeselection(index);
};

external.handleDeselection = (index, doc = document) => {
  const selections = doc.querySelectorAll('.group .button.selector');
  const individuals = doc.querySelectorAll('.group .individual');
  selections[index].classList.remove('selected');
  individuals[index].classList.remove('selected');
};

external.handleSelection = (event, doc = document) => {
  const index = +event.target.getAttribute('index');
  const selections = doc.querySelectorAll('.group .button.selector');
  const individuals = doc.querySelectorAll('.group .individual');
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
  console.log(index);
  control.trigger.selectIndividual(index);
};

external.showGroup = (store = storage, doc = document) => {
  const divNode = doc.querySelector('.group .content');
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
  console.log(external.group);
  console.log(person);

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
  const noButtons = doc.querySelector(`.group [index="${ index }"] .no-buttons`);
  individualSelected.classList.remove('selected');
  buttons.forEach(btn => {
    btn.classList.add('hidden');
    btn.classList.remove('selected');
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
  control.trigger.closeWinner();
  external.hideWinner();
};

external.setSound = (sound, store = storage) => {
  external.activeSound = sound;
  external.showActiveSound();
  store.saveActiveSound(sound);

  control.trigger.setSound(sound);
};
