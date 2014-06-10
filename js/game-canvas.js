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
        var $cell = $($($el.find('tr')[y]).find('td')[x]);
        switch (type) {
            case 'live':
                css = 'b-canvas__cell-live';
                break;
            case 'died':
                css = 'b-canvas__cell-died';
                break;
            default:
                css = '';
                break;
        }        
        $cell.removeClass('b-canvas__cell-live b-canvas__cell-died').addClass(css);
    }

    this.clear = function () {
        $el.find('td').removeClass('b-canvas__cell-live b-canvas__cell-died');
    }

    $(el).delegate('td', 'click', function () {
        // trigger custom event, pass cell X and Y as a parameters
        $(el).trigger('cell-click', [$(this).index(), $(this).closest('tr').index()]);
    });
}