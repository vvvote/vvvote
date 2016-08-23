What you need
=============
You need:

* 2 webservers (e.g. apache or ngnix / lighthttp v 1.4 can cause problems: it does not support the http-header "Expect: 100-continue-header" which cURL uses. --> no problem if you are not integrating vvvote into a system which automatically creates new elections and send them to vvvote using cURL below is also a work-around provided)
* a mysql server on each server
* php version 5.3 at least, and the following php extentions (all of them are automatically included in most distributions, but if you want to compile yourself, you need to know):
 * pdo-mysql
 * gmp or bcmath, where gmp is recommended (bcmath works but the cryptographic calculations are about 15-200 times faster if you have the gmp extention installed)
 * curl (for oAuth2 and externalTokenAuth) 

Download vvvote
===============
On each server, downlaod vvvvote in your home dir, e.g. by executing the following command

	cd ~ # cd into your home dir
	git clone https://github.com/vvvote/vvvote.git
 
copy the webclient and the backend directory to your webserver dir, e.g.:

	cd vvvote
	mkdir /var/www/vvvote
	cp -r backend /var/www/vvvote
	cp -r webclient /var/www/vvvote
 
Configure the Server
====================

On server 1, in directory backend/config, copy the example configs, eg:

	cp conf-allservers-example.php conf-allservers.php
	cp conf-thisserver-example.php conf-thisserver.php
	
On server 2, in directory backend/config, copy the example configs, eg:

	cp conf-allservers-example.php conf-allservers.php
	cp conf-thisserver-example2.php conf-thisserver.php

in both conf-thisserver files:

* adjust $dbinfos 
* depending on which auth mechanism you want to use
 * adjust $oauthBayern 'client_id', 'client_secret', 'redirect_uri'
 * adjust the externalTokenConfig


in 'conf-allservers.php' adjust

* $pServerUrlBases to point to the first and second server's http-backend-directories (in this order!)

## Generate and Distribute Server Keys
Each server uses its own key. Therefore we need to generate a key on each server and distribute thier public part to the other server.

### Generate Server Keys
Server 1 will act as permission server and as tallying server. We are using different keys for each role. That is why on server 1 we will create two kes. 
On server 1 cd into the backend-dir and start the key generation (it can take a minute or two):

	php -f admin.php createKeypair p 1
	php -f admin.php createKeypair t 1

The first line creates the key pair for the permission server, the second line creates the key pair for the role as tallying server.

Server 2 acts as permission server only. That is why we do not need to create a key pair for the tallying server role.
On server 2 also cd into the backend-dir and also start the key generation for the permission server by

	php -f admin.php createKeypair p 2


### Distribute Server Keys
On server 1:

This generates four files:

	backend/config/PermissionServer1.privatekey.pem.php
	backend/config/PermissionServer1.publickey
	backend/config/TallyServer1.privatekey.pem.php
	backend/config/TallyServer1.publickey
Copy (somehow) the "backend/config/PermissionServer1.publickey" and backend/config/TallyServer1.publickey to server 2 into the same directory. These key files are public - you can email them unencrypted.

On Server 2:

Copy (somehow) the "backend/config/PermissionServer2.publickey" to server 1 into the same directory. This key file is public - you can email it unencrypted.



Configure the webclient
=======================

in directory webclient/config, copy the example config to config.js, e.g. by

	cp config-example.js config.js

If do not have special needs, nothings needs to be changed in this config.

Thats It!
=========
point your browser to 
$yourBaseUrl/webclient/


Speed Optimization
==================
The webclient consists of several files. You can speed up page loading by putting these together:

	cd backend
	php -f getclient.php >index.html
	cp index.html ../webclient/

By copying the newly created backend/index.html to webclient/index.html the already existing index.html in webclient will be overwritten.

The webclient will then consist of only one html file. This file contains the server URLs and their public keys. This means, you need to redo the above stated command if a __server URL or a public key has changed__.
This index.html can be served from everywhere since it already contains all necessary configuration.

You can publish a fingerprint of this file in order to allow your voters to verify that they __got an unchanged web client__. The command

	 sha256sum index.html

will give you the SHA256 checksum of the client, including the server public keys which you can publish. We recommend to do this only if you put the client into one file since only then the server's public key will be contained in the index.html.


Get Up To Date
==============

In order to get the newest version of vvvote, you can use the following commands (if your directory layout is set up the way it is used in the examples above): 

	cd ~
	cd vvvote
	git pull
	cp -r backend /var/www/vvvote # use the directory your http server uses for serving the requests
	cp -r webclient /var/www/vvvote # use the directory your http server uses for serving the requests
	cd /var/www/vvvote/backend # use the directory your http server uses for serving the requests
	php -f getclient.php >index.html
	cp index.html ../webclient/


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
TLS / SSL 
---------
If you are running / forcing the clients to connect via https (TLS) which is recommended, you should exempt backend/storevote.php from forcing to https. 
You should do this because this enables the anonymizing service to strip off the browser's request header which is important for anonymization.

### Apache
The apache .htaccess might then look like:

	RewriteEngine On
	RewriteCond %{REQUEST_FILENAME} !backend/storevote.php$
	RewriteCond %{HTTPS} off
	RewriteRule  ^(.*)$  https://%{HTTP_HOST}/$1   [R=301,L]

### Ngnix
(in reverse proxy mode)

	server {
    	listen 80;  
	    server_name my.vvvote.url;
    	
    	location backend/storevote.php { 
    	    proxy_set_header Host $host:$server_port;
    	    proxy_pass  http://http_vvvote_backend;
    		}
    
    location / {
        return  301 https://my.vvvote.url$request_uri;
    	}
	}

Do not forget to replace "my.vvvote.url" with the dns name of your server in both occurances.

### lighthttpd
In the site config add the following lines:

	    # Redirect to https
        $HTTP["scheme"] != "https" {
                $HTTP["url"] !~ "^/backend/storevote.php$" {
                        # Moved Permanently
                        url.redirect-code = 301
                        url.redirect = ( "^/(.*)" => "https://vvvote.my.url/$1" )
                }
        }
Replace "vvvote.my.url" by the dns-host name of our vvvote installation.


lighthttpd
----------
If you are using lighthttpd version 1.4 you might expiriencing "417 - Expectation Failed" error when you try to create a new election on vvvote. This is usually caused when you use curl to send the POST request.
The problem is that lighthttpd does not support the http-header "Expect: 100 continue" which curl makes use of.
You can work around the problem of lighthttpd v1.4 does not support the http-header "Expect: 100 continue" by the following config line in the lighthttp-config:

	server.reject-expect-100-with-417 = "disable"