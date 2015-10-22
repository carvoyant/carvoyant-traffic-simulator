<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
	<head>
		<meta name="layout" content="formDialog" />
		<content tag="formName">userForm</content>
		<content tag="submitController">tripCreatorController</content>
		<content tag="submitAction">deleteTrip</content>
		<asset:stylesheet src="jquery.dataTables_themeroller.css"/>

		<script>

		$(document).ready(function() {
				$("#dialogDeleteButton").button("disable");
				deleteTripTable = $('#deleteTripTable').DataTable({
					"autoOpen": false,
					"pagingType": "simple",
					"serverSide": true,
					"processing": true,
					"pageLength": 20,
					"order": [[ 2, "desc" ]],
					"columnDefs": [ 
						{ "visible": false, "targets": [0] },
						{ "type": "date", "targets": [ 2 ], "dateFormat": "yyyyMMdd'T'HHmmssZ", "width":"200px"} 
					],
					"ajax": {
						url : '${request.contextPath + '/tripCreator/tripTableData'}',
						data : {
							tableName: "delete"
							}
					},
					"jQueryUI": true,
					"dom": '<"H" f>t<"F"ip>',
					"initComplete": function(settings, json) {
						deleteTripDialog.dialog('open');
					 }
							 
				});

						
			$('#deleteTripTable tbody').on('click', 'tr', function(){
			
				$("#dialogDeleteButton").button("enable");
				var aData = deleteTripTable.row(this).data()				
				selectedDeleteTripId = aData[0];	
	
				
				if ($selectedDeleteTripRow) {
					$selectedDeleteTripRow.removeClass("rowSelected");
				}
				
				$selectedDeleteTripRow = $(this);
				$selectedDeleteTripRow.addClass("rowSelected");	
	
			});
		});
		</script>
	</head>
	<body>
		<div class="grid-100" style="padding:10px 0;">
			<table width="100%" id="deleteTripTable" class="clickable">
				<thead style="min-height: 10px">
					<tr>
              			<th title="id"></th>
              			<th title="name" style="text-align: center">Name</th>
              			<th title="dateModified" style="text-align: center">Date Modified</th>               			
              		</tr>
				</thead>
			</table>
		</div>
	</body>
</html>
