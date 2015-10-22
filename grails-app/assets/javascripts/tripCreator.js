var map;
var startMarker;
var endMarker;
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var route;
var viewRouteButton;
var scheduleButton;
var saveButton;
var loadButton;
var deleteButton;
var routeDialog;
var collectionPoints = [];
var collectionMarkers = [];
var selectedVehicleId;
var openedMoreVehicles = false;
var vehicleTable;
var tripTable;
var deleteTripTable;
var $selectedVehicleRow;
var $selectedTripRow;
var $selectedDeleteTripRow;
var selectedTripId;
var selectedDeleteTripId;
var elapsedDistance;
var loadingTrip = false;
var polyline;
var eventMarkers = [];
var polyLatLngs;
var selectedEvent;
var events = [];

$(document).ready(function() {

	$(".minOverMax").html("Minimum value must be less than the maximum.");
	$(".validationErrorMessage").hide();
	$("input, select, textarea").addClass("text ui-widget-content ui-corner-all");

	$("#selectVehicle").val(selectedVehicleId);

	if(vehicleNamesSize > 2)
	{
		var opt = document.createElement('option');
		opt.innerHTML = "More Vehicles...";
		opt.value = -1;
		$("#selectVehicle").append(opt);
	}


	moreVehiclesDialog = $( "#moreVehicles-dialog" ).dialog({
		autoOpen: false,
		width: '600',
		modal: true,
		buttons: [
			{
				text: "Select",
				id: "confirmSelectedVehicle",
				click: function()
				{
					setSelectedVehicle(selectedVehicleId);
					moreVehiclesDialog.dialog("close");
				}
			},
			{
				text: "Cancel",
				click: function() {
					moreVehiclesDialog.dialog( "close" );
				}
			}
		],
		close: function() {
			$("#selectVehicle").val(selectedVehicleId)
		}
	});
	
	addEventDialog = $( "#addEvent-dialog" ).dialog({
		autoOpen: false,
		width: '500',
		modal: true,
		buttons: [
			{
				text: "Add Event",
				id: "confirmAddEventButton",
				click: function()
				{
					addEvent(selectedEvent);
					addEventDialog.dialog("close");
				}
			},
			{
				text: "Cancel",
				click: function() {
					addEventDialog.dialog( "close" );
					removePolyline();
				}
			}
		]
	});


	overwriteTripDialog = $( "#overwriteTrip-dialog" ).dialog({
		autoOpen: false,
		width: 'auto',
		modal: true,
		buttons: [
			{
				text: "Yes",
				id: "overwriteButton",
				click: function()
				{
					var tripSettings = getTripSettings();
					$.ajax({
						type: 'post',
						url: requestPath + "/tripCreator/overwriteTrip",
						data: { tripSettings: JSON.stringify(tripSettings) },
						dataType: "text",
						success: function (response, status, xml) {
							$("#markAsUnsaved").hide();
							overwriteTripDialog.dialog( "close" );
						},
						error: function(error) {
							console.log(error);
							alert(error);
						}
					});
				}
			},
			{
				text: "No",
				click: function() {
					overwriteTripDialog.dialog( "close" );
				}
			}
		],
		close: function() {

		}
	});
	
	confirmDeleteTripDialog = $( "#confirmDeleteTrip-dialog" ).dialog({
		autoOpen: false,
		width: '250',
		modal: true,
		buttons: [
			{
				text: "Yes",
				click: function()
				{
					$.ajax({
						type: 'post',
						url: requestPath + "/tripCreator/deleteTrip",
						data: { tripId: selectedDeleteTripId},
						dataType: "text",
						success: function (response, status, xml) {
							confirmDeleteTripDialog.dialog( "close" );
						},
						error: function(error) {
							console.log(error);
							alert(error);
						}
					});
				}
			},
			{
				text: "No",
				click: function() {
					confirmDeleteTripDialog.dialog( "close" );
				}
			}
		]
	});
	
	saveTripDialog = $( "#saveTrip-dialog" ).dialog({
		autoOpen: false,
		width: 'auto',
		modal: true,
		buttons: [
			{
				text: "Save",
				id: "saveAsButton",
				click: function()
				{
					var tripSettings = getTripSettings();
					$.ajax({
						type: 'post',
						url: requestPath + "/tripCreator/checkSaveName",
						data: { tripSettings: JSON.stringify(tripSettings) },
						dataType: "json",
						success: function (response, status, xml) {
							saveTripDialog.dialog( "close" );
							if(response.overwrite === true)
							{
								$("#overwriteTrip-dialog").load(requestPath + "/tripCreator/overwriteTripDialog", {name: response.name}, function(response, status, xhr) {									
									overwriteTripDialog.dialog( "open" );	
								});
							}
							else
							{
								$("#currentTripName").html(response.name);
								$("#markAsUnsaved").hide();
							}
						},
						error: function(error) {
							console.log(error);
							alert(error);
						}
					});
				}
			},
			{
				text: "Cancel",
				click: function() {
					saveTripDialog.dialog( "close" );
				}
			}
		],
		close: function() {

		}
	});
	
	loadTripDialog = $( "#loadTrip-dialog" ).dialog({
		autoOpen: false,
		width: '600',
		modal: true,
		buttons: [
			{
				text: "Load",
				id: "dialogLoadButton",
				click: function()
				{
					$.ajax({
						type: 'post',
						url: requestPath + "/tripCreator/loadTrip",
						data: { tripId: selectedTripId },
						dataType: "json",
						success: function (response, status, xml) {
							$("#currentTripName").html(response.name);
							loadTripSettings(response);
							loadTripDialog.dialog( "close" );
							$("#markAsUnsaved").hide(); 
						},
						error: function(error) {
							console.log(error);
							alert(error);
						}
					});
				}
			},
			{
				text: "Cancel",
				click: function() {
					loadTripDialog.dialog( "close" );
				}
			}
		],
		close: function() {

		}
	});
	
	deleteTripDialog = $( "#deleteTrip-dialog" ).dialog({
		autoOpen: false,
		width: '600',
		modal: true,
		buttons: [
			{
				text: "Delete",
				id: "dialogDeleteButton",
				click: function()
				{
					deleteTripDialog.dialog( "close" );
					$("#confirmDeleteTrip-dialog").load(requestPath + "/tripCreator/confirmDeleteTripDialog", {tripId: selectedDeleteTripId},function(response, status, xhr) {
						confirmDeleteTripDialog.dialog("open"); 
					});
				}
			},
			{
				text: "Cancel",
				click: function() {
					deleteTripDialog.dialog( "close" );
				}
			}
		],
		close: function() {

		}
	});
	
	loadingTripDialog = $("#loadingTrip-dialog").dialog({
		autoOpen: false,
		width: '200',
		modal: true,
		closeOnEscape: false,
		dialogClass: 'no-close',
		resizable: false,
		draggable: false

		});

	tripScheduledSuccessDialog = $("#tripScheduledSuccess-dialog").dialog({
		autoOpen: false,
		moodal:true
	});

	initialize();
	
	viewRouteButton = $("#viewRoute").button({disabled:true}).click(showRoute);
	scheduleButton = $("#schedule").button({disabled:true}).click(scheduleTrip);
	
	saveButton = $("#save").button().click(function(){	
		
		$("#saveTrip-dialog").load(requestPath + "/tripCreator/saveTripDialog", function(response, status, xhr) {
			saveTripDialog.dialog("open"); 
		});
		
	});
	
	loadButton = $("#load").button().click(function(){	
		$("#loadTrip-dialog").load(requestPath + "/tripCreator/loadTripDialog", function(response, status, xhr) {});		
	});
	deleteButton = $("#delete").button().click(function(){	
		$("#deleteTrip-dialog").load(requestPath + "/tripCreator/deleteTripDialog", function(response, status, xhr) {});
	});
	
	addEventButton = $("#addEventButton").button({disabled:true}).click(function(){	
		directionsDisplay.setOptions({draggable:false});
		polyline.setPath(polyLatLngs);
		 polyline.setMap(map);
	});
	
	routeDialog = $("#routeDialog").dialog({
		autoOpen:false,
		width:1200,
		height:"auto",
		maxHeight:500
	});



	$("input[type=checkbox]").click(function() {
		var fieldSet = $(this).closest("fieldset");  
		
		if(this.checked)
		{
			enableField(this);
			//TODO calc spinner var
			updateCollectionVar($(fieldSet).attr("id"));
		}
		else
		{
			disableField(this);
			for(i=0; i<collectionPoints.length; i++)
			{		
				delete (collectionPoints[i][$(fieldSet).attr("id")]);			
			}
			
		}

	});
	
	$("#minEngineTemp").spinner({
		min:65,
		max:130,
		step:5,
		disabled:true
	});
	$("#minEngineTemp").spinner("value", 75);

	
	$("#maxEngineTemp").spinner({
		min:65,
		max: 130,
		step:5,
		disabled:true
	});
	$("#maxEngineTemp").spinner("value", 105);

	$("#minFuelRate").spinner({
		min:0,
		max:5,
		step:.5,
		disabled:true
	});
	$("#minFuelRate").spinner("value", 0.5);

	
	$("#maxFuelRate").spinner({
		min:0,
		max:5,
		step:.5,
		disabled:true
	});
	$("#maxFuelRate").spinner("value", 2.5);

	$("#minFuelLevel").spinner({
		min:0,
		max:100,
		step:5,
		disabled:true
	});
	$("#minFuelLevel").spinner("value", 0);

	
	$("#maxFuelLevel").spinner({
		min:0,
		max:100,
		step:5,
		disabled:true
	});
	$("#maxFuelLevel").spinner("value", 100);

	$("#minRPM").spinner({
		min:0,
		max:8000,
		step:100,
		disabled:true
	});
	$("#minRPM").spinner("value", 1000);

	
	$("#maxRPM").spinner({
		min:0,
		max:8000,
		step:100,
		disabled:true
	});
	$("#maxRPM").spinner("value", 3000);

	$("#minVoltage").spinner({
		min:0,
		max:15,
		step:0.1
	});
	$("#minVoltage").spinner("value", 13);
	
	$("#maxVoltage").spinner({
		min:0,
		max:15,
		step:0.1
	});
	$("#maxVoltage").spinner("value", 14.5);
	
	$("#minSpeed").spinner({
		min:0,
		max:100,
		step:1
	});
	$("#minSpeed").spinner("value", 45); 
	
	$("#maxSpeed").spinner({
		min:0,
		max:100,
		step:1
	});
	$("#maxSpeed").spinner("value", 55); 
	
	$("#startTime").datetimepicker({
		"onSelect": function() {
			if(collectionPoints.length > 1)
			{		
				var timeStamp = $("#startTime").datetimepicker("getDate");
				collectionPoints[0]["timestamp"] = timeStamp;			
				var elapsedSeconds = 0;
				for(i=1; i<collectionPoints.length-1; i++)
				{	
					collectionPoints[i]["timestamp"] = new Date(+collectionPoints[i-1]["timestamp"] + collectionPoints[i]["elapsedSeconds"] *1000);	
				}
				collectionPoints[collectionPoints.length-1]["timestamp"] = new Date(+collectionPoints[collectionPoints.length-2]["timestamp"] + collectionPoints[collectionPoints.length-1]["elapsedSeconds"] *1000);
			}
		}
	});

	$("#startTime").datetimepicker("setDate", new Date());
	
	$(".spinnerInput").on("spinstop", function() {
		var val = parseInt($(this).val());
		var id = $(this).attr('id');
		var minOverMaxError = false;
		
		if(id.substring(0,3) == "min")
		{
			var otherValString = "#max" + id.substring(3,id.length);
			if(val > parseInt($(otherValString).val()))
			{
				minOverMaxError = true
			} 
		}
		else if(id.substring(0,3) == "max")
		{
			var otherValString = "#min" + id.substring(3,id.length);
			if(val < parseInt($(otherValString).val()))
			{
				minOverMaxError = true
			} 
		}

		if(minOverMaxError)
		{
			$("#minOverMax" + id.substring(3,id.length)).show();
			var minId = "#min" + id.substring(3,id.length) + "Error";
			var maxId = "#max" + id.substring(3,id.length) + "Error";
			$(minId).html("").hide();
			$(maxId).html("").hide();
		}

		else
		{
			$("#minOverMax" + id.substring(3,id.length)).hide();
			$.ajax({
				type: 'post',
				url: requestPath + "/tripCreator/validateInputAjax",
				data: { val: val},
				dataType: "json",
				success: function (response, status, xml) {
					var errorId = "#" + id + "Error";
					if(response.error)
					{
						$(errorId).html(response.error).show();
					}
					else
					{
						updateCollectionVar(id.substring(3,id.length));
						$(errorId).html("").hide();
					}
				},
				error: function(error) {
					console.log(error);
					alert(error);
				}
			});
		}	
	});


	$("#collectionPeriodSeconds").on("change", function() {
		showCollection();
		for (var i = 0; i < eventMarkers.length; i++)
		{
			eventMarkers[i].setMap(null);
		}
		eventMarkers = [];
	});

	$("#collectionPeriodSeconds, #startTime").addClass("ui-widget ui-widget-content ui-corner-all");

	$("#tripControls :input").change(markAsUnsaved);
	$("#tripControlButtons :button").click(removePolyline);
	$("#selectVehicle").click(removePolyline);
	$( ".spinnerInput" ).on( "spin", markAsUnsaved );
	
});

