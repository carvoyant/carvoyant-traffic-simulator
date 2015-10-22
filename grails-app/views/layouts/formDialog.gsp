<!DOCTYPE html>
	<head>
	
		<r:require modules="application, jquery, jqueryui"/>
		
		<g:layoutHead/>
		<r:layoutResources />
		
		<g:javascript>
        	$(document).ready(function() {
				$("input, select, textarea").addClass("text ui-widget-content ui-corner-all");
        	});
        </g:javascript>
	</head>
	<body>
		<g:form name="${pageProperty(name:'page.formName') }" controller="${pageProperty(name:'page.submitController') }" action="${pageProperty(name:'page.submitAction') }">
			<g:layoutBody/>
		</g:form>
	
		<r:layoutResources />
	</body>
</html>
