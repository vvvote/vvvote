<?php
$config = array (
		
		// URLs of all Vvvote (permission) servers
		// point to the URL where the /api/ is contained (api will be added automatically) 
		// no trailing slash
		// At least 2 servers are needed.
		// This value must be the same on all Vvvote (permission) servers.
		'pServerUrlBases' => array (
				'https://localhost:446/vvvote/',
				'https://localhost:447/vvvote/' 
		),
		
		// TCP-Port of the Vvvote (tally) servers (currently only the first one is used)
		// Do not use SSL/TLS here. Why? The Vvvote-client uses an anonymizing service for
		// sending the vote. The anonymizing service strips off the browser's fingerprint
		// which cannot be done in an SSL/TLS connection. Anyway, the transmitted data itself
		// is encrypted by the Vvvote client using RSA/AES encryption
		// uncomment, if you need to change it..
		// This value must be the same on all Vvvote (permission) servers.
		// defaults to 'tServerStoreVotePorts' => array ( '80' ),
		// 'tServerStoreVotePorts' => array ('80'),
		
		
		// URL to your organisations's website
		// will be used as link for your organisation's logo
		// put the logo of your organisation in config, name it 'logo_brand_47x51.svg'
		'linkToHostingOrganisation' => 'https://www.vvvote.de/',
		
		// URL to the about page (German: Impressum)
		'aboutUrl' => '#',
		
		// Number of this server. Numbering starts with 1 and must correspond to the sequence
		// given in >pServerUrlBases< above
		'serverNo' => 1,
		
		// If debug is set and some error occurs, Vvvote will send possibly sensetive data
		// to the client which gives more information what caused the error.
		// defaults to false. In a productive environment, always set this to false.
		'debug' => true,
		
		// put the credentials for the database connection here
		'dbInfos' => array (
				'dbtype' => 'mysql', // Only "mysql" is tested
				'dbhost' => 'localhost',
				'dbuser' => 'vvvote1',
				'dbpassw'=> 'secret1',
				'dbname' => 'election_server1',
				// All table names will be prefixed with this prefix. It does not have any functional effect.
				'prefix' => 'el1_' 
		),
		
	
		// You can use an oAuth2 server or external tokens in order to check the users for egibility
		// Vvvote can handle several auth servers - just add another array in the 
		// 'oauthConfig' resp. 'externalTokenConfig' array.
		// The "cmrcx-Basisentscheid" uses external-token-auth, whereas the ekklesia ID-Server uses oAuth2.
		
		// In case you are using oAuth2, fill in the following section
		// Vvvote can handle several auth servers - just add another array.
		'oauthConfig' => array (
				array (
						
						// This is arbitrary, must be unique and is set in the new election request in order to 
						// request this auth config
						// It must match the according value in the portal configuration
						'serverId' => 'TelevotiaTest',
						
						// Short server description: Shown in webclient
						'serverDesc' 	=>	'Online-Abstimmungen der Schweizer Partei (Testserver)',
						
						// OAuth2 client-ID needed for authentication at the OAuth2 server
						// The client Ids of all vvvote servers are needed here, because the webclient need to 
						// know them all. This server picks his own based on $serverNo
						// Vvvote uses "authorization_bearer" as method. Maybe you have to set this option in
						// the oAuth2 server config resp. vvvote account there.
						'client_ids' => array('vvvote_neu_local_446', 'vvvote-neu-local-447'),
						
						// OAuth2 client secret needed for authentication at the OAuth2 server
						'client_secret' => "your_client_secret",
						
						// Hint for the configuration of the oAuh2 server:
						// Some oAuh2 servers require that you provide a callback-URL in order to make the authorization work.
						// This URL will be: [pServerUrlBase of this server] + '/modules-auth/oauth/callback.php'
						
						// type of oAuh2 server, currently only "ekklesia" is supported
						'type' => 'ekklesia',
						
						// You must use SSL/TLS here as the oAuth2 security relies on it.
						// In order to do so:
						// Copy the certificate (.pem)-file in backend/config and name it <serverId>.pem (you can easily use a webbrowser to obtain that file).
						// Make sure the .pem file contains the complete certificate chain to the root certifitace. You can easily concat them.
						// On linux, you can use the following command (replacing [hostname.domain] acordingly twice(!) and [serverId]:
						// echo "" | openssl s_client -connect [hostname.domain]:443 -servername [hostname.domain] -prexit 2>/dev/null | sed -n -e '/BEGIN\ CERTIFICATE/,/END\ CERTIFICATE/ p' >[serverId.pem]
						
						// The oaut2 URL before the /oaut2/ part, e.g. https://beoauth.piratenpartei-bayern.de/
						'oauth_url' => 'https://testid.televotia.ch/',

						// The ressources URL including the version part, e.g. https://beoauth.piratenpartei-bayern.de/api/v1/
						'ressources_url' => 'https://testid.televotia.ch/api/v1/', 
						                                                                       
						// this is used by the oAuth ressource for the sendmail_endp and determines which sender 
						// will be used for the mail
						'mail_identity' => 'voting',
						
						// wheather the mail should be signed by the oAuh2 ressource server
						'mail_sign_it' => true,
						
						// Subject and content of the mail to be send to the user who generated a voting certificate.
						// $electionId will be replaced by the electionId in subject and body
						'mail_content_subject' => 'Wahlschein erstellt',
						'mail_content_body' => 'Hallo!

Sie haben für die Abstimmung >$electionId< einen Wahlschein erstellt.
Falls dies nicht zutreffen sollte, wenden Sie sich bitte umgehend an einen Abstimmungsverantwortlichen.

Freundliche Grüße
Das Wahlteam' 
				) 
		),
		
		// In case you are using the "external token" method (cmrcx-Baisentscheid) for checking egibility, 
		// fill in the following section.
		'externalTokenConfig' => array (
				array (
						
						// Arbitrary and unique, must match VVVOTE_CONFIG_ID in the configuration of the
						// basisentscheid server.
						// This is used to identify this config. It is used in the newelection.php call to 
						// select this auth configuration.
						'configId' => 'basisentscheid_offen',
						
						// URL base which is used to check if the token is valid and the corresponding user is 
						// allowed to vote and to send the confirmation email after generating the voting 
						// certificate.
						'checkerUrl' => 'https://basisentscheid.piratenpartei-bayern.de/offen/',
						
						// Password needed to authorize the check token request.
						// It must match one of the VVVOTE_CHECK_TOKEN_PASSWORDS in the basisentscheid configuration.
						'verifierPassw' => 'mysecret',
						
						// This must be set to true as the external token auth security relies on SSL/TLS.
						// In order to do so:
						// Use the command php -f backend/admin/retrieve-tls-chains.php in order to retrieve
						// all certificate chains needed.
						// That will place the needed certificate and their's complete chain (just concated) 
						// in the directory 'tls-certificates' under the directory of this config file and 
						// name them [hostname.domain].pem (replacing "[hostname.domain]" with the target host.
						'verifyCertificate' => true 
				),
			) 
		// If you use the default dirs, nothing needs to be changed here.
		// It can be absolut (URL allowed) or relativ to api/v1/index.php 
		// defaults to '../../webclient/';
		// uncomment, if you need to change the default.
		// ,'webclientUrlbase' => '../../webclient/'
);
?>