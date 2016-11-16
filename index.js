const Arena = require('./lib/arena');

module.exports = function (config) {
    if (config.cli) {
        config.cli.on('cliSandbox', function (sandbox) {
            sandbox.arena = new Arena(sandbox.map);
        }
    }
}
