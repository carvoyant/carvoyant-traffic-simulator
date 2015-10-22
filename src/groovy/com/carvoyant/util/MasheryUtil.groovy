package com.carvoyant.util

class MasheryUtil {

	private MasheryUtil() {
	}

	public static getSig(apiKey, sharedSecret)
	{
		def timeStamp = ((int)(new Date()).getTime()/1000).toString()
		def sig = (apiKey + sharedSecret + timeStamp).encodeAsMD5()
		return sig
	}

}
