package com.carvoyant.services


import wslite.http.HTTPClientException
import wslite.http.auth.HTTPBasicAuthorization

import com.carvoyant.api.ApiCredentialException
import com.carvoyant.api.ApiException
import com.carvoyant.api.BearerAuthorization

import grails.converters.JSON
import grails.web.JSONBuilder
import groovy.json.JsonSlurper

import java.text.SimpleDateFormat

import com.carvoyant.simulator.Trip
import java.text.DateFormat
import org.codehaus.groovy.grails.web.json.JSONArray
import org.codehaus.groovy.grails.web.json.JSONObject


class CarvoyantService {

	static transactional = false
	
	def grailsApplication
	def springSecurityService	
	
	def buildDataSet(params)
	{
		def dataSet = [:]
		def slurper = new JsonSlurper()
		def collectionPoint = slurper.parseText(params.collectionPoint)
	
		SimpleDateFormat timePickerDateParser = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS", Locale.ENGLISH)
		SimpleDateFormat carvoyantDateParser = new SimpleDateFormat("yyyyMMdd'T'HHmmssZ")

		def timestamp = carvoyantDateParser.format(timePickerDateParser.parse(collectionPoint.timestamp[0..collectionPoint.timestamp.length()-2]))
		
		dataSet.ignitionStatus = params.ignitionStatus
		dataSet.timestamp = timestamp
		
		def waypointData = [:]
		waypointData.timestamp = timestamp
		waypointData.key = "GEN_WAYPOINT"
		waypointData.value = collectionPoint.lat + "," + collectionPoint.lng
				


		dataSet.datum = [waypointData]

		if(dataSet.ignitionStatus == "OFF")
		{
			def tripMileage = [:]
			tripMileage.timestamp = timestamp
			tripMileage.key = "GEN_TRIP_MILEAGE"
			tripMileage.value = params.mileage
			dataSet.datum.push(tripMileage)
		}
		
		if(collectionPoint.RPM != null)
		{
			def RPMData = [:]
			RPMData.timestamp = timestamp
			RPMData.key = "GEN_RPM"
			RPMData.value = collectionPoint.RPM
			dataSet.datum.push(RPMData)
		}
		
		if(collectionPoint.fuelLevel != null)
		{
			def fuelLevelData = [:]
			fuelLevelData.timestamp = timestamp
			fuelLevelData.key = "GEN_FUELLEVEL"
			fuelLevelData.value = collectionPoint.fuelLevel
			dataSet.datum.push(fuelLevelData)
		}
		
		if(collectionPoint.fuelRate != null)
		{
			def fuelRateData = [:]
			fuelRateData.timestamp = timestamp
			fuelRateData.key = "GEN_FUELRATE"
			fuelRateData.value = collectionPoint.fuelRate
			dataSet.datum.push(fuelRateData)
		}
		
		if(collectionPoint.engineTemp != null)
		{
			def engineTempData = [:]
			engineTempData.timestamp = timestamp
			engineTempData.key = "GEN_ENGINE_COOLANT_TEMP"
			engineTempData.value = collectionPoint.engineTemp
			dataSet.datum.push(engineTempData)
		}
		
		if(collectionPoint.event != null)
		{
			def eventData = [:]
			eventData.timestamp = timestamp
			eventData.key = collectionPoint.event
			if(collectionPoint.troubleCode)
			{
				eventData.value = collectionPoint.troubleCode				
			}
			else
			{
				eventData.value = true
			}
			dataSet.datum.push(eventData)
		}
		
		else
		{
			def speedData = [:]
			speedData.timestamp = timestamp
			speedData.key = "GEN_SPEED"
			speedData.value = collectionPoint.speed
			
			def voltageData = [:]
			voltageData.timestamp = timestamp
			voltageData.key = "GEN_VOLTAGE"
			voltageData.value = collectionPoint.voltage
			
			dataSet.datum.push(speedData)
			dataSet.datum.push(voltageData)
		}

		return dataSet

	}
	
	
	def postDataSet(dataSet)
	{

		try 
		{
			withRest(url: grailsApplication.config.carvoyant.api.endpoint,
					sslTrustAllCerts: grailsApplication.config.carvoyant.api.sslTrustAllCerts,
					authorization: new BearerAuthorization(springSecurityService.principal.accessToken)) 
			{
				post(path: "/vehicle/${springSecurityService.principal.selectedVehicleId}/dataSet/") {
					json	dataSet
				}
			}
		} 
		catch (HTTPClientException hce) 
		{
			switch(hce.getResponse().statusCode) 
			{
				case 401 :
					throw new ApiCredentialException(hce.getMessage(), hce, hce.getResponse().statusCode)
					break
				default :
					throw new ApiException(hce.getMessage(), hce, hce.getResponse().statusCode)
			}
		}
	}
	
