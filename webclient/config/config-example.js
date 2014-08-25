/**
 * config
 * @returns {Array}
 */

var server1url = 'http://www.webhod.ra/vvvote2/backend/';
var server2url = 'http://127.0.0.1/vvvote2/backend/';

var server1urlParts = URI.getParts(server1url);

function ClientConfig() {
	 
}


ClientConfig.newElectionUrl    = new Array(	server1url +'newelection.php',
											server2url +'newelection.php');
ClientConfig.electionConfigUrl = server1url + 'getelectionconfig.php';
ClientConfig.storeVoteUrl      = 'http://' + server1urlParts.host + server1urlParts.pathname + 'storevote.php'; //do not use https here to enable the anonymizer-server to strip the browser-fingerprint - this is not necessary if all voters would use the tor browser bundle
ClientConfig.getResultUrl      = server1url + 'getresult.php'; //?XDEBUG_SESSION_START=ECLIPSE_DBGP&KEY=13727034088813';


ClientConfig.serverList = getPermissionServerList();
ClientConfig.anonymizerUrl = ''; // http://anonymouse.org/cgi-bin/anon-www_de.cgi/'; // used to change the ip and to strip browser infos / with trailing slash
ClientConfig.voteClientUrl = server1url + 'getclient.php';

function getPermissionServerList() {
	// load config
	random = true;
	base = 16; // basis used to encode/decode bigInts
	var slist  = new Array();
	var server0 = new Object();
	var server1 = new Object();
	var key0    = new Object();
	var key1    = new Object();
	server0.name = 'PermissionServer1';
	server0.desc = 'Abstimmserver';
	server0.url  = server1url + 'getpermission.php'; // 'getpermission.php?XDEBUG_SESSION_START=ECLIPSE_DBGP&KEY=13727034088813';
	key0.exp     = str2bigInt('65537', 10);  
	key0.exppriv = str2bigInt('1210848652924603682067059225216507591721623093360649636835216974832908320027478419932929', 10); //@TODO remove this bvefore release, only needed for debugging
	key0.n       = str2bigInt('3061314256875231521936149233971694238047219365778838596523218800777964389804878111717657', 10);
	key0.serverId = server0.name;
	server0.key = key0; 
	slist[0] = server0;
	
	server1.name = 'PermissionServer2';
	server1.desc = 'Kontrollserver';
	server1.url = server2url + 'getpermission.php';
	key1.exp     = str2bigInt('65537', 10);  
	key1.exppriv = str2bigInt('1210848652924603682067059225216507591721623093360649636835216974832908320027478419932929', 10); //@TODO remove this bvefore release, only needed for debugging
	key1.n       = str2bigInt('3061314256875231521936149233971694238047219365778838596523218800777964389804878111717657', 10);
	key1.serverId = server1.name;
	server1.key = key1;
	slist[1] = server1;
	// TODO: add config which server has to verify and to sign how many ballots
	
    return slist;	
};


// configs for OAuth 2.0 Servers
var redirectUriTMP = [];
redirectUriTMP[ClientConfig.serverList[0].name] = 'http%3a//www.webhod.ra/vvvote2/backend/modules-auth/oauth/callback.php';
redirectUriTMP[ClientConfig.serverList[1].name] = 'http%3a//www2.webhod.ra/vvvote2/backend/modules-auth/oauth/callback.php'; //https://84.246.124.167/backend//modules-auth/oauth/callback.php

var clientIdTMP = [];
clientIdTMP[ClientConfig.serverList[0].name] = 'vvvote';
clientIdTMP[ClientConfig.serverList[1].name] = 'vvvote2';


var oAuth2ConfigBEOBayern = {
		serverId: 		'BEOBayern', // This is used in the backend to identify the oauth server
		serverDesc: 	'Basisentscheid Online der Piraten (Bayerischer Testserver)',
		authorizeUri: 	'https://beoauth.piratenpartei-bayern.de/oauth2/authorize/?', // must end with ?
		loginUri:		'https://beoauth.piratenpartei-bayern.de/',
		scope: 			'member+profile',
		redirectUri: 	redirectUriTMP,
		clientId: 		clientIdTMP
};

ClientConfig.oAuth2Config = {
			'BEOBayern': oAuth2ConfigBEOBayern
			};

ClientConfig.getServerInfoByName = function (servername) {
	var slist = ClientConfig.serverList;
	for (var s=0; s<slist.length; s++) {
		if (slist[s].name == servername) return slist[s]; 
	}
};

