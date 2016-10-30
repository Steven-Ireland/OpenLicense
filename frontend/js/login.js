$(document).ready(function() {
	$("input").keypress(function(event) {
		console.log('hi');
	    if (event.which == 13) {
	        event.preventDefault();
	        $("form").submit();
	    }
	});
});
