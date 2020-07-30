
const peer = {
  key: 'karlIDoHJJ5aQv2i0FxQvW1apsufNjEpku43kSz95YGRT60QDabnQYICZU7M',
  channel: '1'
};

peer.init = () => {
  const url = `wss://connect.websocket.in/v3/${ peer.channel }?apiKey=${ peer.key }`;
  peer.socket = new WebSocket(url);

  peer.socket.onopen = peer.onopen;
  peer.socket.onmessage = peer.onmessage;
  peer.socket.onclose = peer.onclose;
  peer.socket.onerror = peer.onerror;
};

peer.onopen = (event) => {
  console.log("[open] Connection established");
  console.log("Sending peer.init");

  const message = JSON.stringify({ from: 'peer', command: 'init' });
  console.log(message);
  peer.socket.send(message);
};

peer.onmessage = (event) => {
  const data = JSON.parse(event.data);
  const command = data.from + '.' + data.command;
  console.log('[message] Data received:', data);

  switch (true) {
    case (command === 'external.group'):
      const group = data.group;
      console.log('group', group);
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