function markAsUnsaved()
{
	removePolyline();
	$("#markAsUnsaved").show();
}

function updateCollectionVar(name)
{
	name = name.toUpperCase();
	if(name == "SPEED")
	{
		showCollection();
	}
	
	else if(name == "VOLTAGE")
	{
		for(i=0; i<collectionPoints.length; i++)
		{
			collectionPoints[i]["voltage"] = (1-Math.random()) * ($("#maxVoltage").spinner("value") - $("#minVoltage").spinner("value")) + $("#minVoltage").spinner("value");
		}
	}
	else if(name == "RPM")
	{
		for(i=0; i<collectionPoints.length; i++)
		{
			collectionPoints[i]["RPM"] = (1-Math.random()) * ($("#maxRPM").spinner("value") - $("#minRPM").spinner("value")) + $("#minRPM").spinner("value");
		}
	}
	else if(name == "FUELLEVEL")
	{
		for(i=0; i<collectionPoints.length; i++)
		{
			collectionPoints[i]["fuelLevel"] = (1-Math.random()) * ($("#maxFuelLevel").spinner("value") - $("#minFuelLevel").spinner("value")) + $("#minFuelLevel").spinner("value");
		}
	}
	else if(name == "FUELRATE")
	{
		for(i=0; i<collectionPoints.length; i++)
		{
			collectionPoints[i]["fuelRate"] = (1-Math.random()) * ($("#maxFuelRate").spinner("value") - $("#minFuelRate").spinner("value")) + $("#minFuelRate").spinner("value");
		}
	}
	else if(name == "ENGINETEMP")
	{
		for(i=0; i<collectionPoints.length; i++)
		{
			collectionPoints[i]["engineTemp"] = (1-Math.random()) * ($("#maxEngineTemp").spinner("value") - $("#minEngineTemp").spinner("value")) + $("#minEngineTemp").spinner("value");
		}
	}
}


