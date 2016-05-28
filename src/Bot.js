'use strict';

const program = require('commander');
const io = require('socket.io-client');
const RMIClient = require('socket.io-rmi-client');

program
  .version('0.0.1')
  .usage('[options] <count>')
  .option('-s, --server [address]', 'Server Address [dev.abersoft.io]', 'dev.abersoft.io')
  .option('-p, --port [n]', 'Port [3000]', parseInt, 3000)
  .option('-r, --room [room]', 'Room to test [bot-rrom]', 'bot-room')
  .arguments('<count>')
  .action(count => {
    startProgram(count || 1, program.server, program.port, program.room);
  });
program.parse(process.argv);

function startProgram(count, server, port, room) {
  console.log(`Starting ${count} bots for ${server}:${port}/${room}`);
  for (let i = 0; i < count; ++i) {
    startBot(i + 1, server, port, room);
  }
}

function startBot(num, server, port, room) {
  const res = RMIClient.connect(io, 'ws://' + server + ':' + port);
  const eventHandler = new RMIClient.EventHandler();
  eventHandler.onEvent = function (user, event) {

  };

  eventHandler.onMessage = function (user, event) {

  };

  res.onConnected = (instance) => {
    console.log('Bot', num, 'connected');
    let counter = 0;
    const sendMessage = function () {
      counter += 1;
      instance.sendMessage(counter + ' ' + new Date()).then(() => {
        const interval = Math.floor(Math.random() * 3000);
        setTimeout(sendMessage, interval);
      });
    };

    instance.login(room, 'Bot-' + num, eventHandler).then(users => {
      // randomly send some message every few seconds
      const interval = Math.floor(Math.random() * 3000);
      setTimeout(sendMessage, interval);
    });
  };

  res.onDisconnected = () => {
    console.log('Bot', num, 'DISCONNECTED');
  };
}
