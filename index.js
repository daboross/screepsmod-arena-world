const Arena = require('./lib/arena');

module.exports = function (config) {
    if (config.cli) {
        var oldCreateSandbox = config.cli.createSandbox;
        config.cli.createSandbox = function() {
            var sandbox = oldCreateSandbox.apply(this, Array.prototype.slice.call(arguments));
            sandbox.arena = new Arena(sandbox.map);
            return sandbox;
        }
    }
}
