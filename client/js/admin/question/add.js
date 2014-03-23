/*global, jquery $*/
(function ($) {
	var hours = [];
	hours.push({name:"시간선택", value:""});
	for (var i = 0; i < 24; i++) {
		var value = i;
		var name = (i % 12) ? i % 12 : 12;
		var ampm = (i >= 12) ? 'PM' : 'AM';
		
		value = ('00' + value).slice(-2);
		name  = ('00' + name).slice(-2);
		
		hours.push({
				name  : name  + ':00 ' + ampm,
				value : value + ':00'
		});
		
		hours.push({
			name  : name  + ':30 ' + ampm,
			value : value + ':30'
		});
	}

	$.each(hours, function(index, item) {
        $('._hours').append('<option value="' + item.value + '">' + item.name + '</option>');
    });
}(jQuery));