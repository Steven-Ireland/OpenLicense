$(document).ready(function() {
	$('[data-get]').each(function() {
		var el = $(this);
		sendyPrepare(el);

		var tagName = el.prop('tagName');
		console.log(tagName);
		switch(tagName) {
			case "P":
			case "H1":
			case "H2":
				$.ajax({
					url: el.attr('data-get')
				}).done(function(data) {
					sendyLoaded(el, data);
				});
				break;
			case "UL":
			case "OL":
			$.ajax({
				url: el.attr('data-get')
			}).done(function(data) {
				sendyLoadedList(el, data);
			});
		}
	});
});

function sendyPrepare(el) {
	el.addClass('sendy-loading');
	el.html("<i class=\"fa fa-refresh fa-spin sendy-loading-icon\"></i>");
}

function sendyLoaded(el, data) {
	el.removeClass('sendy-loading');
	el.html(data.value);
}

function sendyLoadedList(el, data) {
	el.removeClass('sendy-loading');
	el.html("");

	var template = el.attr('data-tmpl');
	$.each(data.value, function(i, d) {
		var rendered = Mustache.render($(template).html(), d);
		el.prepend($(rendered));
	})
}
