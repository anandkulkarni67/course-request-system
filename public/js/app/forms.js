var selectedCourses = [];
var formsCollection = [];  		
$(function() {    			
    bindEvents();  
    initDateTimepicker();  
});

function initDateTimepicker() {
	var dateOptions = {
		format:'MM/DD/YYYY',
		minDate: 0
	}
	var timeOptions = {};
	UIkit.datepicker('#start_date', dateOptions);
	UIkit.datepicker('#end_date', dateOptions);
	UIkit.timepicker('#start_time', timeOptions);
	UIkit.timepicker('#end_time', timeOptions);
}

function bindEvents() {        	
    $("#addCourse").on("click", function(event) {
    	event.preventDefault();
    	var val = $("#course_name").val();    	
		var cid = document.querySelector("#courses option[value='"+ val +"']").dataset.value;
		updateCourseSelection(val, cid);
    });
    $("#createForm").on("click", function(event) {
    	event.preventDefault();
    	var selectedCourseList = getCommaSperatedCourseList();
    	if(validateForm(selectedCourseList)) {	    	
			var data = {
				title: $("#form_title").val(),
				courses: selectedCourseList,
				preferenceCount: $("#pref_count").val(),
				start_date: $("#start_date").val(),
				start_time: $("#start_time").val(),
				end_date: $("#end_date").val(),
				end_time: $("#end_time").val()
			};
			$.post("http://localhost:3000/createForm", data,
			    function(data, status){
			    	if(status === 'success') {
			    		clearForm();
						UIkit.notify('<i class=\'uk-icon-small uk-icon-check\'></i> Form creation is COMPLETE.', {status:'success', pos:'bottom-right'});
			    	} else {
			    		UIkit.notify('<i class=\'uk-icon-small uk-icon-close\'></i> There was an error.', {status:'danger', pos:'bottom-right'});
			    	}		        
			    }
			);
		}
  	});
  	$("#forms").on("click", function(event) {
    	event.preventDefault();
    	displayForms();
    });
}

function clearForm() {
	selectedCourses.length = 0;
	$("#selectedListTable tr").empty();
	$("#pref_count").val(0);
	$("#form_title").val('');
	$("#start_date").val('');
	$("#end_date").val('');
	$("#start_time").val('');
	$("#end_time").val('');
}

function updateCourseSelection(val, cid) {
	var rowId = 'rowId_' + cid;
	if(alreadyExists(rowId)) {
		UIkit.notify('<i class=\'uk-icon-small uk-icon-check\'></i> ' + val + ' is already selected.', {status:'warning', pos:'bottom-right'});
	} else {
    	var row = "<tr id=" + rowId + " data-uid= " + cid + " >";
			row += "<td>";
			row += "<div class='course'>";
			row += "<div>";
			row +=  val;				
			row += "<a title='Remove' data-uk-tooltip='{pos:'bottom'}' class='uk-icon-small uk-align-right uk-icon-close' onclick = 'removeCourse("+ rowId +")'></a>";
			row += "</div>";
			row += "</div>";
			row += "</td>";
			row += "</tr>";
        $("#selectedListTable").append(row);	                    
        selectedCourses.push(rowId);
    }
    $('#course_name').val('');
}

