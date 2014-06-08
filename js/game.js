function Canvas(el) {
    var $el = $(el);
    this.create = function (w, h) {
        var tbl = '<table style="border: solid 1px #ddd; border-collapse: collapse; position: relative; left: 150px; top: 40px;">';
        for (var i = 0; i < h; i++) {
            tbl += '<tr>';
            for (var j = 0; j < w; j++) {
                tbl += '<td style="border: solid 1px #ddd; width: 4px; height: 6px;"></td>'
            }
            tbl += '</tr>';
        }
        tbl += '</table>';
        $el.html(tbl);
    };

    this.setCell = function (x, y, type) {
        var bg = (type == 'live') ? '#3276b1' : '#ed9c28';
        var $cell = $($($el.find('tr')[x]).find('td')[y]);
        $cell.css('background-color', bg);
    }
}

function Game(containerId) {
    var canvas = new Canvas(document.getElementById(containerId));
    canvas.create(80, 80);

    canvas.setCell(10, 10, 'live');
    canvas.setCell(10, 11, 'dead');
}