What you need
=============
You need:

* 2 webservers (e.g. apache or ngnix / lighthttp v 1.4 can cause problems: it does not support the http-header "Expect: 100-continue-header" which cURL uses. --> no problem if you are not integrating vvvote into a system which automatically creates new elections and send them to vvvote using cURL below is also a work-around provided)
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
 * adjust 'oauthConfig': You must adjust 'client_ids', 'client_secret', 'redirect_uris', 'oauth_url' and 'ressources_url'
 * adjust the 'externalTokenConfig'. You must adjust: 'configId', 'checkerUrl' and 'verifierPassw'. 
For details see the comments in the config-example.php

If you want, you can move the complete config folder anywhere you like.
In order to do so, set the environment variable 'VVVOTE_CONFIG_DIR' to point to the directory you moved the config to.
In Apache, you can do this by adding the following line in the virtual host configuration:

	SetEnv VVVOTE_CONFIG_DIR "/etc/vvvote/config"

When everything works __do not forget__ to set 'debug' to false in order to make sure that no sensitive data is sended to the clients.

## Generate and Distribute Server Keys
Each server uses its own voting key. Therefore we need to generate a key on each server and distribute their public part to the other server.

### Generate Server Keys
Server 1 will act as permission server and as tallying server. We are using different keys for each role. That is why on server 1 we will create two keys. 
On server 1 cd into the backend-dir and start the key generation (it can take a minute or two):

	cd backend/admin
	php -f admin.php createKeypair p 1
	php -f admin.php createKeypair t 1

The first line creates the key pair for the permission server, the second line creates the key pair for the role as tallying server.

Server 2 acts also acts as permission and tallying server. That is why create another two key pairs.
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
Vvvote servers needs to communicate with one another. That's why they need the complete certificate chain of the other vvvote servers. Furthermore the certifications chains of the authorisation servers (if any) are needed. There is a script doing this automatically:

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

Customisation
=============
Use your own logo
-----------------
Resize your organisation's logo to 47x51 points. You can easily do so using the free software inkscape. 
Place the logo of your organisation in 'backend/config/logo\_brand\_47x51.svg' (resp. the config dir). 
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