function loadTripSettings(response)
{

	loadingTrip = true;
	collectionPoints = $.parseJSON(response.collectionPoints);
	if(collectionPoints != null)
	{
		for (var i = 0; i < collectionMarkers.length; i++) {
			collectionMarkers[i].setMap(null);
		}
		
		if(startMarker!=null)
		{		
			startMarker.setMap(null);
		}

		startMarker = new google.maps.Marker({
			position: new google.maps.LatLng(collectionPoints[0].lat, collectionPoints[0].lng),
			map: map
		});
	
		endMarker = new google.maps.Marker({
			position: new google.maps.LatLng(collectionPoints[collectionPoints.length-1].lat, collectionPoints[collectionPoints.length-1].lng),
			map: map
		});
		
		calculateRoute();

		collectionMarkers = [];
		$.each(collectionPoints, function(i, val)
		{	
			if(i>0)
			{
				collectionPoints[i].timestamp = new Date(Date.parse(collectionPoints[i].timestamp));
				if(collectionPoints[i]["event"] == null)
				{	
					collectionMarkers.push(
						new google.maps.Marker({
						    position: new google.maps.LatLng(val.lat, val.lng),
							map: map
						}));
				}
				else
				{
					if(collectionPoints[i-1]["polyLatLngsIndex"] != collectionPoints[i]["polyLatLngsIndex"])
					{
						
						var eventMarker = new google.maps.Marker({
						    position: new google.maps.LatLng(val.lat, val.lng),
							map: map,
							icon: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
						});
						eventMarker.setMap(map);
						eventMarkers.push(eventMarker);
						addEventMarkerListener(eventMarker);
					}
				}
			}
		});
		scheduleButton.button("enable");
		elapsedDistance = response.elapsedDistance;
	}
	else{
		loadingTrip = false;
	}

	$("#startTime").datetimepicker("setDate", response.startTime);
	$("#collectionPeriodSeconds").val(response.collectionPeriod);
	
	$("#minVoltage").val(response.voltageMin);
	$("#maxVoltage").val(response.voltageMax);
	
	$("#minSpeed").val(response.speedMin);
	$("#maxSpeed").val(response.speedMax);
	
	if(response.rpmMin != null)
	{
		$("#minRPM").val(response.rpmMin);
		$("#maxRPM").val(response.rpmMax);
		enableField($("#enableRPM"));
	}
	else
	{
		$("#minRPM").val("0");
		$("#maxRPM").val("0");
		disableField($("#enableRPM"));
	}
	if(response.fuelLevelMin != null)
	{
		$("#minFuelLevel").val(response.fuelLevelMin);
		$("#maxFuelLevel").val(response.fuelLevelMax);
		enableField($("#enableFuelLevel"));
	}
	else
	{
		$("#minFuelLevel").val("0");
		$("#maxFuelLevel").val("0");
		disableField($("#enableFuelLevel"));
	}
	
	if(response.fuelRateMin != null)
	{
		$("#minFuelRate").val(response.fuelRateMin);
		$("#maxFuelRate").val(response.fuelRateMax);
		enableField($("#enableFuelRate"));
	}
	else
	{
		$("#minFuelRate").val("0");
		$("#maxFuelRate").val("0");
		disableField($("#enableFuelRate"));
	}
	if(response.engineTempMin != null)
	{
		$("#minEngineTemp").val(response.engineTempMin);
		$("#maxEngineTemp").val(response.engineTempMax);
		enableField($("#enableEngineTemp"));
	}
	else
	{
		$("#minEngineTemp").val("0");
		$("#maxEngineTemp").val("0");
		disableField($("#enableEngineTemp"));
	}
}

