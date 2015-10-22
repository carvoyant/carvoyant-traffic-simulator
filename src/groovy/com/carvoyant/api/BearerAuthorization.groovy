package com.carvoyant.api

import wslite.http.HTTP
import wslite.http.auth.HTTPAuthorization

class BearerAuthorization implements HTTPAuthorization {
	
	String bearerToken;

	public BearerAuthorization(String token) {
		bearerToken = token
	}

	@Override
	void authorize(conn) {
		conn.addRequestProperty(HTTP.AUTHORIZATION_HEADER, getAuthorization())
	}
	
	private String getAuthorization() {
//		'Bearer ' + "${bearerToken}".toString().bytes.encodeBase64()
		"Bearer ${bearerToken}"
	}
}
