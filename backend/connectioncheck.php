<?php
/**
 * This is for connection checking from the client
 * It should be included by any php-file that is called from the client
 * as first required_once
 */

if (isset($_GET['connectioncheck'])) {
	print ("<!DOCTYPE html>\n<html>\n<head>\n<meta charset=\"ISO-8859-1\">");
	print ('<title>VVVote: Verbindungstest erfolreich</title>');
	print ('</head><body>');
	print ('<big><u>Verbindungstest erfolgreich.</u></big>'); 
    print ('<ul><li>Schlie&szlig;en Sie jetzt dieses Fenster und </li>');
    print ('    <li>klicken Sie in dem urspr&uuml;nglichen Fenster innerhalb des roten Balkens auf den Knopf &quot;erneut versuchen&quot;</li></ul>');
//    print ('<button onlick="window.close();">Fenster schlie&szlig;en</button>');
	print ('</body>');
	exit(0);
}

?>