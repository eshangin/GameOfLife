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