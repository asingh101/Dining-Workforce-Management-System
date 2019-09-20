// Global instance of the calendar to be used in other scripts.
var $calender= $("#myScheduleCalender").fullCalendar("getCalendar");
var clikedEvent;
var $availableShiftCal = $("#availableShiftsCalender").fullCalendar("getCalendar");
var netID;

$(document).ready(function(){
	
	$('#DashBoard a[data-toggle="tab"]').bind('click', function (e) {
            document.getElementById('subShiftBlock').style.display = "none";
        });
	document.getElementById('defaultOpen').onclick();
	document.getElementById('defaultOpen').classList.add('active');
});


function getActiveTabElement(evt, tabName) {
    var i, tabcontent,tablinks;
	document.getElementById('detailsContainer').style.display = "none";
	
	tabcontent = document.getElementsByClassName("tabcontent");

    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace("active", "");
    }
	document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
	alert(data);
}

function openMyScheduleCalender()
{
	$calender = $("#myScheduleCalender").fullCalendar({
				header: {
				left: 'title',
				center: '',
				right: 'month,agendaWeek,agendaDay prev,next'
	},
				selectable: true,
				// Python function to retrieve current schedule from database
				events : {
						url: '/MySchedule',
						error: function() {
						alert('Error fetching events');
				}
				},
				select: function(start, end, allDay) {
					document.getElementById('subShiftBlock').style.display = "none";
					
				},
				// Make events editable, globally
				// This is the callback that will be triggered when a selection is made
				eventClick: function(event, jsEvent, view) {
					clikedEvent = event;
					// Update UI of dashboard
					document.getElementById('detailsContainer').style.display = "";
					document.getElementById('hoursBlock').style.display = "";
					document.getElementById('subShiftResult').innerHTML = "";
					document.getElementById('subShiftBlock').style.display = "block";
					document.getElementById('startDate').value = event.start.format("MM/DD/YYYY hh:mm a");
					document.getElementById('endDate').value =  event.end.format("MM/DD/YYYY hh:mm a");
					document.getElementById('authorRow').style.display = "none";
					document.getElementById('pickShiftRow').style.display = "none";
					document.getElementById('subShiftRow').style.display = "";
					
					var currentDate = moment();
					// Disable events which are before todays date
					if(event.start.isBefore(currentDate) && event.end.isBefore(currentDate))
					{
						document.getElementById('subShift').disabled = true;
						document.getElementById('subShift').classList.add('disable');
					}				
					else
					{
						document.getElementById('subShift').disabled = false;
						document.getElementById("subShift").classList.remove('disable');
						document.getElementById("subShift").classList.add('subShift');
					}
		},		
		});
}

function openSubShiftCalender()
{
	$availableShiftCal = $("#availableShiftsCalender").fullCalendar({ // Start of options
				header: {
				left: 'title',
				center: '',
				right: 'month,agendaWeek,agendaDay prev,next'
	},
				selectable: true,
				//python function to get actual available shifts
				events : {
						url: '/AvailableShifts',
						error: function() {
						alert('Error fetching events');
				}
				},
				// Make events editable, globally
				// This is the callback that will be triggered when a selection is made
				select: function(start, end, allDay) {
					document.getElementById('subShiftBlock').style.display = "none";
				},
				eventClick: function(event, jsEvent, view) {
				clikedEvent = event;
					document.getElementById('detailsContainer').style.display = "";
				document.getElementById('subShiftResult').innerHTML = "";
				document.getElementById('subShiftBlock').style.display = "block";
				document.getElementById('hoursBlock').style.display = "";
				document.getElementById('authorRow').style.display = "";
				document.getElementById('pickShiftRow').style.display = "";
				document.getElementById('authorRow').style.display = "";
				document.getElementById('subShiftRow').style.display = "none";
				document.getElementById('startDate').value = event.start.format("MM/DD/YYYY hh:mm a");
				document.getElementById('endDate').value =  event.end.format("MM/DD/YYYY hh:mm a");
				document.getElementById('author').value = event.author;				
					var currentDate = moment();
					// Disable events which are before todays date
					if(event.start.isBefore(currentDate) && event.end.isBefore(currentDate))
					{
						document.getElementById('pickShift').disabled = true;
						document.getElementById("pickShift").classList.toggle('disable');
					}	
					else
					{
						document.getElementById('pickShift').disabled = false;
						document.getElementById("pickShift").classList.remove('disable');
						document.getElementById("pickShift").classList.add('pickShift');
					}
					
		},		
		});
}

//Function to sub current selected shift
function subShift()
{
	var retrnVal = confirm("Do you really want to sub this shift?");	
	var subShiftResult = document.getElementById('subShiftResult');

	if (retrnVal == true) 
	{
		// Add this shift to sub shift db, available shifts
		subShiftResult.innerHTML = "Your shift is removed from your schedule and available to others!";	
		$.ajax({
            url: '/SubShift',
			contentType : 'application/json; charset=utf-8',
			data : JSON.stringyfy({'start' : '2018-05-03'}),
            type: 'POST', 
            error: function() {
                alert("error");
            }
        });
		var eventID = clikedEvent._id;
		$calender.fullCalendar("removeEvents", eventID);		
	}
    else
	{
		subShiftResult.innerHTML = "";
	}		
}

//Function to pick current selected shift
function pickShift()
{
	var retrnVal = confirm("Do you really want to pick this shift?");	
	var subShiftResult = document.getElementById('subShiftResult');
	if (retrnVal == true) 
	{
		// Add this shift to sub shift db, available shifts
		subShiftResult.innerHTML = "This shift is added to your schedule";	
		$.ajax({
            url: '/PickShift',
            type: 'POST', 
            error: function() {
                alert("error");
            }
        });
		var eventID = clikedEvent._id;
		$availableShiftCal.fullCalendar("removeEvents", eventID);	
	}
    else
	{
		subShiftResult.innerHTML = "";
	}		
}



