/**
 * config
 * @returns {Array}
 */

newElectionUrl = 'http://www.webhod.ra/vvvote2/backend/newelection.php'; // TODO mehrere? 

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
	server0.url  = 'http://www.webhod.ra/vvvote2/backend/getpermission.php'; // 'getpermission.php?XDEBUG_SESSION_START=ECLIPSE_DBGP&KEY=13727034088813';
	key0.exp     = str2bigInt('65537', 10);  
	key0.exppriv = str2bigInt('1210848652924603682067059225216507591721623093360649636835216974832908320027478419932929', 10); //@TODO remove this bvefore release, only needed for debugging
	key0.n       = str2bigInt('3061314256875231521936149233971694238047219365778838596523218800777964389804878111717657', 10);
	key0.serverId = server0.name;
	server0.key = key0; 
	slist[0] = server0;
	
	server1.name = 'PermissionServer2';
	server1.url = 'http://www2.webhod.ra/vvvote2/backend/getpermission.php';
	key1.exp     = str2bigInt('65537', 10);  
	key1.exppriv = str2bigInt('1210848652924603682067059225216507591721623093360649636835216974832908320027478419932929', 10); //@TODO remove this bvefore release, only needed for debugging
	key1.n       = str2bigInt('3061314256875231521936149233971694238047219365778838596523218800777964389804878111717657', 10);
	key1.serverId = server1.name;
	server1.key = key1;
	slist[1] = server1;
	// TODO: add config which server has to verify and to sign how many ballots
	
    return slist;	
};
