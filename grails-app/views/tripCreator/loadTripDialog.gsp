<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
	<head>
		<meta name="layout" content="formDialog" />
		<content tag="formName">userForm</content>
		<content tag="submitController">tripCreatorController</content>
		<content tag="submitAction">loadTrip</content>
		<asset:stylesheet src="jquery.dataTables_themeroller.css"/>

		<script>
		var showTemplates = true;
		$(document).ready(function() {
			$("#dialogLoadButton").button("disable");
			
				tripTable = $('#tripTable').DataTable({
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
						data : 	function ( d ) {
							d.tableName = "load",
							d.showTemplates = showTemplates
					    }
					},
					"jQueryUI": true,
					"dom": '<"H" <"#tripToolbar"> f>t<"F"ip>',
					"initComplete": function(settings, json) {
						loadTripDialog.dialog('open');
					 }
						 
				});
			
	
			
			$("#tripToolbar").html('<label for="showTemplates"><input type="checkbox" id="showTemplates"><span id="showTemplatesCheckMark" class="checkbox"></span><span class="checkboxLabel">Show Shared Templates</span></label>');
			$("#tripToolbar").css("display", "inline");
			$("#tripTable_filter").css("display", "inline");

			$("#showTemplates").click(function() {
				if(this.checked){
					$("#showTemplatesCheckMark").html("<span class='check'>&#x2713</span>");
					$("#showTemplatesCheckMark").addClass("checkedBox");
				}
				else{
					$("#showTemplatesCheckMark").html("");
					$("#showTemplatesCheckMark").removeClass("checkedBox");
				}
				showTemplates = this.checked;
				tripTable.draw();
			});
			
			$('#tripTable tbody').on('click', 'tr', function(){
			
				$("#dialogLoadButton").button("enable");
				var aData = tripTable.row(this).data()			
				selectedTripId = aData[0];	
	
				
				if ($selectedTripRow) {
					$selectedTripRow.removeClass("rowSelected");
				}
				
				$selectedTripRow = $(this);
				$selectedTripRow.addClass("rowSelected");	
	
			});

			$("#showTemplatesCheckMark").html("<span class='check'>&#x2713</span>");
			$("#showTemplatesCheckMark").addClass("checkedBox");
			$('#showTemplates').prop('checked', true);
		});
		</script>
	</head>
	<body>
		<div class="grid-100" style="padding:10px 0;">
			<table width="100%" id="tripTable" class="clickable">
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
