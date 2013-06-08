<!DOCTYPE html>
<html>
<head>
<title>Online Election / Wahl</title>
	<script src="BigInt.js"></script>
	<script src="rsa.js"></script>
	<script src="sha256.js"></script>
	<script src="election.js"></script>
</head>
<body>
	<!-- <script type="text/javascript">  -->
	<br>
	<form name=permission action="getPermission" method="get">

		This page demonstrates a JavaScript library for secure online election
		<center>
			<br>
			<table border=2 cellspacing=0 cellpadding=0>
				<tr>
					<td>
						<table bgColor="lightgray" border=0 cellspacing=0 cellpadding=1>
							<tr>
								<td>&nbsp;</td>
								<td align=right><font color=black> <b>ElectionId:</b>
								</font></td>
								<td><input name=electionId value="wahl1"></td>
								<td>&nbsp;</td>
							</tr>
							<tr>
								<td>&nbsp;</td>
								<td align=right><font color=black> <b>VoterId:</b>
								</font></td>
								<td><input name=voterId value="pakki"></td>
								<td>&nbsp;</td>
							</tr>
							<tr>
								<td>&nbsp;</td>
								<td>&nbsp;
								<input type="hidden" name=json value="">
								</td>
								<td><input type="submit" name=reqPermiss value="Request ballot"   
								    onclick="
									var voterID    = document.permission.voterId.value;
								    var electionID = document.permission.electionId.value;
								    var numVotingSheets = 2;
								    alert('voterID: '    + voterID +
										  'electionID: ' + electionID);
								    var pServerList = getPermissionServerList();
								    
									var req = makePermissionReq(voterID, electionID, numVotingSheets, pServerList);
									alert('req: ' + req);
									document.permission.json.value = req;
									return true;
									"
								>
								</td>
								<td>&nbsp;</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>
		</center>
	</form>

</body>
</html>
<?php

?>