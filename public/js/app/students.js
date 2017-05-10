$(function() {    			    
});

function submitForm(formId) {
	var counter = 0;
	var preferences = getPreferences(formId);
	var data = {
		formId: formId,
		preferences: preferences
	};
	$.post("http://localhost:3000/submitForm", data,
	    function(data, status){
	    	if(status === 'success') {
	    		console.log('success');	    			    		
	    		UIkit.notify('<i class=\'uk-icon-small uk-icon-check\'></i> Form submission is COMPLETE.', {status:'success', pos:'bottom-right'});
	    	} else {
	    		UIkit.notify('<i class=\'uk-icon-small uk-icon-close\'></i> There was an error.', {status:'danger', pos:'bottom-right'});
	    	}
	    }
	); 
}

function getPreferences(formId) {
	var preferences = $("#"+ formId).find("input[type=\"radio\"]:checked");	
	var preferenceList = [];
	for(counter = 0; counter < preferences.length; counter++) {		
		var dataUID = $(preferences).eq(counter).data('uid').split("_");		
		preferenceList.push({
			courseCode: dataUID[0],
			preference: dataUID[1]
		});
	}
	return preferenceList;
}

function resetPrefs(preference) {
	var id = $(preference).attr('id');
	console.log(id);
	var idSplit =  id.split("_");
	console.log(idSplit);
	var allCourses = $('article[id='+ idSplit[0] +']').find('input:radio[id$=_'+ idSplit[2] +']');
	console.log(allCourses);
	var counter = 0;
	for(counter = 0; counter < allCourses.length; counter++) {
		var course = $(allCourses).eq(counter);
		if($(course).attr('id') !== id && $(course).is(':checked')) {
			$(course).prop('checked', false);
		}
	}
}