function getTripSettings()
{
	var tripSettings = {};
	tripSettings["elapsedDistance"] = elapsedDistance;
	tripSettings["collectionPoints"] = collectionPoints;
	tripSettings["name"] = $("#saveAsName").val();
	tripSettings["startTime"] = $("#startTime").val();
	tripSettings["collectionPeriod"] = $("#collectionPeriodSeconds").val();
	tripSettings["speedMin"] = $("#minSpeed").val();
	tripSettings["speedMax"] = $("#maxSpeed").val();
	tripSettings["voltageMin"] = $("#minVoltage").val();
	tripSettings["voltageMax"] = $("#maxVoltage").val();
	
	if(!$("#minRPM").prop("disabled"))
	{
		tripSettings["rpmMin"] = $("#minRPM").val();
		tripSettings["rpmMax"] = $("#maxRPM").val();
	}
	
	if(!$("#minFuelLevel").prop("disabled"))
	{
		tripSettings["fuelLevelMin"] = $("#minFuelLevel").val();
		tripSettings["fuelLevelMax"] = $("#maxFuelLevel").val();
	}
	
	if(!$("#minFuelRate").prop("disabled"))
	{
		tripSettings["fuelRateMin"] = $("#minFuelRate").val();
		tripSettings["fuelRateMax"] = $("#maxFuelRate").val();
	}
	
	if(!$("#minEngineTemp").prop("disabled"))
	{
		tripSettings["engineTempMin"] = $("#minEngineTemp").val();
		tripSettings["engineTempMax"] = $("#maxEngineTemp").val();
	}

	return tripSettings;
	
}

function distance(lat1, lon1, lat2, lon2) {
	var R = 6371; // Radius of the earth in km
	var dLat = (lat2 - lat1) * Math.PI / 180;  // deg2rad below
	var dLon = (lon2 - lon1) * Math.PI / 180;
	var a = 
		0.5 - Math.cos(dLat)/2 + 
		Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
		(1 - Math.cos(dLon))/2;
	
	return (R * 2 * Math.asin(Math.sqrt(a))) * 0.621371;
}

function showRoute() {
	$("#routeTable").html("");

	var elapsedSeconds = 0;
	elapsedDistance = 0;

	var milesPerSecond = (($("#maxSpeed").spinner("value") - $("#minSpeed").spinner("value"))/2) / 3600;

	var routeStr = "<table style=\"width:100%\">";
	routeStr += "<tr><th style=\"width:25%\">Start</th><th style=\"width:25%\">End</th><th style=\"width:25%\">Distance</th><th style=\"width:25%\">Elapsed Time</th></tr>";
	for (i=0; i<route.overview_path.length-1; i++) {
		var mileDistance = distance(route.overview_path[i].lat(), route.overview_path[i].lng(), route.overview_path[i+1].lat(), route.overview_path[i+1].lng());
		elapsedSeconds += mileDistance / milesPerSecond;
		elapsedDistance += mileDistance
		routeStr += "<tr><td width=\"25%\">" + route.overview_path[i].toString() + "</td>";
		routeStr +=     "<td width=\"25%\">" + route.overview_path[i+1].toString() + "</td>";
		routeStr +=     "<td width=\"25%\">" + elapsedDistance + " miles</td>";
		routeStr +=     "<td width=\"25%\">" + elapsedSeconds + " seconds</td></tr>";
	}
	routeStr += "</table>";
	
	$("#routeTable").html(routeStr);
	
	routeDialog.dialog("open");
}

