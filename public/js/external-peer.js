
const peer = {
  key: 'karlIDoHJJ5aQv2i0FxQvW1apsufNjEpku43kSz95YGRT60QDabnQYICZU7M',
  channel: '1'
};

peer.init = () => {
  peer.checkHost();

  const url = `wss://connect.websocket.in/v3/${ peer.channel }?apiKey=${ peer.key }`;
  peer.socket = new WebSocket(url);

  peer.socket.onopen = peer.onopen;
  peer.socket.onmessage = peer.onmessage;
  peer.socket.onclose = peer.onclose;
  peer.socket.onerror = peer.onerror;

  peer.getGroupFromExternal();
};

peer.checkHost = () => {
  if (window.location.hostname === 'localhost') {
    console.log('localhost');
    peer.channel = 2;
  }
};

peer.getGroupFromExternal = () => {
  let activeGroup = external.group.filter((item) => item.enabled);
  peer.group = activeGroup.map(item => {
    const selected = (item.prize !== null);
    return { name: item.name, selected: selected };
  });
};

peer.onopen = (event) => {
  console.log("[open] Connection established");
  console.log("Sending external.init");

  const message = JSON.stringify({ from: 'external', command: 'init' });
  peer.socket.send(message);
};

peer.onmessage = (event) => {
  const data = JSON.parse(event.data);
  const command = data.from + '.' + data.command;

  switch (true) {
    case (command === 'peer.init'):
      const message = JSON.stringify({
        from: 'external', command: 'group',
        group: peer.group
      });
      peer.socket.send(message);
      break;
    case (command === 'peer.group'):
      const selected = data.group;
      peer.processGroupSelection(selected);
      break;
    case (command === 'peer.spin'):
      const direction = data.direction;
      const index = data.index;
      external.handleSelection(index);
      external.triggerSpin(direction);
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

peer.processGroupSelection = (group, doc = document) => {
  peer.group = group;
  
  group.forEach((individual, index) => {
    const element = doc.querySelector(`.individual[index="${ index }"]`);
    if (individual.selected === true && external.group[index].prize === null) {
      element.classList.add('remote-selection');
    } else {
      element.classList.remove('remote-selection');
    }
  });
};

peer.closeWinner = () => {
  console.log("Sending external.close-winner");

  const message = JSON.stringify({ from: 'external', command: 'close-winner' });
  peer.socket.send(message);
};
