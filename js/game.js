function Canvas(el) {
    var $el = $(el);
    this.create = function (w, h) {
        var tbl = '<table style="border: solid 1px #ddd; border-collapse: collapse; position: relative; left: 150px; top: 40px;">';
        for (var i = 0; i < h; i++) {
            tbl += '<tr>';
            for (var j = 0; j < w; j++) {
                tbl += '<td style="border: solid 1px #ddd; width: 6px; height: 8px;"></td>'
            }
            tbl += '</tr>';
        }
        tbl += '</table>';
        $el.html(tbl);
    };

    this.setCell = function (x, y, type) {
        var bg = (type == 'live') ? '#3276b1' : 'gray';
        var $cell = $($($el.find('tr')[y]).find('td')[x]);
        $cell.css('background-color', bg);
    }
}

function Game(containerId) {
    var liveItems;
    var canvas = new Canvas(document.getElementById(containerId));

    function Arr2d() {
        var self = this;
        var arr = [];
        var checkArr = function (x) {
            // declare array if wasn't declared yet
            if (typeof arr[x] == 'undefined') {
                arr[x] = [];
            }

            return arr[x];
        }
        self.get = function (x, y) {
            switch (arguments.length) {
                case 0: return arr;
                case 1: return checkArr(x);
                case 2: return checkArr(x)[y];
            }
        }
        self.set = function (x, y, value) {
            checkArr(x)[y] = value;
        }
    }
    
    var loadState = function () {
        liveItems = [
            { x: 51, y: 48 },

            { x: 50, y: 50 },
            { x: 51, y: 50 },

            { x: 53, y: 49 },
            { x: 54, y: 50 },
            { x: 55, y: 50 },
            { x: 56, y: 50 }
        ];
    };

    var getNeighborsCoords = function (x, y) {
        return [
            { x: x - 1, y: y - 1 },
            { x: x, y: y - 1 },
            { x: x + 1, y: y - 1 },
            { x: x - 1, y: y },
            { x: x + 1, y: y },
            { x: x - 1, y: y + 1 },
            { x: x, y: y + 1 },
            { x: x + 1, y: y + 1 }
        ];
    }

    var getReadyToBorn = function () {
        var empty = new Arr2d();
        for (var i = 0; i < liveItems.length; i++) {
            var item = liveItems[i];
            var neighbors = getNeighborsCoords(item.x, item.y);

            // now check each neighbor if it is empty
            for (var k = 0; k < neighbors.length; k++) {
                var isEmpty = true;
                for (var j = 0; j < liveItems.length; j++) {
                    if (liveItems[j].x == neighbors[k].x && liveItems[j].y == neighbors[k].y) {
                        isEmpty = false;
                        break;
                    }
                }
                if (isEmpty) {
                    if (typeof empty.get(neighbors[k].x, neighbors[k].y) == 'undefined') {
                        empty.set(neighbors[k].x, neighbors[k].y, 1);
                    }
                    else {
                        empty.set(neighbors[k].x, neighbors[k].y, empty.get(neighbors[k].x, neighbors[k].y) + 1);
                    }
                }
            }
        }

        var result = [];

        // return empty items with 3 live neighbors only
        for (var x in empty.get()) {
            for (var y in empty.get(x)) {
                if (empty.get(x, y) == 3) {
                    result.push({ x: +x, y: +y });
                }
            }
        }

        return result;
    }

    var getLiveNeighborsCount = function (x, y) {
        var potentialNeighbors = getNeighborsCoords(x, y);

        var neighborsCount = 0;

        for (var i = 0; i < liveItems.length; i++) {
            var item = liveItems[i];

            // check if it is not current item
            if (item.x != x || item.y != y) {
                for (var j = 0; j < potentialNeighbors.length; j++) {
                    if (item.x == potentialNeighbors[j].x && item.y == potentialNeighbors[j].y) {
                        neighborsCount++;
                    }
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
        for (var i = 0; i < liveItems.length; i++) {
            canvas.setCell(liveItems[i].x, liveItems[i].y, 'live');
        }
    })();

    // remove died item, add new items (if any)
    var updateItems = function (itemsToDie, itemsToBorn) {
        for (var i = 0; i < itemsToDie.length; i++) {
            var indexToDel = itemsToDie[i].index - i;
            liveItems.splice(indexToDel, 1);
            canvas.setCell(itemsToDie[i].item.x, itemsToDie[i].item.y, 'die');
        }

        liveItems = liveItems.concat(itemsToBorn);

        for (var i = 0; i < itemsToBorn.length; i++) {
            canvas.setCell(itemsToBorn[i].x, itemsToBorn[i].y, 'live');
        }

        //console.log(liveItems);
    }

    var runCycle = function () {
        var willDie = [];
        var willBorn = [];

        // for each live item calculate if it should live in next cycle
        for (var i = 0; i < liveItems.length; i++) {
            var item = liveItems[i];
            var nCount = getLiveNeighborsCount(item.x, item.y);
            if (nCount != 2 && nCount != 3) {
                willDie.push({ item: item, index: i });
            }
        }

        var readyToBorn = getReadyToBorn();

        updateItems(willDie, readyToBorn);
    }

    this.run = function () {
        for (var i = 0; i < 100; i++) {
            setTimeout(runCycle, i * 10);
        }
    };
}