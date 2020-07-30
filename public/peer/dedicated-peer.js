
const peer = {
  key: 'karlIDoHJJ5aQv2i0FxQvW1apsufNjEpku43kSz95YGRT60QDabnQYICZU7M',
  channel: '1',

  spinning: false,
  group: [],
  selected: null,
  spun: false
};

peer.init = () => {
  peer.checkHost();
  
  const url = `wss://connect.websocket.in/v3/${ peer.channel }?apiKey=${ peer.key }`;
  peer.socket = new WebSocket(url);

  peer.socket.onopen = peer.onopen;
  peer.socket.onmessage = peer.onmessage;
  peer.socket.onclose = peer.onclose;
  peer.socket.onerror = peer.onerror;
};

peer.checkHost = () => {
  if (window.location.hostname === 'localhost') {
    console.log('localhost');
    peer.channel = 2;
  }
};

peer.onopen = (event) => {
  console.log("[open] Connection established");
  console.log("Sending peer.init");

  const message = JSON.stringify({ from: 'peer', command: 'init' });
  peer.socket.send(message);
};

peer.onmessage = (event) => {
  const data = JSON.parse(event.data);
  const command = data.from + '.' + data.command;

  switch (true) {
    case (command === 'external.group'):
    case (command === 'peer.group'):
      peer.group = data.group;
      peer.showGroup();
      break;
    case (command === 'peer.spin'):
      peer.spinning = true;
      break;
    case (command === 'external.close-winner'):
      peer.spun = true;
      peer.spinning = false;
      break;
  }
};

peer.onclose = (event) => {
  if (event.wasClean) {
    console.log(`[close] Connection closed cleanly, code=${ event.code } reason=${ event.reason }`);
  } else {
    console.log('[close] Connection died');
  }
};

peer.onerror = function(error) {
  console.log(`[error] ${error.message}`);
};

peer.showGroup = (doc = document) => {
  const list = doc.querySelector('.list-of-names');
  list.innerHTML = '';

  peer.group.forEach((person, index) => {
    const item = doc.createElement('div');
    item.classList.add('name-selector');
    item.innerText = person.name;
    item.setAttribute('index', index);
    item.onclick = peer.selectPerson;

    if (person.selected === true) {
      item.classList.add('selected');
    }
    if (peer.selected !== null && index !== peer.selected) {
      item.classList.add('hidden');
    }

    list.appendChild(item);
  });
};

peer.showButtons = (doc = document) => {
  const buttons = doc.querySelector('.spinner-buttons');
  if (peer.selected === null) {
    buttons.classList.add('hidden');
  } else {
    buttons.classList.remove('hidden');
  }
};

peer.sendChangeNotification = () => {
  console.log("Sending peer.group change");
  const message = JSON.stringify({
    from: 'peer', command: 'group',
    group: peer.group
  });
  peer.socket.send(message);
};

peer.selectPerson = (event) => {
  const index = Number(event.target.getAttribute('index'));
  if (peer.spun === true) return;
  if (peer.selected !== index && peer.group[index].selected === true) return;

  if (peer.selected !== null && peer.selected === index) {
    peer.group[index].selected = false;
    peer.selected = null;
  } else if (peer.selected === null && peer.group[index].selected === false) {
    peer.group[index].selected = true;
    peer.selected = index;
  }
  peer.showGroup();
  peer.showButtons();
  peer.sendChangeNotification();
};

peer.spin = (direction) => {
  if (peer.spinning === true) return;
  if (peer.spun === true) return;

  peer.spinning = true;
  const message = JSON.stringify({
    from: 'peer', command: 'spin',
    direction: direction,
    index: peer.selected
  });
  peer.socket.send(message);
};
