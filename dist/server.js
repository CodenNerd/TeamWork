'use strict';

var _http = require('http');

var _app = require('./../app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var normalizePort = function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
var port = normalizePort(process.env.PORT || '3000');
_app2.default.set('port', port);

var errorHandler = function errorHandler(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  var address = server.address();
  var bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

var server = (0, _http.createServer)(_app2.default);

server.on('error', errorHandler);
server.on('listening', function () {
  var address = server.address();
  var bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
//# sourceMappingURL=server.js.map