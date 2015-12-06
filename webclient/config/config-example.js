/**
 * config
 * Normally there is no need to change anything here, except: If you are using OAuth2: the config for the authorization verification process.
 * 
 * The server URLs and keys are automatically included by calling backend/getserverinfos.php?js (result in serverinfos)
 * OR are included in the complete .html file which has the backend/getserverinfos.php integrated
 * 
 */

function ClientConfig() { }

ClientConfig.serverList     = new Array();
ClientConfig.newElectionUrl = new Array();
for (var i=0; i<serverinfos.pServerUrlBases.length; i++) {
	if (serverinfos.keys[i].kty !== 'RSA') alert('Error in server infos: only RSA is a supported by this client');
	ClientConfig.serverList[i] = {
			'name':    serverinfos.keys[i].kid,
			'desc':    (i === 0 ? 'Abstimmserver' : 'Kontrollserver ' + i),
			'url' :    serverinfos.pServerUrlBases[i] + '/getpermission.php', // 'getpermission.php?XDEBUG_SESSION_START=ECLIPSE_DBGP&KEY=13727034088813';
			'baseUrl': serverinfos.pServerUrlBases[i],
			'key': {
				'exp':      str2bigInt(serverinfos.keys[i].e, -64), // str2bigInt('65537', 10),  
				//'exppriv':  str2bigInt('1210848652924603682067059225216507591721623093360649636835216974832908320027478419932929', 10), //TODO remove this bvefore release, only needed for debugging
				'n':        str2bigInt(serverinfos.keys[i].n, -64), //str2bigInt('3061314256875231521936149233971694238047219365778838596523218800777964389804878111717657', 10),
				'serverId': serverinfos.keys[i].kid
			},
		};
	ClientConfig.newElectionUrl[i] = serverinfos.pServerUrlBases[i] + '/newelection.php';
}

server1url = ClientConfig.serverList[0].baseUrl + '/';
var server1urlParts = URI.getParts(server1url);
server2url = ClientConfig.serverList[1].baseUrl + '/';

//ClientConfig.newElectionUrl    = new Array(	server1url +'newelection.php', server2url +'newelection.php');
ClientConfig.electionConfigUrl = server1url + 'getelectionconfig.php';
ClientConfig.storeVoteUrl      = 'http://' + server1urlParts.hostname +'/' + server1urlParts.pathname + 'storevote.php'; //do not use https here to enable the anonymizer-server to strip the browser-fingerprint - this is not necessary if all voters would use the tor browser bundle
ClientConfig.getResultUrl      = server1url + 'getresult.php'; //?XDEBUG_SESSION_START=ECLIPSE_DBGP&KEY=13727034088813';


ClientConfig.anonymizerUrl = 'http://anonymouse.org/cgi-bin/anon-www_de.cgi/'; // used to change the ip and to strip browser infos / with trailing slash
ClientConfig.voteClientUrl = server1url + 'getclient.php';



//configs for OAuth 2.0 Servers
var redirectUriTMP = [];
redirectUriTMP[ClientConfig.serverList[0].name] = server1url + 'modules-auth/oauth/callback.php';
redirectUriTMP[ClientConfig.serverList[1].name] = server2url + 'modules-auth/oauth/callback.php'; //https://84.246.124.167/backend//modules-auth/oauth/callback.php

var clientIdTMP = [];
clientIdTMP[ClientConfig.serverList[0].name] = 'vvvote';
clientIdTMP[ClientConfig.serverList[1].name] = 'vvvote2';


var oAuth2ConfigBEOBayern = {
		serverId: 		'BEOBayern', // This is used in the backend to identify the oauth server
		serverDesc: 	'Basisentscheid Online der Piraten (Bayerischer Testserver)',
		authorizeUri: 	'https://beoauth.piratenpartei-bayern.de/oauth2/authorize/?', // must end with ?
		loginUri:		'https://beoauth.piratenpartei-bayern.de/',
		scope: 			'member profile unique mail',
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

ClientConfig.BlindedVoter = {
		'numCreateBallots': 5,	
		'shuffleServerSeq': false,
		'serverList':       ClientConfig.serverList
		// TODO: add config which server has to verify and to sign how many ballots
};

base = 16; // this global is used by rsa.js