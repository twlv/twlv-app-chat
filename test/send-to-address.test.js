const { Swarm } = require('twlv-swarm');
const Tcp = require('twlv-swarm/channel/tcp');
const Chat = require('../');

describe('Send to address', () => {
  it('send chat message to address', async () => {
    let swarm1 = createSwarm(12000);
    let swarm2 = createSwarm(12001);

    swarm2.addBootPeer('tcp://localhost:12000');

    await swarm1.start();
    await swarm2.start();

    await new Promise((resolve, reject) => {
      swarm2.getApp('chat').on('event', ({ name, payload }) => {
        if (name === 'message') {
          if (payload.address === swarm1.address && payload.message === 'Hello') {
            resolve();
          } else {
            reject(new Error('Receive unknown message'));
          }
        }
      });
      swarm1.getApp('chat').doSend(swarm2.address, 'Hello');
    });
  });

  let swarms = [];
  function createSwarm (port) {
    let swarm = new Swarm();

    swarm.addChannel(new Tcp({ port }));
    swarm.addApp(new Chat());

    swarms.push(swarm);

    return swarm;
  }

  before(() => {
    process.on('unhandledRejection', err => console.error('Unhandled Rejection', err));
  });

  after(() => {
    process.removeAllListeners('unhandledRejection');
  });

  afterEach(async () => {
    await Promise.all(swarms.map(swarm => swarm.stop()));
  });
});