function showCollection() {
	if (route === undefined) {
		return;
	}
	
	var elapsedSeconds = 0;
	elapsedDistance = 0;
	
	var milesPerHour = ($("#maxSpeed").spinner("value") - $("#minSpeed").spinner("value"))/2;
	var collectionPeriodSeconds = $("#collectionPeriodSeconds").val();
	
	var collectionIdx = 0;
	
	var timeStamp = $("#startTime").datetimepicker("getDate");

	for (var i = 0; i < collectionMarkers.length; i++) {
		collectionMarkers[i].setMap(null);
	}

	collectionMarkers = [];
	collectionPoints = [];

	var randomVoltage = (1-Math.random()) * ($("#maxVoltage").spinner("value") - $("#minVoltage").spinner("value")) + $("#minVoltage").spinner("value");
	var firstCollection = {		
		lat : polyLatLngs[0].lat(),
		lng : polyLatLngs[0].lng(),
		speed : 0,
		voltage: randomVoltage,
		timestamp : timeStamp,
		polyLatLngsIndex: 0
	};
	if($("#enableRPM").prop( "checked" ))
	{
		firstCollection["RPM"] = (1-Math.random()) * ($("#maxRPM").spinner("value") - $("#minRPM").spinner("value")) + $("#minRPM").spinner("value");	
	}
	if($("#enableFuelLevel").prop( "checked" ))
	{
		firstCollection["fuelLevel"] = (1-Math.random()) * ($("#maxFuelLevel").spinner("value") - $("#minFuelLevel").spinner("value")) + $("#minFuelLevel").spinner("value");	
	}
	if($("#enableFuelRate").prop( "checked" ))
	{
		firstCollection["fuelRate"] = (1-Math.random()) * ($("#maxFuelRate").spinner("value") - $("#minFuelRate").spinner("value")) + $("#minFuelRate").spinner("value");	
	}
	if($("#enableEngineTemp").prop( "checked" ))
	{
		firstCollection["engineTemp"] = (1-Math.random()) * ($("#maxEngineTemp").spinner("value") - $("#minEngineTemp").spinner("value")) + $("#minEngineTemp").spinner("value");	
	}
	collectionPoints.push(firstCollection);
	

	for (i=1; i<polyLatLngs.length-1; i++) {
		
		var randomSpeed = (1-Math.random()) * ($("#maxSpeed").spinner("value") - $("#minSpeed").spinner("value")) + $("#minSpeed").spinner("value");
		randomVoltage = (1-Math.random()) * ($("#maxVoltage").spinner("value") - $("#minVoltage").spinner("value")) + $("#minVoltage").spinner("value");

		
		var mileDistance = distance(polyLatLngs[i-1].lat(), polyLatLngs[i-1].lng(), polyLatLngs[i].lat(), polyLatLngs[i].lng());
		elapsedSeconds += mileDistance / (randomSpeed/3600) ;

		elapsedDistance += mileDistance;
		if (elapsedSeconds >= collectionPeriodSeconds) {
			timeStamp = new Date(+timeStamp + elapsedSeconds * 1000);

			var currentCollection = {
				lat : polyLatLngs[i].lat(),
				lng : polyLatLngs[i].lng(),
				speed : randomSpeed,
				voltage : randomVoltage,
				timestamp : timeStamp,
				elapsedSeconds : elapsedSeconds,
				polyLatLngsIndex: i
			};
			
			
			if($("#enableRPM").prop( "checked" ))
			{
				currentCollection["RPM"] = (1-Math.random()) * ($("#maxRPM").spinner("value") - $("#minRPM").spinner("value")) + $("#minRPM").spinner("value");	
			}
			if($("#enableFuelLevel").prop( "checked" ))
			{
				currentCollection["fuelLevel"] = (1-Math.random()) * ($("#maxFuelLevel").spinner("value") - $("#minFuelLevel").spinner("value")) + $("#minFuelLevel").spinner("value");	
			}
			if($("#enableFuelRate").prop( "checked" ))
			{
				currentCollection["fuelRate"] = (1-Math.random()) * ($("#maxFuelRate").spinner("value") - $("#minFuelRate").spinner("value")) + $("#minFuelRate").spinner("value");	
			}
			if($("#enableEngineTemp").prop( "checked" ))
			{
				currentCollection["engineTemp"] = (1-Math.random()) * ($("#maxEngineTemp").spinner("value") - $("#minEngineTemp").spinner("value")) + $("#minEngineTemp").spinner("value");	
			}
			collectionPoints.push(currentCollection);

			

			collectionMarkers.push(
				new google.maps.Marker({
				    position: new google.maps.LatLng(polyLatLngs[i].lat(), polyLatLngs[i].lng()),
				    map: map
				})
			);
			elapsedSeconds = 0;
		}
	}
	var maxIdx = polyLatLngs.length-1;
	var randomSpeed = (1-Math.random()) * ($("#maxSpeed").spinner("value") - $("#minSpeed").spinner("value")) + $("#minSpeed").spinner("value");
	var mileDistance = distance(polyLatLngs[maxIdx-1].lat(), polyLatLngs[maxIdx-1].lng(), collectionPoints[collectionPoints.length-1].lat, collectionPoints[collectionPoints.length-1].lng);

	elapsedSeconds = mileDistance / (randomSpeed/3600) ;

	elapsedDistance += mileDistance;

	timeStamp = new Date(+timeStamp + elapsedSeconds*1000);
	randomVoltage = (1-Math.random()) * ($("#maxVoltage").spinner("value") - $("#minVoltage").spinner("value")) + $("#minVoltage").spinner("value");
	
	var lastCollection = {
		lat : polyLatLngs[maxIdx].lat(),
		lng : polyLatLngs[maxIdx].lng(),
		speed : 0,
		voltage : randomVoltage,
		timestamp : timeStamp,
		elapsedSeconds: elapsedSeconds,
		polyLatLngsIndex: polyLatLngs.length
	};
	
	if($("#enableRPM").prop( "checked" ))
	{
		lastCollection["RPM"] = (1-Math.random()) * ($("#maxRPM").spinner("value") - $("#minRPM").spinner("value")) + $("#minRPM").spinner("value");	
	}
	if($("#enableFuelLevel").prop( "checked" ))
	{
		lastCollection["fuelLevel"] = (1-Math.random()) * ($("#maxFuelLevel").spinner("value") - $("#minFuelLevel").spinner("value")) + $("#minFuelLevel").spinner("value");	
	}
	if($("#enableFuelRate").prop( "checked" ))
	{
		lastCollection["fuelRate"] = (1-Math.random()) * ($("#maxFuelRate").spinner("value") - $("#minFuelRate").spinner("value")) + $("#minFuelRate").spinner("value");	
	}
	if($("#enableEngineTemp").prop( "checked" ))
	{
		lastCollection["engineTemp"] = (1-Math.random()) * ($("#maxEngineTemp").spinner("value") - $("#minEngineTemp").spinner("value")) + $("#minEngineTemp").spinner("value");	
	}
	
	collectionPoints.push(lastCollection)
	
	
}

function initialize() {
	navigator.geolocation.getCurrentPosition(initializeMap, positionError);
}

function positionError(err) {
    var msg;
    switch(err.code) {
      case err.UNKNOWN_ERROR:
        msg = "Unable to find your location";
        break;
      case err.PERMISSION_DENINED:
        msg = "Permission denied in finding your location";
        break;
      case err.POSITION_UNAVAILABLE:
        msg = "Your location is currently unknown";
        break;
      case err.BREAK:
        msg = "Attempt to find location took too long";
        break;
      default:
        msg = "Location detection not supported in browser";
    }
    console.log(err);
    alert(msg);
  }
  
function initializeMap(position) {
	

	
	directionsDisplay = new google.maps.DirectionsRenderer({ draggable: true });
	
	var mapOptions = {
		zoom: 12,
		center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		streetViewControl: false
	};
	
	map = new google.maps.Map(document.getElementById("routeMap"), mapOptions);
	
	directionsDisplay.setMap(map);

	polyline = new google.maps.Polyline({
		  path: [],
		  //strokeOpacity: 0,
		//  editable: true,
		  strokeWeight: 5,
		  zIndex: 5
		});
	//polyline.setMap(map);
	 google.maps.event.addListener(polyline, 'click', function(event) {
		 	selectedEvent = event;
			$("#addEvent-dialog").load(requestPath + "/tripCreator/addEventDialog", function(response, status, xhr) {									
				addEventDialog.dialog( "open" );	
			});
		 });
	 
	google.maps.event.addListener(map, 'click', function(event) {

		if(polyline.getMap() != null)
		{
			 removePolyline();
		}
			
		if($(".validationErrorMessage:visible").length == 0)
		{
			if (route == null) {
				if (startMarker == null) {
					startMarker = new google.maps.Marker({
					    position: event.latLng,
					    map: map
					});
				} else if (endMarker == null) {
					endMarker = new google.maps.Marker({
					    position: event.latLng,
					    map: map
					});
	
					calculateRoute();
	
					startMarker.setMap(null);
					endMarker.setMap(null);
					
					startMarker = null;
					endMarker = null;
					
					viewRouteButton.button("enable");
					scheduleButton.button("enable");
				}
			}
		}
	})
	
	google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
		processRoute(directionsDisplay.directions);
	});
}

function removePolyline()
{
	directionsDisplay.setOptions({draggable:true});
	if(polyline != null)
	{
		polyline.setMap(null);
	}
}


function enableField(checkBox)
{
	var fieldSet = $(checkBox).closest("fieldset"); 
	$(checkBox).next().addClass("checkedBox");
	$(checkBox).next().html("<span class='check'>&#x2713</span>");
	$(fieldSet).find(".spinnerInput").spinner("enable");
	$(fieldSet).removeClass("disabledText");
}

