function Game(containerId) {
    var liveItems;
    var canvas = new Canvas(document.getElementById(containerId));

    function Arr2d() {
        var self = this;
        var arr = [];
        var checkArr = function (x) {
            // declare array if wasn't declared yet
            if (typeof arr[x.toString()] == 'undefined') {
                arr[x.toString()] = [];
            }

            return arr[x.toString()];
        }
        self.get = function (x, y) {
            switch (arguments.length) {
                case 0: return arr;
                case 1: return checkArr(x.toString());
                case 2: return checkArr(x.toString())[y.toString()];
            }
        }
        self.set = function (x, y, value) {
            checkArr(x.toString())[y.toString()] = value;
        }
        self.delete = function (x, y) {
            delete arr[x][y];
        }
    }
    
    var loadState = function () {
        liveItems = new Arr2d();

        liveItems.set(51, 48, 1);

        liveItems.set(50, 50, 1);
        liveItems.set(51, 50, 1);

        liveItems.set(53, 49, 1);
        liveItems.set(54, 50, 1);
        liveItems.set(55, 50, 1);
        liveItems.set(56, 50, 1);
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

    var getReadyToBorn = function () {
        var empty = new Arr2d();

        for (var i in liveItems.get()) {
            for (var j in liveItems.get(i)) {
                var neighbors = getNeighborsCoords(i, j);

                // now check each neighbor if it is empty
                for (var nx in neighbors.get()) {
                    for (var ny in neighbors.get(nx)) {
                        if (typeof liveItems.get(nx, ny) == 'undefined') {
                            if (typeof empty.get(nx, ny) == 'undefined') {
                                empty.set(nx, ny, 1);
                            }
                            else {
                                empty.set(nx, ny, empty.get(nx, ny) + 1);
                            }
                        }
                    }
                }
            }
        }

        var result = new Arr2d();

        // return empty items with 3 live neighbors only
        for (var x in empty.get()) {
            for (var y in empty.get(x)) {
                if (empty.get(x, y) == 3) {
                    result.set(x, y, 1);
                }
            }
        }

        return result;
    }

    var getReadyToDie = function () {
        var willDie = new Arr2d();

        // for each live item calculate if it should live in next cycle
        for (var x in liveItems.get()) {
            for (var y in liveItems.get(x)) {
                var nCount = getLiveNeighborsCount(x, y);
                if (nCount != 2 && nCount != 3) {
                    willDie.set(x, y, 1);
                }
            }
        }

        return willDie;
    };

    var getLiveNeighborsCount = function (x, y) {
        var potentialNeighbors = getNeighborsCoords(x, y);

        var neighborsCount = 0;

        for (var i in potentialNeighbors.get()) {
            for (var j in potentialNeighbors.get(i)) {
                if (typeof liveItems.get(i, j) != 'undefined') {
                    neighborsCount++;
                }
            }
        }

        return neighborsCount;
    };

    // init
    (function () {
        loadState();
        canvas.create(80, 80);

        // draw initial state
        for (var x in liveItems.get()) {
            for (var y in liveItems.get(x)) {
                canvas.setCell(x, y, 'live');
            }
        }
    })();

    // remove died item, add new items (if any)
    var updateItems = function (itemsToDie, itemsToBorn) {
        for (var x in itemsToDie.get()) {
            for (var y in itemsToDie.get(x)) {
                liveItems.delete(x, y);
                canvas.setCell(x, y, 'die');
            }
        }

        for (var x in itemsToBorn.get()) {
            for (var y in itemsToBorn.get(x)) {
                if (typeof liveItems.get(x, y) == 'undefined') {
                    liveItems.set(x, y, 1);
                    canvas.setCell(x, y, 'live');
                }
            }
        }
    }

    var runCycle = function () {
        var readyToDie = getReadyToDie();
        var readyToBorn = getReadyToBorn();

        updateItems(readyToDie, readyToBorn);
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

        (function recurse(i, count) {
            runCyclePromise(20).then(function () {
                if (i + 1 < count) {
                    recurse(i + 1, count);
                }
            });
        })(0, 100);

    };
}