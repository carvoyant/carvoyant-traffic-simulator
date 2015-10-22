<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="layout" content="main"/>

<title>Traffic Simulator</title>
<script>
	var vehicleNamesSize =  ${vehicleNames.size()};
	var selectedVehicleId = ${selectedVehicleId};
	var requestPath = "${request.contextPath}"
</script>
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx&sensor=false&v3.12"></script>
<asset:stylesheet src="tripCreator.css"/>
<asset:javascript src="tripCreator.js"/>

</head>
<body>
	<div class="grid-100 grid-parent tablet-grid-100 mobile-grid-100" style="margin-bottom: 1em">
		<div style="float:right; margin-top:1em;">
			<div style="font-style:italic; font-size: 0.8em;float:right;">Welcome ${applicationContext.springSecurityService.principal.firstName} (<g:link controller="logout">Logout</g:link>)</div>
			<div style=" font-style:italic; padding:1em 1em 0 0; text-align:right; margin-top: 0.7em;">
				<span style="text-align:right; font-size:1em;">Selected Vehicle:</span>
				</br>
				<g:select name="selectVehicle" keys="${vehicleNames.id}" from="${vehicleNames.name}" id="selectVehicle" style="font-size: 1em; padding: 0 0 0 1em;" onchange="setSelectedVehicle(this.value)"></g:select>
			</div>
		</div>
		<div id="carvoyantLogo" class="grid-5 tablet-grid-5 mobile-grid-5" style="margin-top: 1.2em">
				<a href="https://www.carvoyant.com" target="_blank"><asset:image src="logo.png"/></a>
		</div>
	</div>
	<div id="routeDialog" title="Route">
		<div id="routeTable" style="font-size:0.8em"></div>
	</div>
	
	<div class="grid-100 ui-widget-header grid-parent ui-corner-top" style="padding-top:10px; padding-bottom:10px;">
		<div class="grid-20">
		<span id="currentTripName">Untitled Trip</span>
		<span id="markAsUnsaved" hidden> *(Unsaved)</span>
		</div>
		<div class="grid-80" style="text-align:right; font-size:0.7em; display:none"><button id="viewRoute">View Route</button></div>
	</div>
	<div class="grid-100 ui-widget-content grid-parent ui-corner-bottom" style="height:80%">
		<div class="grid-30" style="font-size:0.9em; padding-top: 10px; height: 100%; position: relative;" id="tripControls">
			<div class="grid-50">Trip Start Time:<br/><input style="width: 100%;" id="startTime"/></div>
			<div class="grid-50">Collection Period:<br/>
				<select id="collectionPeriodSeconds" style="width: 100%;">
					<option value="60" selected>1 minute</option>
					<option value="300">5 minutes</option>
				</select>
			</div>
			<fieldset>
				<legend>Speed (miles/hr)</legend>
				<div>
					<span>
						<span class="spinnerLabel">Min:</span> 
						<input class="spinnerInput" id="minSpeed" value="0"/>
					</span>
					<span style="float:right">
						<span class="spinnerLabel">Max:</span> 
						<input class="spinnerInput" id="maxSpeed" value="0"/>
					</span>
				</div>
				<span id="minOverMaxSpeed" class="validationErrorMessage minOverMax"></span>
				<span id="minSpeedError" class="validationErrorMessage"></span>
				<span id="maxSpeedError" class="validationErrorMessage" style="text-align: right;"></span>
			</fieldset>
			<fieldset>
				<legend>Battery Voltage (V)</legend>
				<div>
					<span>
						<span class="spinnerLabel">Min:</span> 
						<input class="spinnerInput" id="minVoltage" value="0"/>
					</span>
					<span style="float:right">
						<span class="spinnerLabel">Max:</span> 
						<input class="spinnerInput" id="maxVoltage" value="0"/>
					</span>
				</div>
				<span id="minOverMaxVoltage" class="validationErrorMessage minOverMax"></span>
				<span id="minVoltageError" class="validationErrorMessage"></span>
				<span id="maxVoltageError" class="validationErrorMessage" style="text-align: right;"></span>
			</fieldset>
			<fieldset class="disabledText" id="RPM">
				<legend>

					<label for="enableRPM"> 
					<input type="checkbox" id="enableRPM">
					<span class="checkbox"></span><span class="checkboxLabel">RPM</span>
					</label>
				</legend>
				<div>
					<span>
						<span class="spinnerLabel">Min:</span> 
						<input class="spinnerInput" id="minRPM" value="0"/>
					</span>
					<span style="float:right">
						<span class="spinnerLabel">Max:</span> 
						<input class="spinnerInput" id="maxRPM" value="0"/>
					</span>
				</div>
				<span id="minOverMaxRPM" class="validationErrorMessage minOverMax"></span>
				<span id="minRPMError" class="validationErrorMessage"></span>
				<span id="maxRPMError" class="validationErrorMessage" style="text-align: right;"></span>
			</fieldset>
			<fieldset class="disabledText" id ="fuelLevel">
				<legend>

					<label for="enableFuelLevel"> 
					<input type="checkbox" id="enableFuelLevel">
					<span class="checkbox"></span><span class="checkboxLabel">Fuel Level (%)</span>
					</label>
				</legend>
				<div>
					<span>
						<span class="spinnerLabel">Min:</span> 
						<input class="spinnerInput" id="minFuelLevel" value="0"/>
					</span>
					<span style="float:right">
						<span class="spinnerLabel">Max:</span> 
						<input class="spinnerInput" id="maxFuelLevel" value="0"/>
					</span>
				</div>
				<span id="minOverMaxFuelLevel" class="validationErrorMessage minOverMax"></span>
				<span id="minFuelLevelError" class="validationErrorMessage"></span>
				<span id="maxFuelLevelError" class="validationErrorMessage" style="text-align: right;"></span>
			</fieldset>
			<fieldset class="disabledText" id ="fuelRate">
				<legend>

					<label for="enableFuelRate"> 
					<input type="checkbox" id="enableFuelRate">
					<span class="checkbox"></span><span class="checkboxLabel">Fuel Rate (Gal/hr)</span>
					</label>
				</legend>
				<div>
					<span>
						<span class="spinnerLabel">Min:</span> 
						<input class="spinnerInput" id="minFuelRate" value="0"/>
					</span>
					<span style="float:right">
						<span class="spinnerLabel">Max:</span> 
						<input class="spinnerInput" id="maxFuelRate" value="0"/>
					</span>
				</div>
				<span id="minOverMaxFuelRate" class="validationErrorMessage minOverMax"></span>
				<span id="minFuelRateError" class="validationErrorMessage"></span>
				<span id="maxFuelRateError" class="validationErrorMessage" style="text-align: right;"></span>
			</fieldset>
			
			<fieldset class="disabledText" id ="engineTemp">
				<legend>

					<label for="enableEngineTemp"> 
					<input type="checkbox" id="enableEngineTemp">
					<span class="checkbox"></span><span class="checkboxLabel">Engine Temp (&degC)</span>
					</label>
				</legend>
				<div>
					<span>
						<span class="spinnerLabel">Min:</span> 
						<input class="spinnerInput" id="minEngineTemp" value="0"/>
					</span>
					<span style="float:right">
						<span class="spinnerLabel">Max:</span> 
						<input class="spinnerInput" id="maxEngineTemp" value="0"/>
					</span>
				</div>
				<span id="minOverMaxEngineTemp" class="validationErrorMessage minOverMax"></span>
				<span id="minEngineTempError" class="validationErrorMessage"></span>
				<span id="maxEngineTempError" class="validationErrorMessage" style="text-align: right;"></span>
			</fieldset>
			<div style="width:100%">
				<button id="addEventButton" style="margin: 1em auto; display: block">Add Event</button>
			</div>
				
			<div id="tripControlButtons" style="padding-top:20px; text-align:center; bottom: 20px; width: 94%; position: absolute;">
				<button id="save">Save</button>
				<button id="load">Load</button>
				<button id="delete">Delete</button>
				<button id="schedule" style="margin-left:40px;">Simulate</button>
			</div>
			
		</div>
		<div id="routeMap" class="grid-70" style="height:100%"></div>
		</div>
		<div id="moreVehicles-dialog" title="Select Vehicle"></div>
		<div id="saveTrip-dialog" title="Save Trip As"></div>
		<div id="loadTrip-dialog" title="Load Trip"></div>
		<div id="deleteTrip-dialog" title="Delete Trip"></div>
		<div id="confirmDeleteTrip-dialog" title="Delete Trip Confirmation"></div>
		<div id="overwriteTrip-dialog" title="Overwrite Trip"></div>
		<div id="addEvent-dialog" title="Add Event"></div>
		<div id="loadingTrip-dialog">
			<div id="loadingTrip-progressBar"><div id="progressLabel" class="progressLabel"></div></div>
		</div>
		<div id="tripScheduledSuccess-dialog" title="Trip Scheduled Successfully" style="text-align: center; margin: 1.5em"></div>
		
</body>
</html>
