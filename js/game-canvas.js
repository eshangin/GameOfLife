function Canvas(el) {
    var $el = $(el);
    this.create = function (w, h) {
        var tbl = '<table class="b-canvas">';
        for (var i = 0; i < h; i++) {
            tbl += '<tr>';
            for (var j = 0; j < w; j++) {
                tbl += '<td class="b-canvas__cell"></td>'
            }
            tbl += '</tr>';
        }
        tbl += '</table>';
        $el.html(tbl);
    };

    this.setCell = function (x, y, type) {
        var css = (type == 'live') ? 'b-canvas__cell-live' : 'b-canvas__cell-died';
        var $cell = $($($el.find('tr')[y]).find('td')[x]);
        $cell.addClass(css);
    }

    $(el).delegate('td', 'click', function () {
        // trigger custom event, pass cell X and Y as a parameters
        $(el).trigger('cell-click', [$(this).index(), $(this).closest('tr').index()]);
    });
}