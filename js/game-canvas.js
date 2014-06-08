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