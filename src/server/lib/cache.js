import catbox from 'catbox';
import memory from 'catbox-memory';
import log from '../../shared/utils/logTailor';

const client = new catbox.Client(memory);

client.start(err => {
  if (err) throw err;
});

export default client;