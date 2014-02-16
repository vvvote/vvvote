/**
 * config
 * @returns {Array}
 */

var server1url = 'http://www.webhod.ra/vvvote2/backend/';
var server2url = 'http://www2.webhod.ra/vvvote2/backend/';

newElectionUrl    = new Array(server1url +'newelection.php',
		                      server2url +'newelection.php');
electionConfigUrl = server1url + 'getelectionconfig.php';
tallyUrl          = server1url + 'tallyvote.php'; //?XDEBUG_SESSION_START=ECLIPSE_DBGP&KEY=13727034088813';

// OAuth 2.0 configuration

oAuth2ConfigBEOBayern = {
		serverId: 'BEOBayern', // This is used in the backend to identify the oauth server
		serverDesc: 'Basisentscheid Online der Piraten (Bayrischer Testserver)',
		authorizeUri: 'https://beoauth.piratenpartei-bayern.de/oauth2/authorize/?', // must end with ?
		scope: 'member+profile',
		redirectUri: {
			0: 'https://abstimmung.piratenpartei-nrw.de/backend/modules-auth/oauth/callback.php',
			1: 'https://84.246.124.167/backend/modules-auth/oauth/callback.php'
		}, 
		clientId: {
			0: 'vvvote',
			1: 'vvvote2'
		}
};

oAuth2Config = {
		'BEOBayern': oAuth2ConfigBEOBayern
		};


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
	server0.url  = server1url + 'getpermission.php'; // 'getpermission.php?XDEBUG_SESSION_START=ECLIPSE_DBGP&KEY=13727034088813';
	key0.exp     = str2bigInt('65537', 10);  
	key0.exppriv = str2bigInt('1210848652924603682067059225216507591721623093360649636835216974832908320027478419932929', 10); //@TODO remove this bvefore release, only needed for debugging
	key0.n       = str2bigInt('3061314256875231521936149233971694238047219365778838596523218800777964389804878111717657', 10);
	key0.serverId = server0.name;
	server0.key = key0; 
	slist[0] = server0;
	
	server1.name = 'PermissionServer2';
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
