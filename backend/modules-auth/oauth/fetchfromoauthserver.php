<?php

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
		// TODO generate a 
		$msgId = $this->fetch($this->curOAuth2Config['sendmail_endp']);
		if ($msgId['code'] != 200) return false; // 404: imidiate fatal error, e.g. template missing, variable missing, key for signature missing
		$ret = $msgId['result']['msgid'];
		return $msgId;
	}
	
	function fetch($endpoint) {
		return $this->client->fetch($endpoint, Array(), nsOAuth2\Client::HTTP_METHOD_GET);
	}
	
	/*
	function fetch($endpoint) {
		return $this->client->fetch($endpoint, Array(), nsOAuth2\Client::HTTP_METHOD_POST);
	}
	*/
	
}

?>