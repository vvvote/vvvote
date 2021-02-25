What you need
=============
You need:

* 2 webservers (e.g. apache [preferred] or ngnix / lighthttp v 1.4 can cause problems: it does not support the http-header "Expect: 100-continue-header" which cURL uses. --> no problem if you are not integrating vvvote into a system which automatically creates new elections and send them to vvvote using cURL below is also a work-around provided)
* a mysql server on each server
* php version 5.3 at least, and the following php extentions (all of them are automatically included in most distributions, but if you want to compile yourself, you need to know):
 * pdo-mysql
 * gmp or bcmath, where gmp is recommended (bcmath works but the cryptographic calculations are about 15-200 times faster if you have the gmp extention installed)
 * curl (for oAuth2 and externalTokenAuth)
 * openssl (for easy setup of the tls certification chain) 

Download vvvote
===============
On each server, downlaod vvvvote in your home dir, e.g. by executing the following command

	cd ~ # cd into your home dir
	git clone https://github.com/vvvote/vvvote.git
 
copy the public and the backend directory to your webserver dir, e.g.:

	cd vvvote
	mkdir /var/www/vvvote
	cp -r backend /var/www/vvvote
	cp -r public /var/www/vvvote
 
Configure the Server
====================

On all servers, in directory backend/config, copy the example configs, eg:

	cp config-example.php config.php
	
Edit the config.php on both servers:
* Adjust 'pServerUrlBases' to point to the first and second server's http-backend-directories (in this order!)
* adjust 'serverNo' (to 1 for the first and to 2 for the second server)
* adjust 'dbinfos' 
* depending on which authorisation mechanism you want to use 
 * adjust 'oauthConfig': You must adjust 'type', 'client_ids', 'client_secret', 'redirect_uris', 'oauth_url' and 'ressources_url'. 
	In case you are using keycloak as oAuth2 server, additionally edit 'notify_client_id', 'notify_client_secret', 'notify_url'
 * adjust the 'externalTokenConfig'. You must adjust: 'configId', 'checkerUrl' and 'verifierPassw'. 
For details see the comments in the config-example.php

If you want, you can move the complete config folder anywhere you like.
In order to do so, set the environment variable 'VVVOTE_CONFIG_DIR' to point to the directory you moved the config to.
In Apache, you can do this by adding the following line in the virtual host configuration:

	SetEnv VVVOTE_CONFIG_DIR "/etc/vvvote/config"

## Generate and Distribute Server Keys
Each server uses its own voting key. Therefore we need to generate a key on each server and distribute their public part to the other server.

### Generate Server Keys
Server 1 will act as permission server and as tallying server. We are using different keys for each role. That is why on server 1 we will create two keys. 
On server 1 cd into the backend-dir and start the key generation (it can take a minute or two):

	cd backend/admin
	php -f admin.php createKeypair p 1
	php -f admin.php createKeypair t 1

The first line creates the key pair for the permission server, the second line creates the key pair for the role as tallying server.

Server 2 acts also acts as permission and tallying server. That is why we create another two key pairs.
On server 2 also cd into the backend-dir and also start the key generation for the permission server by

	cd backend/admin
	php -f admin.php createKeypair p 2
	php -f admin.php createKeypair t 2


### Distribute Server Keys
On server 1:

This generates four files:

	backend/config/voting-keys/PermissionServer1.privatekey.pem.php
	backend/config/voting-keys/PermissionServer1.publickey.pem
	backend/config/voting-keys/TallyServer1.privatekey.pem.php
	backend/config/voting-keys/TallyServer1.publickey.pem
Copy (somehow) the "backend/config/voting-keys/PermissionServer1.publickey.pem" and 
"backend/config/voting-keys/TallyServer1.publickey.pem" to server 2 into the same directory. These key files 
are public - you can email them unencrypted.

On Server 2:

Copy (somehow) the "backend/config/voting-keys/PermissionServer2.publickey.pem" and 
"backend/config/voting-keys/TallyServer2.publickey.pem" to server 1 into the same directory. 
These key files are public - you can email them unencrypted.

## Privacy Statements
Replace the dummy privacy statements in the config folder with correct ones from your organisation. It is 
localised - so you can add statements in the languages you need, the webclient will automatically show 
the one that matches the selected language. If no matching language file is found, the en_US variant will 
be shown. The localisation code must match the code used in getclient.php and in the 
vvvote\backend\webclient-sources\i18n.
The .txt files must be utf8-encoded.


