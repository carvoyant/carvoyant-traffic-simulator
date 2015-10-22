package com.carvoyant.simulator

import groovy.json.JsonSlurper

class AuthenticationController {
	
	def authenticationService
	def carvoyantService

	def receiveToken()
	{
		def user = carvoyantService.getAccount(params.access_token)
		if(user)
		{
			authenticationService.login(user, params.access_token)
			redirect(controller:"tripCreator")
		}
	}
	
	def index()
	{
		def loggedIn = false
		if(loggedIn)
		{
			redirect(controller:"TripCreator")
		}
		
		else
		{
			//dev creds
			//def client_id = "tmbgnfata66a2sq5qunffjvw"
			//def redirect_uri = "https://10.0.0.42:8443/TrafficSimulatorScheduler/Authentication/receiveToken"
			
			def client_id = "5j4t5tg74k6pvu4yjve8unm7"
			def redirect_uri = "https://sandbox-simulator.carvoyant.com/Authentication/receiveToken"
			def response_type = "token"
			def baseUrl = "https://sandbox-auth.carvoyant.com/OAuth/authorize"
			
			def url = baseUrl + "?redirect_uri=" + redirect_uri.encodeAsURL() + "&client_id=" + client_id + "&response_type=" + response_type
			redirect(url: url)
			
		}
	}
}
