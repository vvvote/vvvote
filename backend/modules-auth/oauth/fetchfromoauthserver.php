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


require_once 'client.php';

class FetchFromOAuth2Server {

	function __construct($serverId, $authInfos) {
		//$this->serverId = $serverId;
		//$this->authInfos = $authInfos;
		global $oauthConfig;
		$this->curOAuth2Config =  $oauthConfig[$serverId];
		$this->client = new nsOAuth2\Client($this->curOAuth2Config['client_id'], $this->curOAuth2Config['client_secret']);
		$this->client->setAccessToken($authInfos);
		// $this->params = array('redirect_uri' => $curOAuth2Config['redirect_uri']); // $params = array('code' => $_GET['code'], 'redirect_uri' => $curOAuth2Config['redirect_uri']);
	}

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
	
	
	function fetchAuid() {
		$auid = $this->fetch($this->curOAuth2Config['get_auid_endp']);
		if ($auid['code'] != 200) return false; // TODO throw() 403 - Berechtigung dafür nicht erteilt (entsprechender scope fehlt), 404: URL falsch in config
		return $auid['result']['auid'];
	}

	
	function isInVoterList($listId) {
		$inVoterlist = $this->fetch($this->curOAuth2Config['is_in_voter_list_endp'] . $listId .'/');
		if ($inVoterlist['code'] != 200) return false; // 404: voter list id does not exist
		$inVoterlistBoolean = ($inVoterlist['result']['listID'] === $listId && $inVoterlist['result']['ismember']);
		return $inVoterlistBoolean;
	}
	
	/**
	 * Es wurde überprüft, dass dies eine real existierende Person ist
	 * It is verified that this user is a real existing person (no fake account)
	 */
	function isVerified() {
		$verifiedStatus = $this->fetchMemberShipInfo();
		return $verifiedStatus['verified'];
	}
	
	/**
	 * Mitglied?
	 * Is a member of the organisation (not a guest)
	 */
	function isMember() {
		$entitledStatus = $this->fetchMemberShipInfo();
		return ($entitledStatus['type'] === 'eligible member') || ($entitledStatus['type'] === 'plain member') ;
	}
	
	/**
	 * stimmberechtigt?
	 */
	function isEntitled() {
		$entitledStatus = $this->fetchMemberShipInfo();
		return $entitledStatus['type'] === 'eligible member';
	}


	/**
	 * gehört der entsprechenden Parteigliederung an?
	 * belongs to the division of the party which conducts the voting 
	 * @param ID of the devision / Kennnung der Parteigliederung
	 */
	function isInGroup($reqGroups) {
		$memberOfGroupsTmp = $this->fetchMemberShipInfo();
		$memberOfGroups = $memberOfGroupsTmp['all_nested_groups'];
		foreach ($reqGroups as $reqGroup) {
			if (in_array($reqGroup, $memberOfGroups, true) ) return true;
		}
		return false;
	} 
	
	function fetchMemberShipInfo() {
		if (! isset($this->membershipInfo))
		$this->membershipInfo = $this->fetch($this->curOAuth2Config['get_membership_endp']);
		return $this->membershipInfo['result'];
	}
	
	
	function sendConfirmMail($electionId) {
		$content = str_replace('$electionId', $electionId, $this->curOAuth2Config['mail_content']);
		$msg = json_encode(array(
				'identity' => $this->curOAuth2Config['mail_identity'],
 				'sign'     => $this->curOAuth2Config['mail_sign_it'],
				'content'  => $content
						));
		$msgId = $this->post($this->curOAuth2Config['sendmail_endp'], $msg); // this could be the easiest way to implement Basic auth: this->curOAuth2Config['client_id'] . ':' . $this->curOAuth2Config['client_secret'] . '@' .
		// print_r($msgId); // for debugging
		//if ($msgId['code'] != 200) return false; // 404: imidiate fatal error, e.g. template missing, variable missing, key for signature missing
		if (! isset($msgId['result']['status'])) return false;
		if ($msgId['result']['status'] === 'sent') return true;
		return false;
	}
	
	function fetch($endpoint) {
		return $this->client->fetch($endpoint, Array(), nsOAuth2\Client::HTTP_METHOD_GET);
	}
	
	
	function post($endpoint, $contentArray) {
		return $this->client->fetch($endpoint, $contentArray, nsOAuth2\Client::HTTP_METHOD_POST, array('Content-Type' => 'application/json'), nsOAuth2\Client::HTTP_FORM_CONTENT_TYPE_APPLICATION);
	}
	
	
}

?>