## Configure Keycloak and Vvvote
You can use the Keycloak server in order to authenticate voters. Install the Keycloak server according to their
manual.
For configuring Vvvote, copy or modify the example oauth2config for keycloak contained in the config-example.php.
Then:
1. In the Keycloak admin web console, select "clients", click "create" and "select file". 
2. Select "vvvote_keycloak_config_1_example.json" in the "doc" dir of vvvote.
3. Set "Client ID" to the value you provide in oauth2config in first place of the the array "client_ids".
4. "Client Protocol" must stay at "openid-connect". 
5. Set the "Root URL" so that it points to where /api/... can be appended to reach the vvvote-api.
6. click on "save".
7. Click on the tab "Credentials" and copy the content of the "Secret" field to the vvvote oauth2config in the 
field "client_secret".
8. Select the tab "Mappers", click on "sub-protocol-mapper" and make sure that a salt is set. Otherwise, users which try to login during voting, will get a 500 internal server error from the Keycloak server when the technical information is shown.

For the second vvvote server do the same but 
1. select the file "vvvote_keycloak_config_2_example.json" and 
2. in the Keycloak admin web console set the "Client ID" to the value you provide in the second place of the array "client_ids" in the vvvote oauth2 config.

### What are the differences between the two Keycloak config files for Vvvote?
The two Vvvote Keycloak config files are mostly the same but differ in the login setting: The first config is set 
so that the user will always be required to provide login credentials (even when the session is still active)
in order to make sure that only people who have access to the credentials can create a voting certificate (Wahlschein).
The second config is set to never ask for credentials - just for convinience: do not require the user to enter
the credentials twice. 

## Configure Vvvote for Notification Server
Vvvote can use a notification server to send an information to the user that a voting certificate 
(Wahlschein) was generated using his account. The https://github.com/edemocracy/ekklesia-notify is 
used for this purpose. Set the values "notify_client_id", "notify_client_secret", and "notify_url" 
according to the account on the notification server. The notify_url must end with '/freeform_message'.



Configure the webclient
=======================

in directory webclient/config, copy the example config to config.js, e.g. by

	 cd backend/webclient-sources/config
	 cp config-example.js config.js

If do not have very special needs (e.g. changing the anonymizer service URL), nothing needs to be changed in this config. The client automatically incorperates the config from the server.


Configure the web server
========================
Configure your webserver to use the 'public' dir as document root. This way it is made sure that the backend/config cannot be accessed from the web, even if a misconfiguration or a bug leads to serving php files instead of executing them.
e.g. for Apache:
	
	DocumentRoot "/var/www/vvvote/public"
	
e.g. for Ngnix in the "server {"-section:

	root /var/www/vvvote/public;
	index index.php index.html;

Vvote relies on the webserver's ability to rewrite the URI.
For Apache, the needed .htaccess file is included, so you do not need to configure anything exempt allowing/enabling the rewrite engine.
On some apache servers, you will have to tell which URL correspondes to this folder in the filesystem in order to make URL rewriting work. 
You can do it by the following command (if you are serving vvvote from /):

	cd public
	echo "RewriteBase /" >.htaccess

Additional, rewritig requires that FollowSymlinks is allowed. Usually it is allowed. Anyway, you can set this for Apache by:

	<Directory "/var/www/vvvote/public">
		AllowOverride All
	</Directory>
	
For ngnix you can use the following configuration example:

	location /vvvote/ { 
		try_files  $uri $uri/
		if (!-e $request_filename){ 
			rewrite ^/vvvote/api/v([0-9.]*)/(.*)$ /vvvote/api/v$1/index.php/$2; 
		} 
	}
Adjust the three occurances of 'vvvote/' to your needs. If you are serving vvvote from /, just delete 'vvote/'.


Configure TLS / SSL 
===================
If you are running / forcing the clients to connect via https (TLS) which is recommended, you must 
(1) place the complete certificate chain of all other servers in config/tls-certificates and
(2) exempt backend/storevote.php from forcing to https.

(1) Place the Complete Certificate Chain of all other Servers in config/tls-certificates
----------------------------------------------------------------------------------------
Vvvote servers needs to communicate with one another. That's why they need the complete certificate chain of the other vvvote servers. Furthermore the certifications chains of the authorisation and notify servers (if any) are needed. There is a script doing this automatically:

	cd backend/admin
	php -f retrieve-tls-chains.php

