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
		if (! (isset($verifiedStatus['result']['verified']) ) ) InternalServerError::MyExceptionData(8734678, 'isVerified: OAuth2 server answer does not contain the expected field >verified<', ", received: >" . var_export($ret['result'], true)  . '<' ); // requested info not received
		if ($verifiedStatus['verified'] !== true) WrongRequestException::throwException(10000, "For this voting your existance must be verified. The oAuth2 server either said 'you are not verified' or did not include this information", 'The oAuth2 server sent this information about you: >' . var_export($verifiedStatus, true) .'<');
		return $verifiedStatus['verified'];
	}
	
	/**
	 * Mitglied?
	 * Is a member of the organisation (not a guest)
	 */
	function isMember() {
		$ret = false;
		$status = $this->fetchMemberShipInfo();
		switch ($this->curOAuth2Config['type']) {
			case 'ekklesia':
				if (! (isset($status['type']) ) ) InternalServerError::MyExceptionData(8734679, 'isMember: OAuth2 server answer does not contain the expected field >type<', ", received: >" . var_export($status, true) . '<'); // requested info not received
				$ret = ( ($status['type'] === 'eligible member') || ($status['type'] === 'plain member') );
				break;
			case 'keycloak':
			default:
				if (! (isset($status['member']) ) ) InternalServerError::MyExceptionData(8734680, 'isMember: OAuth2 server does not suppor the field >member<', ", received: >" . var_export($status, true) . '<'); // requested info not received
				$ret = $status['member'];
		}
		if ($ret !== true) WrongRequestException::throwException(10002, "For this voting your existance must be a member. The oAuth2 server either said 'you are not a member' or did not include this information", 'The oAuth2 server sent this information about you: >' . var_export($status, true) .'<');
		return $ret;
	}
	
	/**
	 * entitled to vote? (stimmberechtigt?)
	 */
	function isEntitled() {
		$ret = false;
		$status = $this->fetchMemberShipInfo();
			switch ($this->curOAuth2Config['type']) {
			case 'ekklesia':
				if (! (isset($status['type']) ) ) InternalServerError::MyExceptionData(8734681, 'isEntitled: OAuth2 server answer does not contain the expected field >type<', ", received: >" . var_export($status, true) . '<'); // requested info not received
				$ret = ($status['type'] === 'eligible member');
				break;
			case 'keycloak':
			default:
				if (! (isset($status['eligible']) ) ) InternalServerError::MyExceptionData(8734682, 'isEntitled: OAuth2 server answer does not contain the expected field >eligible<', ", received: >" . var_export($status, true) . '<' ); // requested info not received
				$ret = $status['eligible'];
		}
		if ($ret !== true) WrongRequestException::throwException(10001, "For this voting you must be entitled to vote. The oAuth2 server either said 'you are not entitled/eligible' or did not include this information", 'The oAuth2 server sent this information about you: >' . var_export($status, true) .'<');
		return $ret;
	}

	
	/**
	 * returns false, if the voter has requested offline voting for himself
	 */
	function isOnlineVoter() {
		$ret = false;
		$status = $this->fetchMemberShipInfo();
		switch ($this->curOAuth2Config['type']) {
			case 'ekklesia':
				if (! (isset($status['type']) ) ) InternalServerError::MyExceptionData(8734683, 'isOnlineVoter: OAuth2 server answer does not contain the expected field >type<', ", received: >" . var_export($status, true) . '<'); // requested info not received
				$ret = ($status['type'] === 'offline member');
				break;
			case 'keycloak':
			default:
				if (! (isset($status['external_voting']) ) ) InternalServerError::MyExceptionData(8734684, 'isOnlineVoter: OAuth2 server answer does not contain the expected field >external_voting<', ", received: >" . var_export($status, true) . '<' ); // requested info not received
				if ($status['external_voting'] === false ) $ret = true;
				else                                       $ret = false;
		}
		if ($ret !== true) WrongRequestException::throwException(10006, "The oAuth2 server said that you requested offline voting. That is why you cannot vote online.", 'The oAuth2 server sent this information about you: >' . var_export($status, true) .'<');
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
		$senderField = 'identity';
		if ($this->curOAuth2Config['type'] === 'keycloak') {
			$memberInfo = $this->fetch($this->curOAuth2Config['get_membership_endp']);
			if (! array_key_exists('notify_recipient_info', $memberInfo['result']) ) WrongRequestException::throwException(8754875, "sendConfirmMail: Missing the field >notify_recipient_info< in the answer from the oAuth2 server.", 'The oAuth2 server sent this information about you: >' . var_export($memberInfo, true) .'<');
			$senderField = 'sender';
		}
		$content = str_replace('$electionId', $electionId, $this->curOAuth2Config['mail_content_body']);
		$msgArray = array(
				'subject'     => $this->curOAuth2Config['mail_content_subject'],
				'content'     => $content,
 				'sign'        => $this->curOAuth2Config['mail_sign_it']
		);
		if (array_key_exists('mail_identity', $this->curOAuth2Config) )	$msgArray[$senderField] = $this->curOAuth2Config['mail_identity'];
		if ($this->curOAuth2Config['type'] === 'keycloak') {
			// keycloak resp. notify server
			$msgArray['recipient_info'] = $memberInfo['result']['notify_recipient_info'];
			$msg = json_encode($msgArray);
//			var_export($msg);
			$msgId = $this->client->executeRequest(
					$this->curOAuth2Config['notify_url'], 
					$msg, 
					nsOAuth2\Client::HTTP_METHOD_POST, 
					array(  'Content-Type'  => 'application/json', 
							'Authorization' => 'Basic ' . base64_encode($this->curOAuth2Config['notify_client_id'] . ':' . $this->curOAuth2Config['notify_client_secret'])), 
					nsOAuth2\Client::HTTP_FORM_CONTENT_TYPE_APPLICATION
				);
//			var_export($msgId);
		} else {
			// ekklesia ID-Server
			$msg = json_encode($msgArray);
			$msgId = $this->post($this->curOAuth2Config['sendmail_endp'], $msg); 
		}
		// var_export($msgId); // for debugging
		//if ($msgId['code'] != 200) return false; // 404: imidiate fatal error, e.g. template missing, variable missing, key for signature missing
		if (! isset($msgId['result']['status'])) return false;
		if ($msgId['result']['status'] === 'sent') return true;
		return false;
	}
	
	function fetch($endpoint) {
		$ret = $this->client->fetch($endpoint, Array(), nsOAuth2\Client::HTTP_METHOD_GET);
		if ($ret['code'] === 401) InternalServerError::MyExceptionData(8734672, "http-error >401 invalid token< while fetching infos from OAuth2 server, expected http status 200. Most likely caused by session expiry or you logged out.", "received: >" . $ret['code'] . '< from URL >' . $endpoint . '<') ; 
		if ($ret['code'] === 403) InternalServerError::MyExceptionData(8734673, "http-error >403 not allowed< while fetching infos from OAuth2 server, expected http status 200. This happens e.g. there is a problem with the scope. This is a configuration error to be solved by the admins.", "received: >" . $ret['code'] . '< from URL >' . $endpoint . '<') ; 
		if ($ret['code'] === 404) InternalServerError::MyExceptionData(8734674, "http-error >404 not found< while fetching infos from OAuth2 server, expected http status 200. This happens e.g. if the URL in the config is wrong usually to be solved by the admins.", "received: >" . $ret['code'] . '< from URL >' . $endpoint . '<') ; 
		if ($ret['code'] !== 200) InternalServerError::MyExceptionData(8734670, "http-error while fetching infos from OAuth2 server, expected http status 200 (401 = invalid token (session expired?), 403 = not allowed [scope not requested], 404 = URL wrong endpoint in my oAuth2 config)", "received: >" . $ret['code'] . '< from URL >' . $endpoint . '<') ; // 403 - Berechtigung dafür nicht erteilt (entsprechender scope fehlt), 404: URL falsch in config
		if (! is_array($ret['result'])) InternalServerError::MyExceptionData(8734676, "fetch: OAuth2 server answer could not be JSON decoded",  'received: >' . var_export($ret['result'], true) . '<'); // requested info not received
		return $ret;
	}
	
	
	function post($endpoint, $contentArray) {
		return $this->client->fetch($endpoint, $contentArray, nsOAuth2\Client::HTTP_METHOD_POST, array('Content-Type' => 'application/json'), nsOAuth2\Client::HTTP_FORM_CONTENT_TYPE_APPLICATION);
	}
	
	
}

?>