function displayForms() {
	$("#forms-container").empty();
	var today = new Date();
	$.get("http://localhost:3000/getAllForms", function(data, status){
		if(status === 'success') {			
			formsCollection = data;
			console.log(formsCollection);
			data.forEach( function (form) {
				var start_time = new Date(form.START_TIME);
				var end_time = new Date(form.END_TIME);
				var creation_time = new Date(form.CREATION_DATE);
				var rowId = 'rowId_' + form.FORM_ID;
				var row = "<article id=" + rowId + " data-uid= " + form.FORM_ID + " class='uk-panel uk-panel-box uk-border-rounded uk-margin-bottom uk-comment'>";
					row += "<header class='uk-comment-header uk-grid-medium uk-flex-middle' uk-grid>";
				    row += "<div class='uk-width-auto'>";
					row += "<img class='uk-comment-avatar' src='./images/form.png' width='80' height='80' alt=''>";
					row += "</div>";
					row += "<div class='uk-width-expand'>";
					row += "<h4 class='uk-comment-title'>" + form.TITLE;
					row += "<div class='uk-button-group uk-align-right'>";
				 	row += "<a title='dashboard' data-uk-tooltip='{pos:'bottom'}' class='uk-button' href='http://localhost:3000/dashboard?formId=" + form.FORM_ID + "'><i class='uk-icon-dashboard'></i></a>";
				 	row += "<a title='Copy' data-uk-tooltip='{pos:'bottom'}' class='uk-button' onclick ='copyForm(" + rowId + ")'><i class='uk-icon-copy'></i></a>";
				 	row += "<a title='Expand/Collapse' data-uk-tooltip='{pos:'bottom'}' class='uk-button' id='form-details-toggle-" + rowId + "'><i class='uk-icon-expand'></i></a>";
					row += "<a title='Remove' data-uk-tooltip='{pos:'bottom'}' class='uk-button' onclick = 'removeForm("+ rowId +")'><i class='uk-icon-close'></i></a>";
				 	row += "</div>";
				 	row += "</h4>";
					row += "<div class='uk-comment-meta'>";
					row += "<div>";
					row += "<label class='uk-text-bold'><i class='uk-icon-calendar'></i> &nbsp &nbsp" + creation_time.toLocaleString() + "</label>";
					row += "</div>";
					row += "<div>";					
					row += "<label class='uk-text-bold'><i class='uk-icon-hourglass-start'></i> &nbsp &nbsp" + start_time.toLocaleString() + "</label>";
					row += "&nbsp&nbsp | &nbsp&nbsp";
					row += "<label class='uk-text-bold'><i class='uk-icon-hourglass-end'></i> &nbsp &nbsp" + end_time.toLocaleString() + "</label>";
					row += "</div>";
					row += "</div>";
					row += "<div ";					
					if(today.getTime() < start_time) {
						row += "class='uk-badge uk-badge-success'>";
						row += "Upcoming";
					} else {
						if (today.getTime() > start_time && today.getTime() < end_time) {
							row += "class='uk-badge uk-badge-danger'>";
							row += "Active";
						} else {
							row += "class='uk-badge uk-badge-warning'>";
							row += "Inactive";
						}
					}										
					row += "</div>";					
					row += "</div>";					
					row += "</header>";
				    row += "<div id = 'form-details-container-" + rowId + "' class='uk-comment-body uk-margin-remove'>";					
				    row += "<div class='courseList-container'>";
				    row += "<hr class='uk-divider-icon'>";
					row += "<div class='list-type1'>"
					row += "<ol>";
					form.courses.forEach(function (course) {
						row += "<li><a>" + course.COURSE_CODE + "-" + course.TITLE + "</a></li>";
					});
					row += "</ol>";
					row += "</div>";
					row += "</div>";
					row += "<hr class='uk-divider-icon'>";
					row += "<div class='uk-text-center'>";
				 	row += "<label for='pref_count'> Number of Preferences : " + form.NO_PREFERENCES + "</lable>";
				 	row += "</div>";					
					row += "</div>";					
				    row += "</article>";				    				    
			    $("#forms-container").append(row);
			});
			$("div[id*=form-details-container-]").each(function() {
		        $(this).hide();
		    });
		    $("a[id*=form-details-toggle-]").each(function() {		    			
		    	$(this).on('click', function () {		    		
		    		buttonId = $(this).attr('id');
		    		containerId = buttonId.replace('toggle', 'container');			    		
		    		$("#" + containerId).toggle('slow',
			    		function () {
			    			if ($("#" + buttonId).hasClass('uk-icon-expand')) {
					        	$(this).show();
				    			$("#" + buttonId).removeClass('uk-icon-expand');
				    			$("#" + buttonId).addClass('uk-icon-compress');    
					        } else {
					            $(this).hide();
				    			$("#" + buttonId).removeClass('uk-icon-compress');
				    			$("#" + buttonId).addClass('uk-icon-expand');
					        }		    			
			    		}
		    		);		
		    	});			    				  
		    });
		}
    });    
}

