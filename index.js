const { App } = require('twlv-swarm');

class Chat extends App {
  constructor () {
    super('chat');
  }

  up () {
    // noop
  }

  down () {
    // noop
  }

  onRequest () {
    // noop
  }

  onMessage ({ address, command, payload }) {
    this.sendEvent({ name: 'message', payload: { address, message: payload } });
  }

  doSend (address, message) {
    this.send({ address, command: 'send', payload: message });
  }
}

module.exports = Chat;
