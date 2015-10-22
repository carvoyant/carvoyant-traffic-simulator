import grails.util.Environment

// Place your Spring DSL code here
beans = {
	switch(Environment.current) {
		case Environment.DEVELOPMENT:
			carvoyantApiSpringProvider(com.carvoyant.security.CarvoyantApiSpringProvider) { provider ->
				provider.autowire=true
				apiClientId="hasa2czfebhsj6njk4c6wt78"
				carvoyantApiRequestTokenURL="https://api.carvoyant.com/oauth/resourceOwnerToken"
				masherySecretKey="yQmr869rmb"
			}
			break

		case Environment.PRODUCTION:
			carvoyantApiSpringProvider(com.carvoyant.security.CarvoyantApiSpringProvider) { provider ->
				provider.autowire=true
				apiClientId="hasa2czfebhsj6njk4c6wt78"
				carvoyantApiRequestTokenURL="https://api.carvoyant.com/oauth/resourceOwnerToken"
				masherySecretKey="yQmr869rmb"
			}
			break

		case "sandbox":
			carvoyantApiSpringProvider(com.carvoyant.security.CarvoyantApiSpringProvider) { provider ->
				provider.autowire=true
				apiClientId="r6dwmz2zxkqms7sac2r8mdqa"
				carvoyantApiRequestTokenURL="https://sandbox-api.carvoyant.com/oauth/resourceOwnerToken"
				masherySecretKey="q8xkKKmWAM"
			}
			break
	}
}