function openDashBoard(formId) {
	$.post("http://localhost:3000/createForm", data,
	    function(data, status){

	    }
	);
}

function alreadyExists(rowId) {
	var exists = false;
	selectedCourses.forEach(function (id) {
		if(rowId === id) {
			exists = true;
			return;
		}
	});
	return exists;
}

function getSelectedCourseList() {
    var courseList = [];
    var tr = $("#selectedListTable").find("tr");
    for (var counter = 0; counter < tr.length; counter++) {
        courseList.push($(tr).eq(counter).data('uid'));
    }
    return courseList;
}
function getCommaSperatedCourseList() {
    var list = getSelectedCourseList();
    var string = "";
    for (var i = 0; i < list.length; i++) {
        var id = list[i];
        if (i > 0) {
            string += ",";
        }
        string += id;
    }
    return string;
}

function removeCourse(cid) {
	cid.remove();
}

function removeForm(fid) {		
    $(this).blur();
    UIkit.modal.confirm('Are you sure, you want to delete this form ?', function() {
    	var data = {
			form_id: $(fid).data('uid')
		}
		$.post("http://localhost:3000/removeForm", data,
		    function(data, status){
		    	if(status === 'success') {
		    		console.log('success');	    		
		    		fid.remove();
		    		UIkit.notify('<i class=\'uk-icon-small uk-icon-check\'></i> Form removal is COMPLETE.', {status:'success', pos:'bottom-right'});
		    	} else {
		    		UIkit.notify('<i class=\'uk-icon-small uk-icon-close\'></i> There was an error.', {status:'danger', pos:'bottom-right'});
		    	}
		    }
		);        
    }, function () {
        console.log('Rejected.');
    });	
}

function copyForm(fid) {
	UIkit.switcher('#options').show(0);
	var form_id = $(fid).data('uid');
	var existingFormDetails;
	formsCollection.forEach(function(form) {
		if(form.FORM_ID === form_id) {
			existingForm = form;
			return ;
		}
	});
	if(typeof existingForm !== 'undefined') {
		$('#form_title').val(existingForm.TITLE + ' (copy)');
		$('#pref_count').val(existingForm.NO_PREFERENCES);
		existingForm.courses.forEach(function (course) {						
			var courseDesc = course.COURSE_CODE + '-' + course.TITLE;
			updateCourseSelection(courseDesc, course.COURSE_ID);
		});
	} else {
		alert('Form details not found !');
	}
}

function validateForm(selectedCourseList){
	var elementsMap = new Object();
	var validate = true;
	elementsMap['pref_count'] = 'Preference Count';
	elementsMap['start_date'] = 'Start Date';
	elementsMap['start_time'] = 'Start Time';
	elementsMap['end_date'] = 'End Date';
	elementsMap['end_time'] = 'End Time';
	elementsMap['form_title'] = 'Form Title';
	for(var key in elementsMap) {		
		if($('#' + key).val() == "") {
			UIkit.notify('<i class=\'uk-icon-small uk-icon-close\'></i> ' + elementsMap[key] + ' can not be empty.', {status:'danger', pos:'bottom-right'});
			validate = false;
		}
	}
	if(selectedCourseList == "") {
		UIkit.notify('<i class=\'uk-icon-small uk-icon-close\'></i> Please add 1 or more courses to the form.', {status:'danger', pos:'bottom-right'});
		validate = false;
	}
	if(getSelectedCourseList().length < $('#pref_count').val()) {
		UIkit.notify('<i class=\'uk-icon-small uk-icon-close\'></i> Please add at least minimum number of courses to match preference count. ', {status:'danger', pos:'bottom-right'});		
		validate = false;
	}
	return validate;
}