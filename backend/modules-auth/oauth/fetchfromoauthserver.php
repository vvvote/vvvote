<?php

/**
 * return 404 if called directly
 *  // added by Pfeffer
 */
if(count(get_included_files()) < 2) {
	header('HTTP/1.0 404 Not Found');
	echo "<h1>404 Not Found</h1>";
	echo "The page that you have requested could not be found.";
	exit;
}

chdir(__DIR__);
require_once './client.php';

class FetchFromOAuth2Server {

	function __construct($serverId, $authInfos) {
		//$this->serverId = $serverId;
		//$this->authInfos = $authInfos;
		global $oauthConfig;
		if (! array_key_exists($serverId, $oauthConfig)) WrongRequestException::throwException(128754786, 'Config mismatch: The requested oauth2 server id is not configured in this vvvote server', "requested server id: >$serverId<");
		$this->curOAuth2Config =  $oauthConfig[$serverId];
		$this->client = new nsOAuth2\Client($this->curOAuth2Config['client_id'], $this->curOAuth2Config['client_secret']);
		$this->client->setAccessToken($authInfos);
		// $this->params = array('redirect_uri' => $curOAuth2Config['redirect_uri']); // $params = array('code' => $_GET['code'], 'redirect_uri' => $curOAuth2Config['redirect_uri']);
	}
/** not needed anymore
	function fetchUsername() {
		$userprofile = $this->fetchUserProfile();
		if ($userprofile === false) return false;
		return $userprofile['username'];
	}

	function fetchUserProilfe() {
		$userprofile = $this->fetch($this->curOAuth2Config['get_profile_endp']);
		if ($userprofile['code'] != 200) return false;
		return $userprofile['result'];
	}
*/	
	
	function fetchAuid() {
		$fieldname = 'sub'; // OpenID Connect standard
		if ($this->curOAuth2Config['type'] === 'ekklesia') $fieldname = 'auid';
		$auid = $this->fetch($this->curOAuth2Config['get_auid_endp']);
		if (! (isset($auid['result'][$fieldname]) ) ) InternalServerError::MyExceptionData(8734677, "fetchAuid: OAuth2 server answer does not contain the expected field >sub< resp. >auid<", "expected: $fieldname, received: >" . var_export($ret['result'] . '<', true) ); // requested info not received
		return $auid['result'][$fieldname];
	}

	/**
	 * Is listet in the voter list? This can be used for votings of working groups, where the members are in the list.
	 * Ist in der Wählerliste? Dies kann verwendet werden, um Abstimmungen innerhalb 
	 * von Arbeitsgruppen durchzuführen, deren Mitglieder in der entsprechenden Liste aufgeführt sind.
	 * @param unknown $listId
	 * @return boolean
	 */
	function isInVoterList($listId) {
		$inVoterlist = $this->fetch($this->curOAuth2Config['is_in_voter_list_endp'] . $listId .'/', 'listID');
		$inVoterlistBoolean = ( ($inVoterlist['result']['listID'] === $listId) && ($inVoterlist['result']['ismember']));
		if ($inVoterlistBoolean !== true) WrongRequestException::throwException(10005, "For this voting you must be in a certain list of allowed voters. The oAuth2 server either said 'you are not on the list'", 'The oAuth2 server sent this information about you: >' . var_export($inVoterlist, true) .'<');
		return $inVoterlistBoolean;
	}
	
	/**
	 * Es wurde überprüft, dass dies eine real existierende Person ist
	 * It is verified that this user is a real existing person (no fake account)
	 */
	function isVerified() {
		$verifiedStatus = $this->fetchMemberShipInfo();
		if (! (isset($verifiedStatus['result']['verified']) ) ) InternalServerError::MyExceptionData(8734678, 'isVerified: OAuth2 server answer does not contain the expected field >verified<', ", received: >" . var_export($ret['result'] . '<', true) ); // requested info not received
		if ($verifiedStatus['verified'] !== true) WrongRequestException::throwException(10000, "For this voting your existance must be verified. The oAuth2 server either said 'you are not verified' or did not include this information", 'The oAuth2 server sent this information about you: >' . var_export($verifiedStatus, true) .'<');
		return $verifiedStatus['verified'];
	}
	
	/**
	 * Mitglied?
	 * Is a member of the organisation (not a guest)
	 */
	function isMember() {
		$ret = false;
		$entitledStatus = $this->fetchMemberShipInfo();
		switch ($this->curOAuth2Config['type']) {
			case 'ekklesia':
				if (! (isset($ret['result']['type']) ) ) InternalServerError::MyExceptionData(8734679, 'isMember: OAuth2 server answer does not contain the expected field >type<', ", received: >" . var_export($ret['result'] . '<', true) ); // requested info not received
				$ret = ( ($entitledStatus['type'] === 'eligible member') || ($entitledStatus['type'] === 'plain member') );
				break;
			case 'keycloak':
			default:
				if (! (isset($ret['result']['member']) ) ) InternalServerError::MyExceptionData(8734680, 'isMember: OAuth2 server answer does not contain the expected field >member<', ", received: >" . var_export($ret['result'] . '<', true) ); // requested info not received
				$ret = $entitledStatus['member'];
		}
		if ($ret !== true) WrongRequestException::throwException(10002, "For this voting your existance must be a member. The oAuth2 server either said 'you are not a member' or did not include this information", 'The oAuth2 server sent this information about you: >' . var_export($entitledStatus, true) .'<');
		return $ret;
	}
	