function disableField(checkBox)
{
	var fieldSet = $(checkBox).closest("fieldset"); 
	$(checkBox).next().removeClass("checkedBox");
	$(checkBox).next().html("");
	$(fieldSet).find(".spinnerInput").val("0").spinner("disable");
	$(fieldSet).find(".validationErrorMessage").hide();
	$(fieldSet).addClass("disabledText");
}

function calculateRoute() {
	var waypts = [];
	
	var request = {
		origin: startMarker.getPosition(),
		destination: endMarker.getPosition(),
		waypoints: waypts,
		optimizeWaypoints: true,
		travelMode: google.maps.DirectionsTravelMode.DRIVING
	};
	
	directionsService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			directionsDisplay.setDirections(response);
		}
	});
}

function calculatePolyline(){
	
	var bounds = new google.maps.LatLngBounds();

	polyLatLngs = [];
	var legs = route.legs;
	for (i=0;i<legs.length;i++) {
	  var steps = legs[i].steps;
	  for (j=0;j<steps.length;j++) {
	    var nextSegment = steps[j].path;
	    for (k=0;k<nextSegment.length;k++) {
	      polyLatLngs.push(nextSegment[k]);
	      bounds.extend(nextSegment[k]);
	    }
	  }
	}
}
function getPolyLatLngsIndex(lat, lng)
{
	var minDistance;
	var returnVal
	for(var i = 0; i < polyLatLngs.length; i++)
	{
		var calcDistance = distance(polyLatLngs[i].lat(), polyLatLngs[i].lng(), lat, lng);
		if(calcDistance < minDistance || minDistance == null)
		{
			minDistance = calcDistance
			returnVal =  i;
		}
	}
	return returnVal;
}

function getCollectionPointsIndex(polyLatLngsIndex)
{
	for(var i = 1; i < collectionPoints.length; i++)
	{
		if((polyLatLngsIndex  > collectionPoints[i-1].polyLatLngsIndex || i==1) && polyLatLngsIndex  <= collectionPoints[i].polyLatLngsIndex )
		{
			if(polyLatLngsIndex== collectionPoints[i].polyLatLngsIndex)
			{
				//marker already exists at closest latlng
				return;
			}
			return i;
			//break;
		}
	}
}
function addEvent(eventToAdd)
{

	
	var polyLatLngsIndex = getPolyLatLngsIndex(eventToAdd.latLng.lat(), eventToAdd.latLng.lng());
	var collectionPointsIndex = getCollectionPointsIndex(polyLatLngsIndex);

	var d = distance(collectionPoints[collectionPointsIndex-1].lat, collectionPoints[collectionPointsIndex-1].lng, selectedEvent.latLng.lat(), selectedEvent.latLng.lng());
	//var avgSpeed = (collectionPoints[collectionPointsIndex-1].speed + collectionPoints[collectionPointsIndex].speed)/2
	var avgSpeed = ($("#maxSpeed").spinner("value") + $("#minSpeed").spinner("value"))/2;
	var seconds = (d / avgSpeed)*3600;
	var timestamp = new Date(collectionPoints[collectionPointsIndex-1]["timestamp"].getTime() + seconds*1000);

	
	removePolyline();
	
	collectionPoints[collectionPointsIndex]["elapsedSeconds"] = (collectionPoints[collectionPointsIndex]["timestamp"] - timestamp)/1000;
	$("#addEventDiv :checked").each(function(i){
		eventId = this.id;
		if(eventId === "GEN_DTC")
		{
			var troubleCodes = $("#troubleCodes").val().split(",")
			$.each(troubleCodes, function(i, val){
				troubleCodes[i] = troubleCodes[i].trim()
				
				var collectionPoint = {
				lat : polyLatLngs[polyLatLngsIndex].lat(),
				lng : polyLatLngs[polyLatLngsIndex].lng(),
				polyLatLngsIndex: polyLatLngsIndex,
				speed : avgSpeed,
				timestamp: timestamp,
				elapsedSeconds : seconds,
				event : eventId,
				troubleCode : troubleCodes[i]
				};
				
				collectionPoints.splice(collectionPointsIndex, 0, collectionPoint);
			});
		}
		else
		{			
			var collectionPoint = {
					lat : polyLatLngs[polyLatLngsIndex].lat(),
					lng : polyLatLngs[polyLatLngsIndex].lng(),
					polyLatLngsIndex: polyLatLngsIndex,
					speed : avgSpeed,
					timestamp: timestamp,
					elapsedSeconds : seconds,
					event : eventId
			};
			collectionPoints.splice(collectionPointsIndex, 0, collectionPoint);
		}
		
	});
	

	var eventMarker = new google.maps.Marker({
		position: polyLatLngs[polyLatLngsIndex],
		map: map,
		icon: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
	});
	eventMarker.setMap(map);
	eventMarkers.push(eventMarker);
	
	addEventMarkerListener(eventMarker);
	

}

function addEventMarkerListener(eventMarker)
{
	var myDiv = document.createElement("div");
	$(myDiv).load(requestPath + "/tripCreator/editEventInfoWindow #editEventDiv");
	
	
	var infowindow = new google.maps.InfoWindow({
    	content: myDiv
 	});
	
	google.maps.event.addListener(infowindow,'closeclick',function(){
		infoWindowClose();
		});
	
	eventMarker.infowindow = infowindow;
	
	google.maps.event.addListener(eventMarker, 'click', function(event) {
		infowindow.open(map,eventMarker);
		$("#editEventDiv :checkbox").each(function(i, element){
			$(element).click(function(){eventDivCheck(element)});
			});
		$("#editEventTroubleCodes").addClass("text ui-widget-content ui-corner-all ui-state-disabled");
		$("#editEventTroubleCodes").prop('disabled', true);
		$("#editEventTroubleCodes").val("");
		$("#editEventTroubleCodes").on("input", function(){ 
			$("#saveEventButton").button("enable"); 
		});
		$("#saveEventButton").button({disabled:true}).click(function() {saveEvent(eventMarker);});
		$("#deleteEventButton").button().click(function() {deleteEvent(eventMarker);});
		getEventDetails(eventMarker);
	});
}
function deleteEvent(eventMarker)
{
	for(var i = eventMarkers.length - 1; i >= 0; i--)
	{
		if(eventMarkers[i] == eventMarker)
		{
			eventMarkers.splice(i, 1);
		}
	}

	var polyLatLngsIndex = getPolyLatLngsIndex(eventMarker.getPosition().lat(), eventMarker.getPosition().lng());
	var toDelete = [];

	for(var i = 0; collectionPoints[i].polyLatLngsIndex <= polyLatLngsIndex; i++ )
	{
		if(collectionPoints[i].polyLatLngsIndex == polyLatLngsIndex)
		{
			toDelete.push(i);
		}
	}
	collectionPoints.splice(toDelete[0], toDelete.length);
	collectionPoints[toDelete[0]]["elapsedSeconds"] = (collectionPoints[toDelete[0]]["timestamp"] - collectionPoints[toDelete[0]-1]["timestamp"]) / 1000;
	eventMarker.setMap(null);
	eventMarker.infowindow.close();
}

