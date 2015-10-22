package com.carvoyant.api

class ApiException extends Exception implements Serializable {
	
	int httpStatus;
	
	ApiException(int httpStatus) {
		super()
		this.httpStatus = httpStatus;
	}
	
	ApiException(String message, int httpStatus) {
		super(message)
		this.httpStatus = httpStatus;
	}
	
	ApiException(Throwable cause, int httpStatus) {
		super(cause)
		this.httpStatus = httpStatus;
	}
	
	ApiException(String message, Throwable cause, int httpStatus) {
		super(message, cause)
		this.httpStatus = httpStatus;
	}

}
