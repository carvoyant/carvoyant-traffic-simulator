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
	<div id="editEventDiv">
		<div style="padding:10px" >
			<span style="width: 50%; display: inline-block">
				<label for="editEventDTC"> 
				<input type="checkbox" id="editEventDTC">
				<span class="checkbox"></span><span class="checkboxLabel">Diagnostic Troube Code(s):</span>
				</label>
			</span>
			<input type="text" id="editEventTroubleCodes"></input>
		</div>
		<div class="grid-container">
			<div class="grid-50" style="padding:10px 0;">
				<label for="editEventHarshAccel"> 
				<input type="checkbox" id="editEventHarshAccel">
				<span class="checkbox"></span><span class="checkboxLabel">Harsh Acceleration</span>
				</label>
			</div>
			<div class="grid-50" style="padding:10px 0;">
				<label for="editEventHarshDecel"> 
				<input type="checkbox" id="editEventHarshDecel">
				<span class="checkbox"></span><span class="checkboxLabel">Harsh Deceleration</span>
				</label>
			</div>
			<div class="grid-50" style="padding:10px 0;">
				<label for="editEventHarshRight"> 
				<input type="checkbox" id="editEventHarshRight">
				<span class="checkbox"></span><span class="checkboxLabel">Harsh Right Turn</span>
				</label>
			</div>
			<div class="grid-50" style="padding:10px 0;">
				<label for="editEventHarshLeft"> 
				<input type="checkbox" id="editEventHarshLeft">
				<span class="checkbox"></span><span class="checkboxLabel">Harsh Left Turn</span>
				</label>
			</div>
			<div class="grid-100" style="padding:10px 0;">
				<label for="editEventHarshImpact"> 
				<input type="checkbox" id="editEventHarshImpact">
				<span class="checkbox"></span><span class="checkboxLabel">Impact</span>
				</label>
			</div>
			<div class="grid-50" style="padding:10px 0;">
				<button id="saveEventButton" style="margin: 1em auto; display: block">Save</button>
			</div>
			<div class="grid-50" style="padding:10px 0;">
				<button id="deleteEventButton" style="margin: 1em auto; display: block">Delete</button>
			</div>
		</div>
	</div>
	</body>
</html>
