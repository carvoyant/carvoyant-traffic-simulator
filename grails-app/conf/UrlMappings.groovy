class UrlMappings {

	static mappings = {
        "/$controller/$action?/$id?(.$format)?"{
            constraints {
                // apply constraints here
            }
        }
		
		"/health" (view: "/health")
        "/"(controller:"authentication")
        "500"(view:'/error')
	}
}
