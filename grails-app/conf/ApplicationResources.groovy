modules = {
    application {
        resource url:'js/application.js', disposition: 'head', attrs: [type:'js']
		resource url:'css/application.css', attrs: [type:'css']
		resource url:'css/unsemantic-grid-responsive-tablet-no-ie7.css', attrs: [type:'css']
    }
	
	jquery {
		resource url: 'https://code.jquery.com/jquery-2.0.3.min.js', disposition: 'head', attrs: [type:'js']
	}

	jqueryui {
		dependsOn 'jquery'
		resource url: 'https://code.jquery.com/ui/1.10.4/jquery-ui.min.js', disposition: 'head', attrs: [type:'js']
		resource url: 'css/jqueryui-carvoyant-theme/jquery-ui-1.10.4.custom.min.css', attrs: [type:'css']
	}
	
	datatables {
		dependsOn 'jquery'
		resource url: "https://cdn.datatables.net/1.10.0/js/jquery.dataTables.js", disposition: 'head', attrs: [type:'js']
//		resource url: "https://cdn.datatables.net/1.10.0/css/jquery.dataTables.css"
		resource url: "https://cdn.datatables.net/plug-ins/e9421181788/integration/jqueryui/dataTables.jqueryui.js", disposition: 'head', attrs: [type:'js']
		resource url: 'datatables/css/jquery.dataTables_themeroller.css', attrs: [type:'css']
}

	markerwithlabel {
		resource url:'js/googlemaps/markerwithlabel.js', disposition: 'head', attrs: [type:'js']
	}
	
	infobox {
		resource url:'js/googlemaps/infobox.js', disposition: 'head', attrs: [type:'js']
	}
	
	timePicker
	{
		dependsOn 'jquery'
		resource url:'js/jquery.ui.timepicker.js', attrs: [type:'js']
		resource url:'css/jquery.ui.timepicker.css', attrs: [type:'css']
	}

}