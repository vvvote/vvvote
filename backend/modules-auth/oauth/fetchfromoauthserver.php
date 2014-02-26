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
		return $userprofile['username'];
	}

	function fetchUserProilfe() {
		$userprofile = $this->fetch($this->curOAuth2Config['get_profile_endp']);
		return $userprofile['result'];
	}
	
	
	function fetchAuid() {
		$membership = $this->fetch($this->curOAuth2Config['get_membership_endp']);
		return $membership['result']['auid'];
	}

	function isInVoterList($listId) {
		$inVoterlist = $this->fetch($this->curOAuth2Config['is_in_voter_list_endp'] . $listId .'/');
		if ($inVoterlist['code'] != 200) return false; // 404: voter list id does not exist
		$inVoterlistBoolean = ($inVoterlist['result']['list'] === $listId && $inVoterlist['result']['listmember']);
		return $inVoterlistBoolean;
	}


	function fetch($endpoint) {
		return $this->client->fetch($endpoint, Array(), nsOAuth2\Client::HTTP_METHOD_POST);
	}
}

?>