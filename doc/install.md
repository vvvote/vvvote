What you need
=============
You need:

* 2 webservers (e.g. apache oder ngnix /lighthttp v 1.4 can cause problems: it does not support the http-header "Expect: 100-continue-header" which cURL uses. --> no problem if you are not integrating vvvote into a system which automatically creates new elections and send them to vvvote using cURL)
* a mysql server on each server
* php version 5.3 at least, and the php extentions (all of the following are automatically included in most distributions, but if you want to compile yourself, you need to know):
 * pdo-mysql
 * gmp or bcmath, where gmp is recommended (bcmath works but the cryptographic calculations are about 15-200 times faster if you have the gmp extention installed)
 * curl (for oAuth2 and externalTokenAuth) 

Download vvvote
===============
On each server, downlaod vvvvote in your home dir, e.g. by executing the following command

	cd ~ # cd into your home dir
	git clone https://github.com/pfefffer/vvvote.git
 
copy the webclient and the backend directory to your webserver dir, e.g.:

	cd vvvote
	cp -r backend /var/www/vvvote
	cp -r webclient /var/www/vvvote
 
Configure the Server
====================

On each server, in directory backend/config:

	copy conf-allservers-example.php to conf-allservers.php
	copy conf-thisserver-example.php to conf-thisserver.php
	copy conf-thisserver-example2.php to conf-thisserver2.php

in both conf-thisserver files:

* adjust $dbinfos 
* depending on which auth mechanism you want to use
 * adjust $oauthBayern 'client_id', 'client_secret', 'redirect_uri'
 * adjust the externalTokenConfig


in 'conf-allservers.php' adjust

* $configUrlBase to point to the server's own http-backend-directory


Configure the webclient
=======================

in directory webclient/config

	copy config-example.js to config.js

adjust:

* server1url
* server2url

Thats It!
=========
point your browser to 
$yourBaseUrl/webclient/


-----------------

Get Up To Date
==============

In order to get the newest version of vvvote, you can use the following commands (if your directory layout is set up the way it is used in the examples above): 

	cd ~
	cd vvvote
	git pull
	cp -r backend /var/www/vvvote # use the directory your http server uses for serving the requests
	cp -r webclient /var/www/vvvote # use the directory your http server uses for serving the requests


Prepair the MySQL Servers
=========================

on the command line:

	mysql -u root -p

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

	drop database election_server2;
	drop database election_server1;
	
Notes
=====	
If you are running / forcing the clients to connect via https (TLS) which is recommended, you should exempt backend/storevote.php from forcing to https. 
You should do this because this enables the anonymizing service to strip off the browser's request header which is important for anonymization.
The apache .htaccess might then look like:

	RewriteEngine On
	RewriteCond %{REQUEST_FILENAME} !backend/storevote.php$
	RewriteCond %{HTTPS} off
	RewriteRule  ^(.*)$  https://%{HTTP_HOST}/$1   [R=301,L] 