	def getToken(){
		
		try {
			withRest(url: grailsApplication.config.carvoyant.api.server,
				sslTrustAllCerts: grailsApplication.config.carvoyant.api.sslTrustAllCerts,
				authorization: new  HTTPBasicAuthorization(grailsApplication.config.carvoyant.api.key, grailsApplication.config.carvoyant.api.secret)) {

				def response = post(path: "/oauth/token") {
					urlenc 	grant_type: "client_credentials"
				}
				
				return response.json.access_token
			}
		} catch (HTTPClientException hce) {
		
			switch(hce.getResponse().statusCode) {
				
				case 401 :
					log.error(hce)
					throw new ApiCredentialException(hce.getMessage(), hce, hce.getResponse().statusCode)
					break
				default :
					hce.printStackTrace()
					throw new ApiException(hce.getMessage(), hce, hce.getResponse().statusCode)
					
					
			}
		}

	}
	
	def getAccount(String accessToken) throws ApiException {
		def accountHolder = [:]
		
		try {
			withRest(url: grailsApplication.config.carvoyant.api.endpoint,
					sslTrustAllCerts: grailsApplication.config.carvoyant.api.sslTrustAllCerts,
					authorization: new BearerAuthorization(accessToken)) {
				def response = get(path: "/account/")
				def account = response.json.get("account")[0]
				accountHolder.id = account.id
				accountHolder.firstName = account.firstName
				accountHolder.lastName = account.lastName
				accountHolder.email = account.email
				accountHolder.zipcode = account.zipcode
				accountHolder.phone = account.phone
				accountHolder.timeZone = account.timeZone
				accountHolder.username = account.username
			}
		} catch (HTTPClientException hce) {
			switch(hce.getResponse().statusCode) {
				case 401 :
					throw new ApiCredentialException(hce.getMessage(), hce, hce.getResponse().statusCode)
					break
				default :
					throw new ApiException(hce.getMessage(), hce, hce.getResponse().statusCode)
			}
		}

		return accountHolder
	}
	
	def getVehicles() throws ApiException {
		def vehicles = []
		
		try {
			withRest(url: grailsApplication.config.carvoyant.api.endpoint,
					sslTrustAllCerts: grailsApplication.config.carvoyant.api.sslTrustAllCerts,
					authorization: new BearerAuthorization(springSecurityService.principal.accessToken)) {
				def response = get(path: '/vehicle/')
				response.json.get("vehicle").each { vehicle ->
					def v = [:]

					v.id = vehicle.get("vehicleId")
					if (vehicle.has("label")) {
						v.displayName = "${vehicle.get('name')} - ${vehicle.get('label')}"
						v.label = vehicle.get("label")
					} else {
						v.displayName = vehicle.get("name")
						v.label = "Unlabeled Vehicle"
					}

					if (vehicle.has("year")) v.year = vehicle.get("year")
					if (vehicle.has("make")) v.make = vehicle.get("make")
					if (vehicle.has("model")) v.model = vehicle.get("model")
					
					vehicles.add(v)
				}
			}
		} catch (HTTPClientException hce) {
			switch(hce.getResponse().statusCode) {
				case 401 :
					throw new ApiCredentialException(hce.getMessage(), hce, hce.getResponse().statusCode)
					break
				default :
					throw new ApiException(hce.getMessage(), hce, hce.getResponse().statusCode)
			}
		}

		return vehicles
	}

