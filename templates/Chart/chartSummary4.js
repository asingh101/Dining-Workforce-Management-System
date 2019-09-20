var pie;

function openHoursSummary()
{
	var ctx = $("#hoursSummaryChart").get(0).getContext("2d");
    pie = new Chart(ctx).Doughnut(chartData);
	document.getElementById('subShiftBlock').style.display = "none";
	document.getElementById('hoursBlock').style.display = "none";
	document.getElementById('hoursWorked').innerHTML = chartData[0].value;
	document.getElementById('hoursRemain').innerHTML = chartData[1].value;
}

$(document).ready(function(){
	document.getElementById('hoursSummaryChart').addEventListener('click', function(e) {
			document.getElementById('detailsContainer').style.display = "";
		document.getElementById('hoursBlock').style.display = "block";
		document.getElementById('subShiftBlock').style.display = "none";
		document.getElementById('hoursWorked').innerHTML = chartData[0].value;
		document.getElementById('hoursRemain').innerHTML = chartData[1].value;

	});
});