You could also do this manually: Place the chain into the folder backend/config/tls-certificates. Put the complete chain in 1 file for each server. Name the file [hostname.domain].pem, replacing [hostname.domain] with the full domain name of the target host:

	# obtain the complete certificate chain
	cd backend/config/tls-certificates
	host=[hostname.domain]
	echo "" | openssl s_client -connect $host:443 -servername $host -prexit 2>/dev/null | sed -n -e '/BEGIN\ CERTIFICATE/,/END\ CERTIFICATE/ p' >$host.pem

Replace [hostname.domain] with the complete dns name of the according server. Repeat this for all vvvote servers and all needed authorisation servers (externalToken and oAuth servers).
The last line of code retrieves the certification chain. You can also download and export them from your favorite web browser and save it to the required location. 

 
(2) Exempt backend/storevote.php from Forcing to https
------------------------------------------------------
Vvvote automatically redirects to https (if the server's URL start with 'https'). So, you do not need to set up the redirection in the server's config. The 'store vote' command is automatically exempted. 

Thats It!
=========
point your browser to 
$yourBaseUrl/


Important
=========
If everything works, set "debug" to false in the configs to make sure that no confidential data will be send to the users.


Customisation
=============
Use your own logo
-----------------
Resize your organisation's logo to 47x51 points. You can easily do so using the free software inkscape. 
Place the logo of your organisation in 'backend/config/logo\_brand\_47x51.svg' (resp. your config dir). 
Recreate the index2.html file afterwards (see chapter 'Speed Optimisation').

Change 'linkToHostingOrganisation' in config.php to link to your organisation on a click on the logo.


Speed Optimisation
==================
The webclient consists of several files. You can speed up page loading by putting these files together:

	cd backend
	php -f getclient.php >index2.html
	cp index.html ../public/webclient/index2.html

In /public/webclient/ there is an 'index.php' which will cause an automatic redirect from http to https 
and to 'index2.html', if available. In case that there is no 'index2.html' file, it will call 
api/v1/getclient on each request. 

The webclient will then consist of only one html file. This file contains the server URLs and their public 
keys. This means, you need to redo the above stated command if a __server config or a public key has changed__.
This index2.html can be served from everywhere since it already contains all necessary configuration.

You can publish a fingerprint of this file in order to allow your voters to verify that they __got an unchanged web client__. The command

	 sha256sum index2.html

will give you the SHA256 checksum of the client, including the server public keys which you can publish. We recommend to do this only if you put the client into one file since only then the server's public key will be contained in the index2.html.


Get Up To Date
==============

In order to get the newest version of vvvote, you can use the following commands (if your directory layout is set up the way it is used in the examples above): 

	cd ~
	cd vvvote
	git pull
	cp -r backend /var/www/vvvote # use the directory your http server uses for serving the requests
	cp -r public /var/www/vvvote # use the directory your http server uses for serving the requests
	cd /var/www/vvvote/backend # use the directory your http server uses for serving the requests
	php -f getclient.php >index2.html
	cp index2.html ../public/webclient/


Prepair the MySQL Servers
=========================

on the command line:

	mysql -u root -p

You will be ask for the password of the user root to the mysql database (if that is set).

In the mysql shell (on server 1):

	CREATE database election_server1;
	CREATE USER 'vvvote1'@'localhost' IDENTIFIED BY 'new_secret1';
	GRANT ALL PRIVILEGES ON election_server1.* TO 'vvvote1'@'localhost';
	FLUSH PRIVILEGES;

and the same on server 2:

	CREATE database election_server2;
	CREATE USER 'vvvote2'@'localhost' IDENTIFIED BY 'new_secret2';
	GRANT ALL PRIVILEGES ON election_server2.* TO 'vvvote2'@'localhost';
	FLUSH PRIVILEGES;

verify:

	SELECT host, user, password FROM mysql.user;
	show databases;

delete all data (__do not do that!__):

	drop database election_server1;
	drop database election_server2;
	
Notes
=====
lighthttpd
----------
If you are using lighthttpd version 1.4, you might expiriencing "417 - Expectation Failed" error when you try to create a new election on vvvote. This is usually caused when you use curl to send the POST request.
The problem is that lighthttpd does not support the http-header "Expect: 100 continue" which curl makes use of.
You can work around the problem of lighthttpd v1.4 does not support the http-header "Expect: 100 continue" by the following config line in the lighthttp-config:

	server.reject-expect-100-with-417 = "disable"

