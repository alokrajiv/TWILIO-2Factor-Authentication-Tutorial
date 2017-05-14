const debug = require('debug')('SERVER');
import server from './index';

const port = process.env.PORT || 3001;
server.listen(port, () => {
    debug(`Express server listening on port ${server.address().port}`);
});

export default server;
