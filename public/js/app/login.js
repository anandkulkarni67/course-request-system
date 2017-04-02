$(function() {    			
    bindEvents();      
});

function bindEvents() {	
	$('#username').focus(function () {
		$('#error-container').hide();
	});
	$('#password').focus(function () {
		$('#error-container').hide();
	});
}