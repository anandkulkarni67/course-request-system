var formId;
$(function() {    			
    initGoogleChart();
});

function initGoogleChart() {
	google.charts.load('current', {packages: ['corechart', 'bar']});  	
}

function drawCharts(formID) { 
    connectViaSocketForRealTimeData(); 
    $('#showStats').prop("disabled", true);    
    formId = formID;
    drawChart1(fetchStudentPreferenceData());
    drawChart2(fetchSeatAvailabilityData());
    drawChart3(fetchRequestsDistributionData());
    var slideshow = $.find('#slideshow');
    UIkit.slideshow(slideshow, {});
}

function connectViaSocketForRealTimeData() {
    var socket = io();
    socket.on('changeNotification', function(data) {
        console.log(data.requestsDistributionData);
        drawChart1(data.studentPreferenceData);
        drawChart2(data.seatAvailabilityData);        
        drawChart3(data.requestsDistributionData);
        UIkit.slideshow($.find('#slideshow'), {});
    });
}

function fetchStudentPreferenceData(){
    var studentPrefCountJson = $.ajax({
        url: "http://localhost:3000/studentPreferenceData?formId=" +formId + "&noPrefs=" + $("#noPrefs").val() + "",
        dataType: "json",
        async: false
    }).responseText;
    return studentPrefCountJson;
}

function fetchSeatAvailabilityData() {
    var seatAvailJson = $.ajax({
        url: "http://localhost:3000/seatAvailabilityData?formId=" +formId + "",
        dataType: "json",
        async: false
    }).responseText;
    return seatAvailJson;
}

function fetchRequestsDistributionData() {
    var requestsDistributionJson = $.ajax({
        url: "http://localhost:3000/requestsDistributionData?formId=" +formId + "",
        dataType: "json",
        async: false
    }).responseText;
    return requestsDistributionJson;
}

function refreshChart(chartName) {
    switch(chartName) {
        case "chart1":
            drawChart1(fetchStudentPreferenceData());
            break;
        case "chart2":
            drawChart2(fetchSeatAvailabilityData());
            break;
        case "chart3":
            drawChart3(fetchRequestsDistributionData());
            break;
        default:
            alert("0");
    }
    UIkit.slideshow($.find('#slideshow'), {});
}

function drawChart1(data) {
    var StudentPrefCountData = new google.visualization.DataTable(data);    
    var StudentPrefCountOptions = {
        isStacked: true,
        legend: {position: 'top', maxLines: 3},
        backgroundColor: "#D8D8D8",
        height: 500,
        bar: {groupWidth: "50%"},
        hAxis: {
            minValue: 0,            
            ticks: [0, .2, .4, .6, 0.8, 1.0]
        }
    };       
    var StudentPrefCountChart = new google.visualization.ColumnChart(document.getElementById('myPieChart'));
    StudentPrefCountChart.draw(StudentPrefCountData, StudentPrefCountOptions);
}

function drawChart2(data) {
    var seatAvailData = new google.visualization.DataTable(data);

    var seatAvailOptions = {        
        legend: {position: 'top', maxLines: 3},
        hAxis: {
            format: 'decimal'
        },
        height: 500,
        backgroundColor: "#D8D8D8",        
    };   

    var seatAvailChart = new google.charts.Bar(document.getElementById('myPieChart1'));
    seatAvailChart.draw(seatAvailData, google.charts.Bar.convertOptions(seatAvailOptions));
}

function drawChart3(data) {
    var requestsDistributionData = new google.visualization.DataTable(data);
    var requestsDistributionOptions = {        
        backgroundColor: "#D8D8D8",
        height: 500,
        is3D: true,
    };

    var requestsDistributionChart = new google.visualization.PieChart(document.getElementById('myPieChart2'));
    requestsDistributionChart.draw(requestsDistributionData, requestsDistributionOptions);      
}