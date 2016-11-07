let Arena = function Arena(map) {
    this.map = map;
}

Arena.prototype._help = `Available methods:
- arena.deleteRooms(x1, y1, x2, y2) - Deletes all rooms with coordinates between (x1, y1) and (x2, y2).
- arena.generateRooms(x1, y1, x2, y2, generator='corner-battle') - Generates all rooms with coordinates between (x1, y1) and (x2, y2).
- arena.openRooms(x1, y1, x2, y2) - Opens all rooms with coordinates between (x1, y1) and (x2, y2).

All methods with x1,y1,x2,y2 will default to x1=0,y1=0,x2=10,y2=10 if no arguments are proivided.
All methods return a promise, after which work will be done.
`

Arena.prototype.deleteRooms = function deleteRooms(x1, x2, y1, y2) {
    let [minX, minY, maxX, maxY] = parseCoordArgs(x1, x2, y1, y2);
    return forEachRoom(this.map, minX, minY, maxX, maxY, (name) => {
        return this.map.closeRoom(name).then(() => this.map.removeRoom(name));
    });
}

Arena.prototype.generateRooms = function generateRooms(x1, x2, y1, y2, generator) {
    if (generator === undefined) {
        generator = 'corner-battle';
    }
    let [minX, minY, maxX, maxY] = parseCoordArgs(x1, x2, y1, y2);
    let generatorFunction = generatorFunctions[generator];
    return forEachRoom(this.map, minX, minY, maxX, maxY, (name) => {
        return generatorFunction(name).then(() => this.map.closeRoom(name));
    });
}

Arena.prototype.openRooms = function deleteRooms(x1, x2, y1, y2) {
    let [minX, minY, maxX, maxY] = parseCoordArgs(x1, x2, y1, y2);
    return forEachRoom(this.map, minX, minY, maxX, maxY, (name) => {
        return this.map.closeRoom(name).then(() => this.map.removeRoom(name));
    });
}

let generatorFunctions = {
    'corner-battle': generateCornerRoom,
}

function exitsFor(room_name, side_num) {
    let exits = [];
    // TODO: Simplex noise for random side exits / other things!
    return [1, 2, 3, 46, 47, 48];
}

function generateCornerRoom(map, name) {
    return map.generateRoom(name, {
        'exits': {
            'left': exitsFor(name, SIDE_LEFT),
            'right': exitsFor(name, SIDE_RIGHT),
            'top': exitsFor(name, SIDE_TOP),
            'bottom': exitsFor(name, SIDE_BOTTOM),
        },
        'sources': 4,
    })
}

function parseCoordArgs(x1, x2, y1, y2) {
    if (x1 === undefined) {
        return [0, 0, 10, 10];
    }
    return [Math.min(x1, x2), Math.min(y1, y2), Math.max(x1, x2), Math.max(y1, y2)];
}

function forEachRoom(map, minX, maxX, minY, maxY, func) {
    let promises = [];
    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            let name = `W${x}N${y}`;
            promises.push(func(name));
        }
    }
    return Promise.all(promises);
}


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
