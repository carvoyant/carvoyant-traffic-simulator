package com.carvoyant.simulator

import com.carvoyant.services.CarvoyantService;

import grails.converters.JSON
import groovy.json.JsonSlurper

class TripCreatorController {

	def carvoyantService
	def springSecurityService
	
    def index() {
		
		def vehicles = carvoyantService.getVehicles()
		def vehicleNames = []
		int vehicleCount=0
		for (v in vehicles) {
			vehicleNames.add([name: v.displayName, id: v.id])
			vehicleCount++
			if(vehicleCount==5)
			{
				break
			}
		}

		if(springSecurityService.principal.selectedVehicleId == 0)
		{
			if(vehicles)
			{
				springSecurityService.principal.selectedVehicleId = vehicles[0].id
			}
		}

		render(view: "tripCreator", model: [vehicleNames: vehicleNames, selectedVehicleId: springSecurityService.principal.selectedVehicleId.toString() ])
	}
	
	def postDataSet()
	{
		def dataSet = carvoyantService.buildDataSet(params)
		carvoyantService.postDataSet(dataSet)
		render("OK")
	}
	
	def setSelectedVehicle(int vehicleId)
	{
		springSecurityService.principal.selectedVehicleId = vehicleId
		render vehicleId
	}
	
	def loadTrip()
	{
		render carvoyantService.loadTrip(params.tripId) as JSON
	}
	
	def deleteTrip()
	{
		carvoyantService.deleteTrip(params.tripId)
		render "OK"
	}
	
	def moreVehiclesDialog(){}
	def saveTripDialog(){}
	def loadTripDialog(){}
	def deleteTripDialog(){}
	def overwriteTripDialog(){
		[name: params.name]
	}
	def addEventDialog() {}
	def confirmDeleteTripDialog(){
		[name: Trip.findById(params.tripId).name]
	}
	def editEventInfoWindow()
	{
		
	}
	
	def checkSaveName()
	{		
		def slurper = new JsonSlurper()
		def tripSettings = slurper.parseText(params.tripSettings)
		def overwrite = true
		println tripSettings
		if(carvoyantService.isTripNameAvailable(tripSettings))
		{
			carvoyantService.saveTrip(tripSettings)
			overwrite = false
		}
		
		def resp = [ overwrite: overwrite, name: tripSettings.name] as JSON
		render resp
	}
	
	def overwriteTrip()
	{
		def slurper = new JsonSlurper()
		def tripSettings = slurper.parseText(params.tripSettings)
		carvoyantService.updateTrip(tripSettings)
		render("OK")
	}
	
	def vehiclesTableData() {
		
				
		def dataToRender = carvoyantService.vehiclesTableData(params)

		render dataToRender
	}
	
	def tripTableData() {
		
				
		def dataToRender = carvoyantService.tripTableData(params)

		render dataToRender
	}
	
	def validateInputAjax()
	{
		def resp = [:]
		if(params.int('val') < 0)
		{
			resp.error = "Cannot be negative"
		}
		render resp as JSON
	}
	
	def addEvent()
	{
		
	}
}
