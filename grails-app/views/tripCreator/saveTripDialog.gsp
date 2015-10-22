<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
	<head>
	<script>
	$(document).ready(function (){
		$("#saveAsButton").button("disable");
		$("#saveAsName").addClass("text ui-widget-content ui-corner-all");

		var currentTripName = $("#currentTripName").html();

		if(currentTripName != "New Trip")
		{
			$("#saveAsName").val(currentTripName);
			$("#saveAsButton").button("enable");
		}
		
		$("#saveAsName").on('input', function()
		{
			if(this.value)
			{
				$("#saveAsButton").button("enable");
			}
			else
			{
				$("#saveAsButton").button("disable");
			}
		});
		$("#saveAsName").keypress(function(e)
		{
			if(e.which == 13 && !$("#saveAsButton").prop("disabled"))
			{
				$('#saveAsButton').focus().click();
			}
		});
		
	});
	</script>
	</head>
	<body>
		<div class="grid-100" style="padding:10px 0;">
			<span>Trip Name: </span>
			<input id="saveAsName" type="text"/>			
		</div>
	</body>
</html>
