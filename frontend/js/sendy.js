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