	/**
	 * stimmberechtigt?
	 */
	function isEntitled() {
		$ret = false;
		$entitledStatus = $this->fetchMemberShipInfo();
			switch ($this->curOAuth2Config['type']) {
			case 'ekklesia':
				if (! (isset($entitledStatus['type']) ) ) InternalServerError::MyExceptionData(8734681, 'isEntitled: OAuth2 server answer does not contain the expected field >type<', ", received: >" . var_export($entitledStatus, true) . '<'); // requested info not received
				$ret = ($entitledStatus['type'] === 'eligible member');
				break;
			case 'keycloak':
			default:
				if (! (isset($entitledStatus['eligible']) ) ) InternalServerError::MyExceptionData(8734682, 'isEntitled: OAuth2 server answer does not contain the expected field >eligible<', ", received: >" . var_export($entitledStatus, true) . '<' ); // requested info not received
				$ret = $entitledStatus['eligible'];
		}
		if ($ret !== true) WrongRequestException::throwException(10001, "For this voting you must be entitled to vote. The oAuth2 server either said 'you are not entitled/eligible' or did not include this information", 'The oAuth2 server sent this information about you: >' . var_export($entitledStatus, true) .'<');
		return $ret;
	}


	/**
	 * gehört der entsprechenden Parteigliederung an?
	 * belongs to the division of the party which conducts the voting 
	 * @param ID of the devision / Kennnung der Parteigliederung
	 */
	function isInGroup($reqGroups) {
		$memberOfGroupsTmp = $this->fetchMemberShipInfo();
		switch ($this->curOAuth2Config['type']) {
			case 'ekklesia':	$fieldname = 'all_nested_groups'; break;
			case 'keycloak':
			default:			$fieldname = 'roles'; break;
		}
		if (! array_key_exists($fieldname, $memberOfGroupsTmp) ) {
			WrongRequestException::throwException(10003, "For this voting you must be a member of a certain group. The oAuth2 server either said 'you are in no group' or did not include this information", 'The oAuth2 server sent this information about you: >' . var_export($memberOfGroupsTmp, true) .'<');
			return false; // either not delivered by the server or user is not in any nested group
		}
		if (! is_array($memberOfGroupsTmp[$fieldname])) InternalServerError::MyExceptionData(87643675, "expected an array of [bested groups] from the oAuth2 server, got something else.", 'received: >' . var_export($memberOfGroupsTmp[$fieldname], true) . '<');
		$memberOfGroups = $memberOfGroupsTmp[$fieldname];
		foreach ($reqGroups as $reqGroup) {
			if (in_array($reqGroup, $memberOfGroups, true) ) return true;
		}
		WrongRequestException::throwException(10004, "For this voting you must be a member of certain groups. The groups you belong to, do not contain a requiered group.", 'required groups: >' . var_export($reqGroups, true) . '<. The oAuth2 server sent this information about you: >' . var_export($memberOfGroupsTmp, true) .'<');
		return false;
	} 
	
	function fetchMemberShipInfo() {
		if (! isset($this->membershipInfo))  $this->membershipInfo = $this->fetch($this->curOAuth2Config['get_membership_endp']);
//		InternalServerError::MyExceptionData(8734682, 'debug: OAuth2 server answer does not contain the expected field >eligible<', ", received: >" . var_export($this->membershipInfo, true) . '<' ); // requested info not received
		
		return $this->membershipInfo['result'];
	}
	
	
	function sendConfirmMail($electionId) {
		$content = str_replace('$electionId', $electionId, $this->curOAuth2Config['mail_content_body']);
		$msg = json_encode(array(
				'identity' => $this->curOAuth2Config['mail_identity'],
 				'sign'     => $this->curOAuth2Config['mail_sign_it'],
				'content'  => $content
						));
		$msgId = $this->post($this->curOAuth2Config['sendmail_endp'], $msg); // this could be the easiest way to implement Basic auth: this->curOAuth2Config['client_id'] . ':' . $this->curOAuth2Config['client_secret'] . '@' .
		// var_export($msgId); // for debugging
		//if ($msgId['code'] != 200) return false; // 404: imidiate fatal error, e.g. template missing, variable missing, key for signature missing
		if (! isset($msgId['result']['status'])) return false;
		if ($msgId['result']['status'] === 'sent') return true;
		return false;
	}
	
	function fetch($endpoint) {
		$ret = $this->client->fetch($endpoint, Array(), nsOAuth2\Client::HTTP_METHOD_GET);
		if ($ret['code'] != 200) InternalServerError::MyExceptionData(8734675, "http-error while fetching infos from OAuth2 server, expected http status 200 (401 = invalid token (session expired?), 403 = not allowed [scope not requested], 404 = URL wrong endpoint in my oAuth2 config)", "received: >" . $ret['code'] . '< from URL >' . $endpoint . '<') ; // 403 - Berechtigung dafür nicht erteilt (entsprechender scope fehlt), 404: URL falsch in config
		if (! is_array($ret['result'])) InternalServerError::MyExceptionData(8734676, "fetch: OAuth2 server answer could not be JSON decoded",  'received: >' . $ret['result'] . '<'); // requested info not received
		return $ret;
	}
	
	
	function post($endpoint, $contentArray) {
		return $this->client->fetch($endpoint, $contentArray, nsOAuth2\Client::HTTP_METHOD_POST, array('Content-Type' => 'application/json'), nsOAuth2\Client::HTTP_FORM_CONTENT_TYPE_APPLICATION);
	}
	
	
}

?>