	def tripTableData(params) {
		
		def propertiesToRender = ['id', 'dateModified','name']
		
		def dataToRender = [:]

		dataToRender.aaData=[]
		

		def trips = Trip.findAllByAccountId(springSecurityService.principal.carvoyantId)
		
		
		if(params.get("search[value]"))
		{
			def searchVal = params.get("search[value]").toString().toLowerCase()
			trips = 	trips.findAll {
				it.name?.toLowerCase()?.contains(searchVal)
				}
		}
		else
		{
			if(params.tableName.equals("load") && params.boolean('showTemplates'))
			{
				def tripTemplates = Trip.findAllByAccountIdIsNull()
				for(t in tripTemplates) 
				{					
					dataToRender.aaData << [t.id, t.name, "Carvoyant Template"]
				}
			}
		}
		
		dataToRender.iTotalRecords = trips.size
		dataToRender.iTotalDisplayRecords = dataToRender.iTotalRecords

		def sortAsc = params.get("order[0][dir]")?.equalsIgnoreCase('asc') ? true : false
		
		trips?.sort() {a, b ->
			switch(params.int('order[0][column]')) {
				case 1 :
					if(a.name ==  null)
					{
						a.name = ""
					}
					if(b.name == null)
					{
						b.name = ""
					}
					if (sortAsc) {

						return (a.name.compareTo(b.name))
					} else {
						return -1 * (a.name.compareTo(b.name))
					}
					break
					
				case 2 :
					if(a.lastUpdated ==  null)
					{
						a.lastUpdated = ""
					}
					if(b.lastUpdated == null)
					{
						b.lastUpdated = ""
					}
					if (sortAsc) {

						return (a.lastUpdated.compareTo(b.lastUpdated))
					} else {
						return -1 * (a.lastUpdated.compareTo(b.lastUpdated))
					}
					break
			}
		}
		
		
		SimpleDateFormat formatter = SimpleDateFormat.getDateTimeInstance(DateFormat.MEDIUM, DateFormat.MEDIUM)
		formatter.setTimeZone(TimeZone.getTimeZone(springSecurityService.principal.timeZone))
		
		trips?.eachWithIndex { t, idx ->
			if (idx >= params.int('start') && idx < params.int('start') + params.int('length')) {
				dataToRender.aaData << [
					t.id,
					t.name,
					formatter.format(new Date(t.lastUpdated.getTime()))
					
				]
			}
		}

		return dataToRender as JSON
	}
	
	def vehiclesTableData(params) {
		
				
		def propertiesToRender = ['id', 'label', 'year', 'make', 'model']
		
		def dataToRender = [:]

		dataToRender.aaData=[]
		def vehicles  = getVehicles()
		if(params.get("search[value]"))
		{
			def searchVal = params.get("search[value]").toString().toLowerCase()
			vehicles = 	vehicles.findAll {
				it.label?.toLowerCase()?.contains(searchVal) ||
				it.year?.toLowerCase()?.contains(searchVal) ||
				it.make?.toLowerCase()?.contains(searchVal) ||
				it.model?.toLowerCase()?.contains(searchVal)
				}
		}
		
		dataToRender.iTotalRecords = vehicles.size
		dataToRender.iTotalDisplayRecords = dataToRender.iTotalRecords

		def sortAsc = params.get("order[0][dir]")?.equalsIgnoreCase('asc') ? true : false

		vehicles?.sort() {a, b ->
			switch(params.int('order[0][column]')) {
				case 1 :
					if(a.label ==  null)
					{
						a.label = ""
					}
					if(b.label == null)
					{
						b.label = ""
					}
					if (sortAsc) {

						return (a.label.compareTo(b.label))
					} else {
						return -1 * (a.label.compareTo(b.label))
					}
					break
					
				case 2 :
					if(a.year ==  null)
					{
						a.year = ""
					}
					if(b.year == null)
					{
						b.year = ""
					}
					if (sortAsc) {

						return (a.year.compareTo(b.year))
					} else {
						return -1 * (a.year.compareTo(b.year))
					}
					break
					
				case 3 :
					if(a.make ==  null)
					{
						a.make = ""
					}
					if(b.make == null)
					{
						b.make = ""
					}
					if (sortAsc) {

						return (a.make.compareTo(b.make))
					} else {
						return -1 * (a.make.compareTo(b.make))
					}
					break
					
				case 4 :
					if(a.model ==  null)
					{
						a.model = ""
					}
					if(b.model == null)
					{
						b.model = ""
					}
					if (sortAsc) {

						return (a.model.compareTo(b.model))
					} else {
						return -1 * (a.model.compareTo(b.model))
					}
					break
					
				default :
					if (sortAsc) {
						return (a.id.compareTo(b.id))
					} else {
						return -1 * (a.id.compareTo(b.id))
					}
			}
		}
		
		vehicles?.eachWithIndex { v, idx ->
			if (idx >= params.int('start') && idx < params.int('start') + params.int('length')) {
				dataToRender.aaData << [
					v.id,
					v.label,
					v.year,
					v.make,
					v.model
				]
			}
		}

		return dataToRender as JSON
	}
	