function getEventDetails(eventMarker)
{
	var troubleCodeIndeces = [];
	var polyLatLngsIndex = getPolyLatLngsIndex(eventMarker.getPosition().lat(), eventMarker.getPosition().lng());

	//foundEvents
	for(var i = 0; collectionPoints[i].polyLatLngsIndex <= polyLatLngsIndex; i++ )
	{

		if(collectionPoints[i].polyLatLngsIndex == polyLatLngsIndex)
		{
			if(collectionPoints[i].event === "GEN_DTC")
			{
				troubleCodeIndeces.push(i);
			}
			else if(collectionPoints[i].event === "VEHICLE_EVENT_HARSH_ACCEL")
			{
				$("#editEventHarshAccel").prop('checked', true);
				$("#editEventHarshAccel").next().addClass("checkedBox");
				$("#editEventHarshAccel").next().html("<span class='check' style='display: table'>&#x2713</span>");	
			}
			else if(collectionPoints[i].event === "VEHICLE_EVENT_HARSH_DECEL")
			{
				$("#editEventHarshDecel").prop('checked', true);
				$("#editEventHarshDecel").next().addClass("checkedBox");
				$("#editEventHarshDecel").next().html("<span class='check' style='display: table'>&#x2713</span>");	
			}	
			else if(collectionPoints[i].event === "VEHICLE_EVENT_HARSH_RIGHT")
			{
				$("#editEventHarshRight").prop('checked', true);
				$("#editEventHarshRight").next().addClass("checkedBox");
				$("#editEventHarshRight").next().html("<span class='check' style='display: table'>&#x2713</span>");	
			}
			else if(collectionPoints[i].event === "VEHICLE_EVENT_HARSH_LEFT")
			{
				$("#editEventHarshLeft").prop('checked', true);
				$("#editEventHarshLeft").next().addClass("checkedBox");
				$("#editEventHarshLeft").next().html("<span class='check' style='display: table'>&#x2713</span>");	
			}
			else if(collectionPoints[i].event === "VEHICLE_EVENT_HARSH_IMPACT")
			{
				$("#editEventHarshImpact").prop('checked', true);
				$("#editEventHarshImpact").next().addClass("checkedBox");
				$("#editEventHarshImpact").next().html("<span class='check' style='display: table'>&#x2713</span>");	
			}
		}
	}

	if(troubleCodeIndeces.length > 0)
	{
		var troubleCodes = "";
		for(var i = troubleCodeIndeces.length-1; i >= 0; i--)
		{
			troubleCodes = troubleCodes + collectionPoints[troubleCodeIndeces[i]].troubleCode + ","
		}
		troubleCodes = troubleCodes.slice(0,-1);
		$("#editEventTroubleCodes").val(troubleCodes);
		$("#editEventDTC").prop('checked', true);
		$("#editEventDTC").next().addClass("checkedBox");
		$("#editEventDTC").next().html("<span class='check' style='display: table'>&#x2713</span>");			
		$("#editEventTroubleCodes").prop('disabled', false);
		$("#editEventTroubleCodes").removeClass("ui-state-disabled");
	}
	
}

function processRoute(result) {
	route = result.routes[0];
	calculatePolyline();
	addEventButton.button("enable");
		
	if(!loadingTrip)
	{	
		for (var i = 0; i < eventMarkers.length; i++)
		{
			eventMarkers[i].setMap(null);
		}
		eventMarkers = [];
		for (var i = 0; i < collectionMarkers.length; i++) {
			collectionMarkers[i].setMap(null);
		}
		if(startMarker!=null)
		{		
			startMarker.setMap(null);
		}
		if(endMarker != null)
		{		
			endMarker.setMap(null);
		}
		collectionMarkers = [];
		showCollection();
	}

	loadingTrip = false;
}

function scheduleTrip() {
	$("#loadingTrip-progressBar").progressbar({
		value:0
	});
	loadingTripDialog.dialog("open");
	processCollectionPoints(0);

}

function processCollectionPoints(i)
{
		var dataToSend = [];
		var ignitionStatus;
		if(i==0)
		{
			ignitionStatus = "ON"
		}
		else if(i == collectionPoints.length-1)
		{
			ignitionStatus = "OFF"
		}
		else
		{
			ignitionStatus = "RUNNING"
		}
		$.ajax({
			type: 'post',
			url: requestPath + "/tripCreator/postDataSet",
			data: { collectionPoint: JSON.stringify(collectionPoints[i]), mileage: elapsedDistance, ignitionStatus: ignitionStatus},
			dataType: "text",
			success: function (response, status, xml) {
				if (response == "OK") {
					if(i==collectionPoints.length-1)
					{
						loadingTripDialog.dialog("close");
						$("#tripScheduledSuccess-dialog").html("Your trip has been successfully posted to the Carvoyant Servers.")
						tripScheduledSuccessDialog.dialog("open");
						$("#progressLabel").html("0%")
					}
					else
					{	
						var percent  = Math.floor(((i+1)/collectionPoints.length) * 100);
						$("#loadingTrip-progressBar").progressbar("value", percent);
						$("#progressLabel").html(percent.toString() + "%")
						processCollectionPoints(i+1);
					}
				} else {
					alert("NOT OK!");
				}
			},
			error: function(error) {
				console.log(error);
				alert(error);
			}
		});
}

