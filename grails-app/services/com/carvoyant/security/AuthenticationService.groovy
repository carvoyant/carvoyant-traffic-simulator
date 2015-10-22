package com.carvoyant.security

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import wslite.http.auth.HTTPBasicAuthorization
import wslite.rest.RESTClientException
import org.springframework.security.core.authority.AuthorityUtils
import org.springframework.security.core.context.SecurityContextHolder

import com.carvoyant.simulator.User
import com.carvoyant.util.MasheryUtil

class AuthenticationService {

	static transactional = false

	def login(userParams, accessToken)
	{
		def user = new User(username:userParams.username,
				accessToken:accessToken,
				carvoyantId:userParams.id,
				firstName:userParams.firstName,
				lastName:userParams.lastName,
				email:userParams.email,
				timeZone:userParams.timeZone)
		
		Authentication authentication = new UsernamePasswordAuthenticationToken(user, null,
		AuthorityUtils.createAuthorityList("ROLE_CARVOYANT_USER"));
		SecurityContextHolder.getContext().setAuthentication(authentication);
	}	
}
