<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="layout" content="main"/>

<title>Traffic Simulator</title>

</head>
	<body>
	
	<%
		def loginFailureMsg
		
		if (session[org.springframework.security.web.WebAttributes.AUTHENTICATION_EXCEPTION] != null) {
			loginFailureMsg = g.message(code: "springSecurity.errors.login.fail")
			session[org.springframework.security.web.WebAttributes.AUTHENTICATION_EXCEPTION] = null;
		}
	%>

			<div class="prefix-33 grid-33 grid-parent ui-widget" style="height:200px; margin-top:200px; text-align:center">
				<div class="grid-100" style="padding-bottom:20px;"><asset:image src="logo-large.png"/></div>
				<form method="POST" name="loginForm" action="${resource(file: 'j_spring_security_check')}">
					<div class="grid-100 ui-state-highlight ui-corner-all" id="displayMessage" style="padding:10px; margin-top:10px; margin-bottom:10px; display:none;"></div>
					<div class="grid-50" style="font-size:1.1em; font-style:italic; text-align:right;">username:</div>
					<div class="grid-50" style="text-align:left"><g:textField class="ui-widget-content ui-corner-all" name="j_username" tabindex="1"/></div>
					<div class="grid-50" style="font-size:1.1em; font-style:italic; text-align:right;">password:</div>
					<div class="grid-50" style="text-align:left"><g:passwordField class="ui-widget-content ui-corner-all" name="j_password" tabindex="2"/></div>
					<div class="grid-100" style="padding-top:1em"><g:submitButton name="login" value="Login" tabindex="3"/></div>
				</form>
				
				<g:if test="${loginFailureMsg}">
					<div class="grid-100" style="padding-top:20px;">
						<div class="ui-widget">
							<div class="ui-state-error ui-corner-all" style="padding: 10px;">
								<span class="ui-icon ui-icon-alert" style="float: left; margin-right: 10px;"></span>${loginFailureMsg}
							</div>
						</div>
					</div>
				</g:if>
				
			</div>
	</body>
</html>
