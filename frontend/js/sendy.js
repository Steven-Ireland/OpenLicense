$(document).ready(function() {
	$('[data-get]').each(function() {
		var el = $(this);
		var oldHtml = sendyPrepare(el);

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
				sendyLoadedList(el, data, oldHtml);
			});
		}
	});
});

function sendyPrepare(el) {
	el.addClass('sendy-loading');
	var oldHtml = el.html();
	el.html("<i class=\"fa fa-refresh fa-spin sendy-loading-icon\"></i>");
	return oldHtml;
}

function sendyLoaded(el, data) {
	el.removeClass('sendy-loading');
	el.html(data.value);
}

function sendyLoadedList(el, data, old) {
	el.removeClass('sendy-loading');
	el.html("");

	var template = el.attr('data-tmpl');
	$.each(data.value, function(i, d) {
		var rendered = Mustache.render($(template).html(), d);
		el.prepend($(rendered));
	});
	el.append($(old));
}
