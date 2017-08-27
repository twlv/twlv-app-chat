const { Swarm } = require('twlv-swarm');
const PORT = process.argv[2] ? Number(process.argv[2]) : 12000;
const Tcp = require('twlv-swarm/channel/tcp');
const Mdns = require('twlv-discovery-mdns');
const Chat = require('../');
const repl = require('repl');

(async () => {
  let swarm = new Swarm();
  swarm.addChannel(new Tcp({ port: PORT }));
  swarm.addDiscovery(new Mdns());

  let chat = new Chat();
  swarm.addApp(chat);

  await swarm.start();

  let cli = repl.start();

  chat.on('event', ({ name, payload }) => {
    if (name === 'message') {
      console.info(`${payload.address}> ${payload.message}`);
    }
  });

  console.info('Address', swarm.address);

  cli.context.swarm = swarm;
  cli.context.chat = chat;
})();
