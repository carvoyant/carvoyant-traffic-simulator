package com.carvoyant.api

class ApiCredentialException extends ApiException implements Serializable {
	
	ApiCredentialException(String message, int httpStatus) {
		super(message, httpStatus)
	}

	ApiCredentialException(Throwable cause, int httpStatus) {
		super(cause, httpStatus)
	}

	ApiCredentialException(String message, Throwable cause, int httpStatus) {
		super(message, cause, httpStatus)
	}

}
