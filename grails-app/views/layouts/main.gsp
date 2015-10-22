<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title><g:layoutTitle/></title>
	<link rel="shortcut icon" href="${resource(dir: 'images', file: 'favicon.png')}">
	<asset:stylesheet src="application.css"/>
	<asset:javascript src="application.js"/>
	<asset:stylesheet src="unsemantic-grid-responsive-tablet-no-ie7.css"/>

	<script type="text/javascript" src="https://code.jquery.com/jquery-2.0.3.min.js"></script>
	<script type="text/javascript" src="https://code.jquery.com/ui/1.10.4/jquery-ui.min.js"></script>
	<script type="text/javascript" src="https://cdn.datatables.net/1.10.0/js/jquery.dataTables.js"></script>
	<asset:stylesheet src="jqueryui-carvoyant-theme/jquery-ui-1.10.4.custom.min.css"/>
	
	<asset:javascript src="jquery-ui-timepicker-addon.min.js"/>
	<asset:stylesheet src="jquery-ui-timepicker-addon.min.css"/>
	
			<style media="all" type="text/css">
    		.centerCols { text-align: center; }
    		.dataTables_scrollBody { background: #FFFFFF }
    		.dataTables_wrapper {
    			box-shadow: 2px 2px 5px #22426d;
    			border-radius: 5px;
    		}
    		.ui-progressbar {
		    position: relative;
		  }
		  .progress-label {
		    position: absolute;
		    top: 4px;
		    width: 100%;
			text-align: center;
			color:white;
		  }
    		.ui-dialog-buttonpane, .ui-dialog {background: #F5F7FC !important}
		</style>
	<g:layoutHead/>
</head>
<body>
	<div class="grid-container ui-widget" style="height:100%">
	<g:layoutBody/>
	</div>
</body>
</html>