	def isTripNameAvailable(tripSettings)
	{

		def t = Trip.findByNameAndAccountId(tripSettings.name, springSecurityService.principal.carvoyantId)
		if(t)
		{
			return false
		}
		else
		{
			return true
		}
	}
	
	def loadTrip(tripId)
	{
		def t =Trip.findById(tripId)
		return t
	}
	
	def saveTrip(tripSettings)
	{
		def t =  new Trip(	
							name:tripSettings.name, 
							startTime: tripSettings.startTime, 
							collectionPeriod: tripSettings.collectionPeriod,
							accountId: springSecurityService.principal.carvoyantId, 
							speedMin: tripSettings.speedMin,
							speedMax: tripSettings.speedMax,
							voltageMin: tripSettings.voltageMin,
							voltageMax: tripSettings.voltageMax
							
							)
		
		if(tripSettings.collectionPoints)
		{
			def stringArray = []
			def jArray = tripSettings.collectionPoints as JSONArray
			for(ja in jArray)
			{
				stringArray.push((ja as JSONObject).toString())
			}
			t.collectionPoints = stringArray
		}
		
		if(tripSettings.elapsedDistance)
		{
			t.elapsedDistance = tripSettings.elapsedDistance;
		}
		
		if(tripSettings.rpmMin)
		{
			t.rpmMin = tripSettings.rpmMin.toFloat()
			t.rpmMax = tripSettings.rpmMax.toFloat()
		}
		
		if(tripSettings.fuelLevelMin)
		{
			t.fuelLevelMin = tripSettings.fuelLevelMin.toFloat()
			t.fuelLevelMax = tripSettings.fuelLevelMax.toFloat()
		}
		
		if(tripSettings.fuelRateMin)
		{
			t.fuelRateMin = tripSettings.fuelRateMin.toFloat()
			t.fuelRateMax = tripSettings.fuelRateMax.toFloat()
		}
		
		if(tripSettings.engineTempMin)
		{
			t.engineTempMin = tripSettings.engineTempMin.toFloat()
			t.engineTempMax = tripSettings.engineTempMax.toFloat()
		}
		
		t.save(failOnError:true)
	}
	
	def deleteTrip(tripId)
	{
		def t = Trip.findById(tripId)
		if(t)
		{
			t.delete()
		}
	}
	
	def updateTrip(tripSettings)
	{
		def t = Trip.findByNameAndAccountId(tripSettings.name, springSecurityService.principal.carvoyantId)

		t.startTime = tripSettings.startTime
		t.collectionPeriod = tripSettings.collectionPeriod.toInteger()
		t.accountId = springSecurityService.principal.carvoyantId
		t.speedMin = tripSettings.speedMin.toFloat()
		t.speedMax = tripSettings.speedMax.toFloat()
		t.voltageMin = tripSettings.voltageMin.toFloat()
		t.voltageMax = tripSettings.voltageMax.toFloat()
		
		if(tripSettings.collectionPoints)
		{
			def stringArray = []
			def jArray = tripSettings.collectionPoints as JSONArray
			for(ja in jArray)
			{
				stringArray.push((ja as JSONObject).toString())
			}
			t.collectionPoints = stringArray
		}
		
		if(tripSettings.rpmMin)
		{
			t.rpmMin = tripSettings.rpmMin.toFloat()
			t.rpmMax = tripSettings.rpmMax.toFloat()
		}
		else
		{
			t.rpmMin = null
			t.rpmMax = null
		}
		
		if(tripSettings.fuelLevelMin)
		{
			t.fuelLevelMin = tripSettings.fuelLevelMin.toFloat()
			t.fuelLevelMax = tripSettings.fuelLevelMax.toFloat()
		}
		else
		{
			t.fuelLevelMin = null
			t.fuelLevelMax = null
		}
		
		if(tripSettings.fuelRateMin)
		{
			t.fuelRateMin = tripSettings.fuelRateMin.toFloat()
			t.fuelRateMax = tripSettings.fuelRateMax.toFloat()
		}
		else
		{
			t.fuelRateMin = null
			t.fuelRateMax = null
		}
		
		if(tripSettings.engineTempMin)
		{
			t.engineTempMin = tripSettings.engineTempMin.toFloat()
			t.engineTempMax = tripSettings.engineTempMax.toFloat()
		}
		else
		{
			t.engineTempMin = null
			t.engineTempMax = null
		}
		
		t.save()
			

	}
}

