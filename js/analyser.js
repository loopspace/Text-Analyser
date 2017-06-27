var texts = {
    PPCh1: "#PPchapter1",
    PPCh2: "#PPchapter2"
}

var actions = [
    {
	title: "countwords",
	header: "Number of words in text:",
	action: function(txt) {
	    var m = txt.match(/\s+/g);
	    var sp = $('<span></span>');
	    sp.text(m ? m.length : 0);
	    sp.addClass('output');
	    return sp;
	}
    },
    {
	title: "wordlength",
	header: "Lengths of words in text:",
	action: function(txt) {
	    var tbl = $('<table></table>');
	    tbl.addClass('wordlength');
	    var th = $('<th></th>');
	    var td = $('<td></td>');
	    td.text("Length");
	    th.append(td);
	    td = $('<td></td>');
	    td.text("Frequency");
	    th.append(td);
	    var lengths = [];
	    var reg = new RegExp(/\b\w+\b/g);   
	    var result;
	    while((result = reg.exec(txt)) !== null) {
		if (lengths[result[0].length]) {
		    lengths[result[0].length]++;
		} else {
		    lengths[result[0].length] = 1;
		}
	    }
	    var tr;
	    for (var i = 1; i < lengths.length; i++) {
		tr = $('<tr></tr>');
		td = $('<td></td>');
		td.text(i);
		tr.append(td);
		td = $('<td></td>');
		td.text(lengths[i]);
		tr.append(td);
		tbl.append(tr);
	    }
	    return tbl;
	}
    },
    {
	title: "countsentences",
	header: "Number of sentences in text:",
	action: function(txt) {
	    var m = txt.match(/[.!?]/g);
	    var sp = $('<span></span>');
	    var l = m ? m.length : 0;
	    m = txt.match(/Mrs?\./g);
	    var t = m ? m.length : 0;
	    sp.text(l - t);
	    sp.addClass('output');
	    return sp;
	}
    },
    {
	title: "sentencelength",
	header: "Lengths of sentences in text:",
	action: function(txt) {
	    var tbl = $('<table></table>');
	    tbl.addClass('wordlength');
	    var th = $('<th></th>');
	    var td = $('<td></td>');
	    td.text("Length");
	    th.append(td);
	    td = $('<td></td>');
	    td.text("Frequency");
	    th.append(td);
	    var m = txt.match(/\S+/g);
	    if (m) {
		var lengths = [];
		var l = 0;
		for (var i = 0; i < m.length; i++) {
		    l++;
		    if (m[i].match(/[.!?]/) && !m[i].match(/Mrs?\./)) {
			if (lengths[l]) {
			    lengths[l]++;
			} else {
			    lengths[l] = 1;
			}
			l = 0;
		    }
		}
		var tr;
		for (var i = 1; i < lengths.length; i++) {
		    if (lengths[i] > 0) {
			tr = $('<tr></tr>');
			td = $('<td></td>');
			td.text(i);
			tr.append(td);
			td = $('<td></td>');
			td.text(lengths[i]);
			tr.append(td);
			tbl.append(tr);
		    }
		}
	    }
	    return tbl;
	}
    },

];

function init() {
    $('#actions').sortable();
    $('#cmplist li').draggable({
	connectToSortable: "#actions",
	revert: "invalid",
	helper: "clone"
    });
    $('#srcs li').draggable({
	helper: "clone",
	revert: "invalid",
    });
    $('#source').droppable({
	accept: "#srcs li",
	drop: function (e,ui) {
	    $(e.target).val($(texts[ui.draggable.attr('id')]).text());
	}
    });
    $('#run').on("click",analyse);
}

$(window).on("load",init);

function analyse() {
    var text = $('#source').val();
    var tasks = $('#actions').children();
    var output = $('#output');
    var list = $('<ul></ul>');
    output.text('');
    output.append(list);
    var item,hdr;
    for (var i = 0; i < tasks.length; i++) {
	for (var j = 0; j < actions.length; j++) {
	    if ($(tasks[i]).hasClass(actions[j].title)) {
		item = $('<li></li>');
		hdr = $('<span></span>');
		hdr.addClass('header');
		hdr.text(actions[j].header);
		item.append(hdr);
		item.append(actions[j].action(text));
		list.append(item);
	    }
	}
    }
}
