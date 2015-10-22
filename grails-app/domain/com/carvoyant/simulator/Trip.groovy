package com.carvoyant.simulator

import grails.converters.JSON

class Trip {
		
	String name
	Date lastUpdated
	
	String startTime
	Integer collectionPeriod
	Integer accountId
	
	Float elapsedDistance
	Float speedMin
	Float speedMax
	Float voltageMin
	Float voltageMax
	Float rpmMin
	Float rpmMax
	Float fuelLevelMin
	Float fuelLevelMax
	Float fuelRateMin
	Float fuelRateMax
	Float engineTempMin
	Float engineTempMax
	
	String collectionPoints
	
    static constraints = {
		accountId(nullable:true)
		elapsedDistance(nullable:true)
		collectionPoints(nullable:true)
		rpmMin(nullable:true)
		rpmMax(nullable:true)
		fuelLevelMin(nullable:true)
		fuelLevelMax(nullable:true)
		fuelRateMin(nullable:true)
		fuelRateMax(nullable:true)
		engineTempMin(nullable:true)
		engineTempMax(nullable:true)
    }
	static mapping = {
		collectionPoints type: "text"
	}
}
