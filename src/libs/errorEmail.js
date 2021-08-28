import API from "@aws-amplify/api";

/**
 * A function to generate an email.
 * @param {A} messageTitle This is the main message header, and the email header
 * @param {*} messageDescription The brunt of the message.
 * @TODO Issue #24
 */

export function generateEmail(messageTitle, messageDescription) {
  let email = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
	<html xmlns:v="urn:schemas-microsoft-com:vml">
		<head>
			<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
			<meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0;">
			<meta name="viewport" content="width=600,initial-scale = 2.3,user-scalable=no">
			<!--[if !mso]>
				<!-- -->
			<link href="https://fonts.googleapis.com/css?family=Open+Sans%3A300,400,700" rel="stylesheet">
			<!--
					<![endif]-->
			<title>Stay on our mailing list</title>
			<style type="text/css">
				body {
					width: 100%;
					background-color: #ffffff;
					margin: 0;
					padding: 0;
					-webkit-font-smoothing: antialiased;
					mso-margin-top-alt: 0px;
					mso-margin-bottom-alt: 0px;
					mso-padding-alt: 0px 0px 0px 0px;
				}
				
				p,
				h1,
				h2,
				h3,
				h4 {
					margin-top: 0;
					margin-bottom: 0;
					padding-top: 0;
					padding-bottom: 0;
				}
				
				span.preheader {
					display: none;
					font-size: 1px;
				}
				
				html {
					width: 100%;
				}
				
				table {
					font-size: 14px;
					border: 0;
				}
				/* ----------- responsivity ----------- */
				
				@media only screen and (max-width: 640px) {
					/*------ top header ------ */
					.main-header {
						font-size: 20px !important;
					}
					.main-section-header {
						font-size: 28px !important;
					}
					.show {
						display: block !important;
					}
					.hide {
						display: none !important;
					}
					.align-center {
						text-align: center !important;
					}
					.no-bg {
						background: none !important;
					}
					/*----- main image -------*/
					.main-image img {
						width: 440px !important;
						height: auto !important;
					}
					/* ====== divider ====== */
					.divider img {
						width: 440px !important;
					}
					/*-------- container --------*/
					.container590 {
						width: 440px !important;
					}
					.container580 {
						width: 400px !important;
					}
					.main-button {
						width: 220px !important;
					}
					/*-------- secions ----------*/
					.section-img img {
						width: 320px !important;
						height: auto !important;
					}
					.team-img img {
						width: 100% !important;
						height: auto !important;
					}
				}
				
				@media only screen and (max-width: 479px) {
					/*------ top header ------ */
					.main-header {
						font-size: 18px !important;
					}
					.main-section-header {
						font-size: 26px !important;
					}
					/* ====== divider ====== */
					.divider img {
						width: 280px !important;
					}
					/*-------- container --------*/
					.container590 {
						width: 280px !important;
					}
					.container590 {
						width: 280px !important;
					}
					.container580 {
						width: 260px !important;
					}
					/*-------- secions ----------*/
					.section-img img {
						width: 280px !important;
						height: auto !important;
					}
				}
	
			</style>
			<!--[if gte mso 9]>
					<style type=”text/css”>
			body {
			font-family: arial, sans-serif!important;
			}
			</style>
					<![endif]-->
		</head>
		<body class="respond">
	
			<!-- pre-header -->
	
			<table style="display:none!important;">
				<tbody>
					<tr>
						<td>
							<div style="overflow:hidden;display:none;font-size:1px;color:#ffffff;line-height:1px;font-family:Arial;maxheight:0px;max-width:0px;opacity:0;">
								<!-- Edit preview text as required for your platform ======-->
								${messageTitle}
							</div>
						</td>
					</tr>
				</tbody>
			</table>
			<!-- pre-header end -->
			<!-- header -->
	
			<table bgcolor="ffffff" border="0" cellpadding="0" cellspacing="0" width="100%">
				<tbody>
					<tr>
						<td align="center">
	
							<table align="center" border="0" cellpadding="0" cellspacing="0" class="container590" width="590">
								<tbody>
									<tr>
										<td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td>
									</tr>
									<tr>
										
									</tr>
								</tbody>
							</table>
						</td>
					</tr>
				</tbody>
			</table>
			<table bgcolor="ffffff" border="0" cellpadding="0" cellspacing="0" class="bg_color" width="100%">
				<tbody>
					<tr>
						<td align="center">
	
							<table align="center" border="0" cellpadding="0" cellspacing="0" class="container590" width="590">
								<tbody>
									<tr>
										<td align="center" class="main-header" style="color: #343434; font-size: 24px; font-family: Open Sans, Helvetica, sans-serif; font-weight:400;line-height: 35px;">
											<!-- section text ======-->
											<div style="line-height: 35px;">
	
												${messageTitle}
	
											</div>
										</td>
									</tr>
									<tr>
										<td height="10" style="font-size: 10px; line-height: 10px;">&nbsp;</td>
									</tr>
									<tr>
										<td align="center">
	
											<table align="center" bgcolor="eeeeee" border="0" cellpadding="0" cellspacing="0" width="40">
												<tbody>
													<tr>
														<td height="2" style="font-size: 2px; line-height: 2px;">&nbsp;</td>
													</tr>
												</tbody>
											</table>
										</td>
									</tr>
									<tr>
										<td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td>
									</tr>
									<tr>
										<td align="left">
	
											<table align="center" border="0" cellpadding="0" cellspacing="0" class="container590" width="590">
												<tbody>
													<tr>
														<td align="left" style="color: #888888; font-size: 16px; font-family: Open Sans, Helvetica, sans-serif; line-height: 28px;">
	
															<p style="line-height: 26px; margin-bottom:15px;">
																Hey there,
															</p>
	
															<p style="line-height: 26px;margin-bottom:15px;">
																${messageDescription}
															</p>
	
															<p style="line-height: 28px;">
																Regards,
	
																<br>Pareto Team
	
															</p>
														</td>
													</tr>
												</tbody>
											</table>
										</td>
									</tr>
								</tbody>
							</table>
						</td>
					</tr>
					<tr>
						<td height="40" style="font-size: 40px; line-height: 40px;">&nbsp;</td>
					</tr>
				</tbody>
			</table>
		
		</body>
	</html>`;
  return email;
}

export function generateErrorEmail(
  fName,
  lName,
  timestamp,
  errorTitle,
  errorMessage
) {
  let email = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
	<html xmlns:v="urn:schemas-microsoft-com:vml">
		<head>
			<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
			<meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0;">
			<meta name="viewport" content="width=600,initial-scale = 2.3,user-scalable=no">
			<!--[if !mso]>
				<!-- -->
			<link href="https://fonts.googleapis.com/css?family=Open+Sans%3A300,400,700" rel="stylesheet">
			<!--
					<![endif]-->
			<title>Stay on our mailing list</title>
			<style type="text/css">
				body {
					width: 100%;
					background-color: #ffffff;
					margin: 0;
					padding: 0;
					-webkit-font-smoothing: antialiased;
					mso-margin-top-alt: 0px;
					mso-margin-bottom-alt: 0px;
					mso-padding-alt: 0px 0px 0px 0px;
				}
				
				p,
				h1,
				h2,
				h3,
				h4 {
					margin-top: 0;
					margin-bottom: 0;
					padding-top: 0;
					padding-bottom: 0;
				}
				
				span.preheader {
					display: none;
					font-size: 1px;
				}
				
				html {
					width: 100%;
				}
				
				table {
					font-size: 14px;
					border: 0;
				}
				/* ----------- responsivity ----------- */
				
				@media only screen and (max-width: 640px) {
					/*------ top header ------ */
					.main-header {
						font-size: 20px !important;
					}
					.main-section-header {
						font-size: 28px !important;
					}
					.show {
						display: block !important;
					}
					.hide {
						display: none !important;
					}
					.align-center {
						text-align: center !important;
					}
					.no-bg {
						background: none !important;
					}
					/*----- main image -------*/
					.main-image img {
						width: 440px !important;
						height: auto !important;
					}
					/* ====== divider ====== */
					.divider img {
						width: 440px !important;
					}
					/*-------- container --------*/
					.container590 {
						width: 440px !important;
					}
					.container580 {
						width: 400px !important;
					}
					.main-button {
						width: 220px !important;
					}
					/*-------- secions ----------*/
					.section-img img {
						width: 320px !important;
						height: auto !important;
					}
					.team-img img {
						width: 100% !important;
						height: auto !important;
					}
				}
				
				@media only screen and (max-width: 479px) {
					/*------ top header ------ */
					.main-header {
						font-size: 18px !important;
					}
					.main-section-header {
						font-size: 26px !important;
					}
					/* ====== divider ====== */
					.divider img {
						width: 280px !important;
					}
					/*-------- container --------*/
					.container590 {
						width: 280px !important;
					}
					.container590 {
						width: 280px !important;
					}
					.container580 {
						width: 260px !important;
					}
					/*-------- secions ----------*/
					.section-img img {
						width: 280px !important;
						height: auto !important;
					}
				}
	
			</style>
			<!--[if gte mso 9]>
					<style type=”text/css”>
			body {
			font-family: arial, sans-serif!important;
			}
			</style>
					<![endif]-->
		</head>
		<body class="respond">
	
			<!-- pre-header -->
	
			<table style="display:none!important;">
				<tbody>
					<tr>
						<td>
							<div style="overflow:hidden;display:none;font-size:1px;color:#ffffff;line-height:1px;font-family:Arial;maxheight:0px;max-width:0px;opacity:0;">
								<!-- Edit preview text as required for your platform ======-->
								Reported Bug from Pareto-Web
							</div>
						</td>
					</tr>
				</tbody>
			</table>
			<!-- pre-header end -->
			<!-- header -->
	
			<table bgcolor="ffffff" border="0" cellpadding="0" cellspacing="0" width="100%">
				<tbody>
					<tr>
						<td align="center">
	
							<table align="center" border="0" cellpadding="0" cellspacing="0" class="container590" width="590">
								<tbody>
									<tr>
										<td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td>
									</tr>
									<tr>
										
									</tr>
								</tbody>
							</table>
						</td>
					</tr>
				</tbody>
			</table>
			<table bgcolor="ffffff" border="0" cellpadding="0" cellspacing="0" class="bg_color" width="100%">
				<tbody>
					<tr>
						<td align="center">
	
							<table align="center" border="0" cellpadding="0" cellspacing="0" class="container590" width="590">
								<tbody>
									<tr>
										<td align="center" class="main-header" style="color: #343434; font-size: 24px; font-family: Open Sans, Helvetica, sans-serif; font-weight:400;line-height: 35px;">
											<!-- section text ======-->
											<div style="line-height: 35px;">
	
												Please respond to this technical issue from Web
	
											</div>
										</td>
									</tr>
									<tr>
										<td height="10" style="font-size: 10px; line-height: 10px;">&nbsp;</td>
									</tr>
									<tr>
										<td align="center">
	
											<table align="center" bgcolor="eeeeee" border="0" cellpadding="0" cellspacing="0" width="40">
												<tbody>
													<tr>
														<td height="2" style="font-size: 2px; line-height: 2px;">&nbsp;</td>
													</tr>
												</tbody>
											</table>
										</td>
									</tr>
									<tr>
										<td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td>
									</tr>
									<tr>
										<td align="left">
	
											<table align="center" border="0" cellpadding="0" cellspacing="0" class="container590" width="590">
												<tbody>
													<tr>
														<td align="left" style="color: #888888; font-size: 16px; font-family: Open Sans, Helvetica, sans-serif; line-height: 28px;">
	
															<p style="line-height: 26px; margin-bottom:15px;">
																Hey there,
															</p>
	
															<p style="line-height: 26px;margin-bottom:15px;">
																${fName} ${lName} has the following error occur at ${timestamp} ${errorTitle} ${errorMessage}
															</p>
	
															<p style="line-height: 28px;">
																Regards,
	
																<br>Vilfredo
	
															</p>
														</td>
													</tr>
												</tbody>
											</table>
										</td>
									</tr>
								</tbody>
							</table>
						</td>
					</tr>
					<tr>
						<td height="40" style="font-size: 40px; line-height: 40px;">&nbsp;</td>
					</tr>
				</tbody>
			</table>
		
		</body>
	</html>`;
  let body = {
    recipient: "mikhael@hey.com",
    sender: "michael@fsa.community",
    subject: "Bug: Network Request",
    htmlBody: email,
    textBody: "Hello",
  };
  return API.post("util", "/email", { body });
}
