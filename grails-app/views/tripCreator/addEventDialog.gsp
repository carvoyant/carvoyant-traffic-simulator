<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
	<head>
		<meta name="layout" content="formDialog" />
		<content tag="formName">userForm</content>
		<content tag="submitController">tripCreatorController</content>
		<content tag="submitAction">addEvent</content>
		<asset:stylesheet src="tripCreator.css"/>	
		<script>
		$("#troubleCodes").addClass("ui-state-disabled");
		$("#troubleCodes").prop('disabled', true);
		$("#confirmAddEventButton").button("disable");
		
		$("input[type=checkbox]").click(function() {

			if(this.id === "GEN_DTC")
			{
				if(this.checked)
				{
					$("#troubleCodes").prop('disabled', false);
					$("#troubleCodes").removeClass("ui-state-disabled");
				}
				else
				{
					$("#troubleCodes").prop('disabled', true);
					$("#troubleCodes").addClass("ui-state-disabled");
				}
			}
			
			if(this.checked)
			{
				$(this).next().addClass("checkedBox");
				$(this).next().html("<span class='check' style='display: table'>&#x2713</span>");
				$("#confirmAddEventButton").button("enable");
			}
			else
			{
				$(this).next().removeClass("checkedBox");
				$(this).next().html("");	

				if($("#addEventDiv :checked").length == 0)
				{
					$("#confirmAddEventButton").button("disable");
				}
			}


		});
		</script>
	</head>
	<body>
	<div id="addEventDiv">
		<div style="padding:10px" >
			<span style="width: 50%; display: inline-block">
				<label for="GEN_DTC"> 
				<input type="checkbox" id="GEN_DTC">
				<span class="checkbox"></span><span class="checkboxLabel">Diagnostic Troube Code(s):</span>
				</label>
			</span>
			<input type="text" id="troubleCodes"></input>
		</div>
		<div class="grid-container">
			<div class="grid-50" style="padding:10px 0;">
				<label for="VEHICLE_EVENT_HARSH_ACCEL"> 
				<input type="checkbox" id="VEHICLE_EVENT_HARSH_ACCEL">
				<span class="checkbox"></span><span class="checkboxLabel">Harsh Acceleration</span>
				</label>
			</div>
			<div class="grid-50" style="padding:10px 0;">
				<label for="VEHICLE_EVENT_HARSH_DECEL"> 
				<input type="checkbox" id="VEHICLE_EVENT_HARSH_DECEL">
				<span class="checkbox"></span><span class="checkboxLabel">Harsh Deceleration</span>
				</label>
			</div>
			<div class="grid-50" style="padding:10px 0;">
				<label for="VEHICLE_EVENT_HARSH_RIGHT"> 
				<input type="checkbox" id="VEHICLE_EVENT_HARSH_RIGHT">
				<span class="checkbox"></span><span class="checkboxLabel">Harsh Right Turn</span>
				</label>
			</div>
			<div class="grid-50" style="padding:10px 0;">
				<label for="VEHICLE_EVENT_HARSH_LEFT"> 
				<input type="checkbox" id="VEHICLE_EVENT_HARSH_LEFT">
				<span class="checkbox"></span><span class="checkboxLabel">Harsh Left Turn</span>
				</label>
			</div>
			<div class="grid-100" style="padding:10px 0;">
				<label for="VEHICLE_EVENT_HARSH_IMPACT"> 
				<input type="checkbox" id="VEHICLE_EVENT_HARSH_IMPACT">
				<span class="checkbox"></span><span class="checkboxLabel">Impact</span>
				</label>
			</div>
		</div>
	</div>
	</body>
</html>