function openMoreVehicles() {

	$("#confirmSelectedVehicle").prop('disabled', true).addClass( 'ui-state-disabled' );

	if(openedMoreVehicles == false)
	{
		$("#moreVehicles-dialog").load(requestPath + "/tripCreator/moreVehiclesDialog", function(response, status, xhr) {
			moreVehiclesDialog.dialog("open");
			openedMoreVehicles = true;
		});
	}
	else
	{
		moreVehiclesDialog.dialog("open");
	}
}


	function setSelectedVehicle(sel)
	{

		if(sel == -1)
		{
			openMoreVehicles();
		}
		else
		{
			$.ajax({
			type: 'get',
			dataType: 'json',
			url: requestPath + "/tripCreator/setSelectedVehicle",
			data: {vehicleId: sel},
			success: function (response, status, xml) {
				selectedVehicleId = sel;
			}
			});
		}
	}
	
	function eventDivCheck(checkBox)
	{
		$("#saveEventButton").button("enable");
		if(checkBox.id === "editEventDTC")
		{
			if(checkBox.checked)
			{
				$("#editEventTroubleCodes").prop('disabled', false);
				$("#editEventTroubleCodes").removeClass("ui-state-disabled");
			}
			else
			{
				$("#editEventTroubleCodes").prop('disabled', true);
				$("#editEventTroubleCodes").addClass("ui-state-disabled");
			}
		}
		
		if(checkBox.checked)
		{
			$(checkBox).next().addClass("checkedBox");
			$(checkBox).next().html("<span class='check' style='display: table'>&#x2713</span>");
		}
		else
		{
			$(checkBox).next().removeClass("checkedBox");
			$(checkBox).next().html("");	
		}
	}
	function saveEvent(eventMarker)
	{
		var troubleCodes = [];
		var polyLatLngsIndex = getPolyLatLngsIndex(eventMarker.getPosition().lat(), eventMarker.getPosition().lng());
		var toDelete = [];
		var toAdd = [];
		var collectionPointsIndex;
		for(var i = 1; i < collectionPoints.length; i++)
		{
			if((polyLatLngsIndex  > collectionPoints[i-1].polyLatLngsIndex || i==1) && polyLatLngsIndex  <= collectionPoints[i].polyLatLngsIndex )
			{
				collectionPointsIndex = i;
			}
		}
		
		var d = distance(collectionPoints[collectionPointsIndex-1].lat, collectionPoints[collectionPointsIndex-1].lng, eventMarker.getPosition().lat(), eventMarker.getPosition().lng());	
		var avgSpeed = ($("#maxSpeed").spinner("value") + $("#minSpeed").spinner("value"))/2;
		var seconds = (d / avgSpeed)*3600;
		var timestamp = new Date(collectionPoints[collectionPointsIndex-1]["timestamp"].getTime() + seconds*1000);
		
		$("#editEventDiv :checkbox").each(function(i, checkBox){
			var eventName;
			switch(checkBox.id)
			{
				case "editEventDTC":
					eventName = "GEN_DTC";
					break;
				case "editEventHarshAccel":
					eventName = "VEHICLE_EVENT_HARSH_ACCEL";
					break;
				case "editEventHarshDecel":
					eventName = "VEHICLE_EVENT_HARSH_DECEL";
					break;
				case "editEventHarshRight":
					eventName = "VEHICLE_EVENT_HARSH_RIGHT";
					break;
				case "editEventHarshLeft":
					eventName = "VEHICLE_EVENT_HARSH_LEFT";
					break;
				case "editEventHarshImpact":
					eventName = "VEHICLE_EVENT_HARSH_IMPACT";
					break;
				default:
					break;
				
			}

			if(checkBox.checked)
			{
				if(eventName == "GEN_DTC")
				{
					$.each(collectionPoints, function(i, val){
						if(val.polyLatLngsIndex == polyLatLngsIndex && val.event === eventName)
						{
							toDelete.push(i);
						}
					});
					
					//add from string
					troubleCodes = $("#editEventTroubleCodes").val().split(",")
				}
				else
				{					
					var foundEvent = false;
					$.each(collectionPoints, function(i, val){
						if(val.polyLatLngsIndex == polyLatLngsIndex && val.event == eventName)
						{
							foundEvent = true;
						}
					});
					if(!foundEvent)
					{
						toAdd.push(eventName);
					}
				}
			}
			else
			{
				$.each(collectionPoints, function(i, val){
					if(val.polyLatLngsIndex == polyLatLngsIndex && val.event === eventName)
					{
						toDelete.push(i);
					}
				});
			}
		});
		
		toDelete = toDelete.sort();

		for(var i = toDelete.length - 1; i >= 0; i--)
		{
			collectionPoints.splice(toDelete[i], 1);
		}
		
		if(toAdd.length > 0)
		{
			
			$.each(toAdd, function(i, val){
				
				var collectionPoint = {
						lat : eventMarker.getPosition().lat(),
						lng : eventMarker.getPosition().lng(),
						polyLatLngsIndex: polyLatLngsIndex,
						speed : avgSpeed,
						timestamp: timestamp,
						elapsedSeconds : seconds,
						event : val
				};
				collectionPoints.splice(collectionPointsIndex, 0, collectionPoint);
			});			
		}
		
		$.each(troubleCodes, function(i, val){
			troubleCodes[i] = troubleCodes[i].trim()
			
			var collectionPoint = {
			lat : eventMarker.getPosition().lat(),
			lng : eventMarker.getPosition().lng(),
			polyLatLngsIndex: polyLatLngsIndex,
			speed : avgSpeed,
			timestamp: timestamp,
			elapsedSeconds : seconds,
			event : "GEN_DTC",
			troubleCode : troubleCodes[i]
			};
			
			collectionPoints.splice(collectionPointsIndex, 0, collectionPoint);
		});
		
		var foundEvent = false;
		$.each(collectionPoints, function(i, val){
			if(val.polyLatLngsIndex == polyLatLngsIndex)
			{
				foundEvent = true;
			}
		});
		
		if(!foundEvent)
		{
			collectionPoints[collectionPointsIndex]["elapsedSeconds"] = (collectionPoints[collectionPointsIndex]["timestamp"] - collectionPoints[collectionPointsIndex-1]["timestamp"])/1000;
			eventMarker.setMap(null);
			for(var i = eventMarkers.length - 1; i >= 0; i--)
			{
				if(eventMarkers[i] == eventMarker)
				{
					eventMarkers.splice(i, 1);
				}
			}
		}
		
		eventMarker.infowindow.close();
	}
	function infoWindowClose()
	{		
		$("#editEventDiv :checkbox").each(function(i, checkBox){
			$(checkBox).next().removeClass("checkedBox");
			$(checkBox).next().html("");
		});
	}
