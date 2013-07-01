<head>
<title>Administrate the voting permission server</title>
</head>
<body>
	<h1>Administrate the voting permission server</h1>
	<form action="">
		<input type="submit" , value="Create Tables" name="createTables">
		<br> 
		<input type="submit" , value="Import list of voters" name="importVoterList">
		<br> 
		<input type="submit" , value="Test: check credentials" name="checkCredentials">
		<br> 
		<input type="submit" , value="Delete database content" name="DeleteDatabaseContent">
		
	</form>

</body>

<?php
// TODO remove these lines before release
if ($_SERVER['HTTP_HOST'] == 'www.webhod.ra') { require_once 'conf-thisserver.php';}
else                                          { require_once 'conf-thisserver2.php';}

require_once 'db.php';

if ((isset($_GET['createTables' ])) || (isset($_POST['createTables' ]))) {
	$db = new Db(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PREFIX, DB_TYP, true);
	echo  "fertig. Database tables created";
}


if ((isset($_GET['importVoterList' ])) || (isset($_POST['importVoterList' ]))) {
	$electionId = 'wahl1';
	$voterlist = array(
			0 => array('electionId' => $electionId, 'voterId' => 'pakki'  , 'secret' => 'pakki'),
			1 => array('electionId' => $electionId, 'voterId' => 'melanie', 'secret' => 'melanie')
			);
	$db = new Db(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PREFIX, DB_TYP);
	$db->importVoterListFromArray($voterlist);

}

if ((isset($_GET['checkCredentials' ])) || (isset($_POST['checkCredentials' ]))) {
  $db = new Db(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PREFIX, DB_TYP);
  $ok = $db->checkCredentials('wahl1', 'pakkis', 'pakkis');
  print "<br>\n ok? ";
  print_r($ok);
}


if ((isset($_GET['DeleteDatabaseContent' ])) || (isset($_POST['DeleteDatabaseContent' ]))) {
	$db = new Db(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PREFIX, DB_TYP);
	$ok = $db->resetDb();
	print "<br>\n Deleted the content of the database";
}

// for database debugging use phpMyAdmin or the like

?>