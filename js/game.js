function Game(containerId, controlsId) {
    var self = this;

    var canvas = new Canvas(document.getElementById(containerId));
    var $controlsContainer = $('#' + controlsId);
    var gameLaunched = ko.observable(false);
    var forceStop = false;

    function GliderList() {
        this.array = new Arr2d();

        this.setLive = function (x, y) {
            this.array.set(x, y, 1);
            canvas.setCell(x, y, 'live');
        }

        this.setDie = function (x, y) {
            this.array.delete(x, y);
            canvas.setCell(x, y, 'died');
        }

        this.remove = function (x, y) {
            this.array.delete(x, y);
            canvas.setCell(x, y, 'empty');
        }

        this.clear = function () {
            for (var x in this.array.get()) {
                for (var y in this.array.get(x)) {
                    this.remove(x, y);
                }
            }
        }
    }

    var gliders = new GliderList();
    
    var loadState = function () {
        gliders.setLive(51, 48);

        gliders.setLive(50, 50);
        gliders.setLive(51, 50);

        gliders.setLive(53, 49);
        gliders.setLive(54, 50);
        gliders.setLive(55, 50);
        gliders.setLive(56, 50);
    };

    var getNeighborsCoords = function (x, y) {
        var bigX = new bigInt(x);
        var bigY = new bigInt(y);

        var result = new Arr2d();

        result.set(bigX.add(-1).toString(), bigY.add(-1).toString(), 1);
        result.set(bigX.toString(), bigY.add(-1).toString(), 1);
        result.set(bigX.add(1).toString(), bigY.add(-1).toString(), 1);
        result.set(bigX.add(-1).toString(), bigY.toString(), 1);
        result.set(bigX.add(1).toString(), bigY.toString(), 1);
        result.set(bigX.add(-1).toString(), bigY.add(1).toString(), 1);
        result.set(bigX.toString(), bigY.add(1).toString(), 1);
        result.set(bigX.add(1).toString(), bigY.add(1).toString(), 1);

        return result;
    }

    // get info which gliders died/become live
    var getChanges = function () {
        var empty = new Arr2d();

        var result = {
            willDie: new Arr2d(),
            willBorn: new Arr2d()
        };

        for (var i in gliders.array.get()) {
            for (var j in gliders.array.get(i)) {
                var neighbors = getNeighborsCoords(i, j);

                var liveNeighbors = 0;

                // now check each neighbor if it is empty
                for (var nx in neighbors.get()) {
                    for (var ny in neighbors.get(nx)) {
                        if (typeof gliders.array.get(nx, ny) == 'undefined') {
                            if (typeof empty.get(nx, ny) == 'undefined') {
                                empty.set(nx, ny, 1);
                            }
                            else {
                                empty.set(nx, ny, empty.get(nx, ny) + 1);
                            }
                        }
                        else {
                            liveNeighbors++;
                        }
                    }
                }

                // will glider live in next cycle?
                if (liveNeighbors != 2 && liveNeighbors != 3) {
                    result.willDie.set(i, j, 1);
                }
            }
        }

        // return empty items with 3 live neighbors only
        for (var x in empty.get()) {
            for (var y in empty.get(x)) {
                if (empty.get(x, y) == 3) {
                    result.willBorn.set(x, y, 1);
                }
            }
        }

        return result;
    };

    // init
    (function () {
        $(document.getElementById(containerId)).on("cell-click", function (event, x, y) {
            // handle only if game is not launched
            if (!gameLaunched()) {
                if (typeof gliders.array.get(x, y) == 'undefined') {
                    gliders.setLive(x, y, 1);
                }
                else {
                    gliders.remove(x, y);
                }
            }
            else {
                alert('You should stop game first!');
            }
        });

        var ControlsModel = function () {
            this.canvasW = ko.observable(80);
            this.canvasH = ko.observable(80);
            this.startStop = function () {
                if (!gameLaunched()) {
                    self.run();
                }
                else {
                    forceStop = true;
                }
            };
            this.clear = function () {
                gliders.clear();
                canvas.clear();
            };
            this.gameLaunched = ko.computed(function () {
                return gameLaunched();
            });
            this.updateCanvas = function () {
                canvas.create(this.canvasW(), this.canvasH());
            };
            this.updateCanvas();
        };
        var controlsModel = new ControlsModel();
        ko.applyBindings(controlsModel, document.getElementById(controlsId));

        // load initial state
        loadState();
    })();

    // remove died item, add new items (if any)
    var updateItems = function (itemsToDie, itemsToBorn) {
        for (var x in itemsToDie.get()) {
            for (var y in itemsToDie.get(x)) {
                gliders.setDie(x, y);
            }
        }

        for (var x in itemsToBorn.get()) {
            for (var y in itemsToBorn.get(x)) {
                if (typeof gliders.array.get(x, y) == 'undefined') {
                    gliders.setLive(x, y, 1);
                }
            }
        }
    }

    var runCycle = function () {
        var res = getChanges();

        updateItems(res.willDie, res.willBorn);
    }

    var runCyclePromise = function (delay) {
        var def = $.Deferred();

        setTimeout(function () {
            runCycle();
            def.resolve();
        }, delay);

        return def;
    }

    this.run = function () {

        gameLaunched(true);

        (function recurse() {
            runCyclePromise(20).then(function () {
                if (!forceStop) {
                    recurse();
                }
                else {
                    forceStop = false;
                    gameLaunched(false);
                }
            });
        })();

    };
}