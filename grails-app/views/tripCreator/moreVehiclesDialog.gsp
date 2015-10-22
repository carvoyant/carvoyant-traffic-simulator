<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
	<head>
		<meta name="layout" content="formDialog" />
		<content tag="formName">userForm</content>
		<content tag="submitController">tripCreatorController</content>
		<content tag="submitAction">setSelectedVehicle</content>
		<asset:stylesheet src="jquery.dataTables_themeroller.css"/>

		<script>

		$(document).ready(function() {
			if(vehicleTable == null){
				vehicleTable = $('#vehiclesTable').DataTable({
						"autoOpen": false,
						"pagingType": "simple",
						"serverSide": true,
						"processing": true,
						"pageLength": 20,
						"order": [[ 1, "asc" ]],
						"columnDefs": [ 
							{ "visible": false, "targets": [0] },
							{ className: "centerCols", "targets": [ 1 ] } 
						],
						"ajax": '${request.contextPath + '/tripCreator/vehiclesTableData'}',
						"jQueryUI": true,
						"dom": '<"H" f>t<"F"ip>',
						"initComplete": function(settings, json) {
						    moreVehiclesDialog.dialog('open');
						 }
					});
			}
			
			else
			{
				vehicleTable.ajax.reload();
			}
			
						
			$('#vehiclesTable tbody').on('click', 'tr', function(){
			
				$("#confirmSelectedVehicle").prop('disabled', false).removeClass( 'ui-state-disabled' );
				var aData = vehicleTable.row(this).data()
				
				
				selectedVehicleId = aData[0];	
	
				
				if ($selectedVehicleRow) {
					$selectedVehicleRow.removeClass("rowSelected");
				}
				
				$selectedVehicleRow = $(this);
				$selectedVehicleRow.addClass("rowSelected");	
	
			});
		});
		</script>
	</head>
	<body>
		<div class="grid-100" style="padding:10px 0;">
			<table width="100%" id="vehiclesTable" class="clickable">
				<thead style="min-height: 10px">
					<tr>
              			<th title="id"></th>
              			<th title="label" style="text-align: center">Label</th>
              			<th title="year" style="text-align: center">Year</th>
              			<th title="make" style="text-align: center">Make</th>
              			<th title="model" style="text-align: center">Model</th>              			
              		</tr>
				</thead>
			</table>
		</div>
	</body>
</html>
