<?php


class VoteInvalidException extends Exception {
	function __construct() { //$voteIndex, $text) {
		//				$this->voteNo = $voteNo;
		//				$this->text = $text;
	}
}


class ConfigurableTally extends PublishOnlyTally {
	const name = 'configurableTally';

	function __construct($dbInfo, Crypt $crypt, Blinder $blinder_) {
		parent::__construct($dbInfo, $crypt, $blinder_);
	}

	function handleNewElectionReq($electionId, Auth $auth, Blinder $blinder, $req) {
		$ret = array(
				'scheme'          => $req['scheme'], // TODO: copy members of scheme separately
				'findWinner'	  => $req['findWinner'] // TODO: copy members of scheme separately
		); // TODO throw if necessary member is missing or of wrong type or with not supported values
		return $ret;
	}

	function handleTallyReq($voterReq) {
		if ($voterReq['cmd'] == 'getWinners') {
			$winners = array();
			foreach ($this->elConfig['questions'] as $question) {
				$completeElectionId = makeCompleteElectionId($this->elConfig['electionId'], $question['questionID']);
				$pseudoVoterReq = array('electionId' => $completeElectionId);
				$allvotesTmp = parent::getAllVotesEvent($pseudoVoterReq);
				$allVotes = $allvotesTmp['data']['allVotes'];
				$winners[$question['questionID']] = $this->GetResultMain($allVotes, $question['tallyData'], $question['options']);
			}
			$result = array('cmd' => 'showWinners', 'data' => $winners);
			return $result;
		}
		else return parent::handleTallyReq($voterReq);
	}


	function GetResultMain($allVotes, $tallyConfig, $allOptions) {
		$allOptionIDs = array();
		foreach ($allOptions as $i => $option) {
			array_push($allOptionIDs, $option['optionID']);
		}
		$result = $allOptionIDs;

		$resultStat = $this->GetResultStat($allVotes, $allOptionIDs, $tallyConfig['scheme']);
		for ($schemeNo=0; $schemeNo<count($tallyConfig['findWinner']); $schemeNo++) {
			$curFindWinnerName = $tallyConfig['findWinner'][$schemeNo];
			switch ($curFindWinnerName) {
				case "yesNo":     $result = $this->GetResultYesNo    ($resultStat, $tallyConfig['scheme'], $result); break;
				case "score":     $result = $this->GetResultScore    ($resultStat, $tallyConfig['scheme'], $result); break;
				case "yesNoDiff": $result = $this->GetResultYesNoDiff($resultStat, $tallyConfig['scheme'], $result); break;
				case "random":    $result = $this->GetResultRandom   ($resultStat, $tallyConfig['scheme'], $result); break;
				default:
					throw Error;
			}
		}
		return $result;
	}

	/**
	 *
	 * @param unknown $optionsStat
	 * @param unknown $curScheme
	 * @param unknown $optionConfig
	 * @return array of optionIDs which meet the creteria for winning
	 */
	function GetResultYesNo($optionsStat, $scheme, $potWinner) {
		if (count($potWinner) < 2)  return $potWinner;
		$yesNoScheme = $scheme[find_in_subarray($scheme, 'name', 'yesNo')];
		$winner = array();
		foreach ($potWinner as $curOptID) {
			if (! isset($optionsStat[$curOptID])) $optionsStat[$curOptID] = array('yesNo' => array());
			if (! isset($optionsStat[$curOptID]['yesNo']['numNo']))         $optionsStat[$curOptID]['yesNo']['numNo'] = 0;
			if (! isset($optionsStat[$curOptID]['yesNo']['numYes']))        $optionsStat[$curOptID]['yesNo']['numYes'] = 0;
			if (! isset($optionsStat[$curOptID]['yesNo']['numAbstention'])) $optionsStat[$curOptID]['yesNo']['numAbstention'] = 0;

			$numNO = $optionsStat[$curOptID]['yesNo']['numNo'];
			if (isset($yesNoScheme['abstentionAsNo']) && ($yesNoScheme['abstentionAsNo'] == true)) $numNO = $numNO + $optionsStat[$curOptID]['yesNo']['numAbstention'];
			if ($optionsStat[$curOptID]['yesNo']['numYes'] > 0)  {
				switch ($yesNoScheme['quorum']) {
					case '0': array_push($winner, $curOptID); break;
					case '1':  if ($optionsStat[$curOptID]['yesNo']['numYes'] >= $numNO) array_push($winner, $curOptID); break;
					case '1+': if ($optionsStat[$curOptID]['yesNo']['numYes'] >  $numNO) array_push($winner, $curOptID); break;
					case '2':  if ($optionsStat[$curOptID]['yesNo']['numYes'] >= 2 * $numNO) array_push($winner, $curOptID); break;
					case '2+': if ($optionsStat[$curOptID]['yesNo']['numYes'] >  2 * $numNO) array_push($winner, $curOptID); break;
					default: throw Error; break;
				}
			}
		}

		// sort the result by the number of YES on each option
		if (count($winner) > 1) {
			$numYes = array();
			foreach ($winner as $index => $optionID) {
				$numYes[$index] = $optionsStat[$optionID]['yesNo']['numYes'];
			}
			array_multisort($numYes, SORT_DESC, $winner);
			if (isset($yesNoScheme['mode']) && $yesNoScheme['mode'] == 'bestOnly') {
				$potWinner_ = array();
				array_push($potWinner_,  $winner[0]);
				$maxYes = $numYes[0];
				for ($i=1; $i<count($winner); $i++) {
					if ($numYes[$i] == $maxYes) array_push($potWinner_, $winner[$i]);
				}
				$winner = $potWinner_;
			}
		}
		return $winner;
	}


	function GetResultYesNoDiff($optionsStat, $scheme, $potWinner) {
		if (count($potWinner) < 2)  return $potWinner;
		$yesNoScheme = $scheme[find_in_subarray($scheme, 'name', 'yesNo')];

		// sort by YesNO-Diff
		$diff = array();
		foreach ($potWinner as $index => $optionID) {
			$numNo = $optionsStat[$optionID]['yesNo']['numNo'];
			if (isset($yesNoScheme['abstentionAsNo']) && $yesNoScheme['abstentionAsNo'] == true) $numNo = $numNo + $optionsStat[$optionID]['yesNo']['numAbstention'];
			$diff[$index] = $optionsStat[$optionID]['yesNo']['numYes'] - $numNo;
		}
		array_multisort($diff, SORT_DESC, $potWinner);

		/*		function cmpYesNoDiff($a, $b)	{
			$diffa = getYesNoDiff($a);
		$diffb = getYesNoDiff($b);

		if ($diffa == $diffb) return 0;
		return ($diffa < $diffb) ? +1 : -1;
		}
		usort($potWinner, "cmpYesNoDiff");
		*/
		// add all options which have the same maximum sum to the winner array

		$potWinner_ = array();
		array_push($potWinner_,  $potWinner[0]);
		$maxdiff = $diff[0];
		for ($i=1; $i<count($potWinner); $i++) {
			if ($diff[$i] == $maxdiff) array_push($potWinner_, $potWinner[$i]);
		}
		return $potWinner_;
	}


	function GetResultScore($optionsStat, $curScheme, $potWinner) {
		if (count($potWinner) < 2)  return $potWinner;
		// sort by sum
		/*
		 function cmpSum($a, $b)	{
		if ($optionsStat[$a]['score'] == $optionsStat[$b]['score']) return 0;
		return ($optionsStat[$a]['score'] < $optionsStat[$b]['score']) ? +1 : -1;
		}
		usort($potWinner, "cmpSum");
		*/
		foreach ($potWinner as $index => $optionID) {
			$curScoreSum = 0;
			foreach ($optionsStat[$optionID]['score'] as $selectedSore => $anzahl) {
				$curScoreSum = $curScoreSum + $selectedSore * $anzahl;
			}
			$scoreSum[$index] = $curScoreSum;
		}
		array_multisort($scoreSum, SORT_DESC, $potWinner);
		// add all options which have the same maximum sum to the winner array
		$potWinner_ = array();
		array_push($potWinner_,  $potWinner[0]);
		for ($i=1; $i<count($potWinner); $i++) {
			if ($scoreSum[0] == $scoreSum[$i]) array_push($potWinner_, $potWinner[$i]);
		}
		return $potWinner_;
	}

	function GetResultRandom($optionsStat, $curScheme, $potWinner) {
		if (count($potWinner) < 2)  return $potWinner;
		$ret = array();
		$ret[0] = $potWinner[0];
		return $ret;
	}


	/**
	 *
	 * @param unknown $allVotes = [{"optionOrder": [1, 2, 3, 4], "options": [{"name": "yesNo", "value": 1}]
	 * @param unknown $validOptionIDs = [1, 2, 3, 4]
	 * @return [$optionID]['numYes' / 'numNo' / 'numAbstention']
	 */
	function GetResultStat($allVotes, $validOptionIDs, $schemeConfig) {
		// TODO check signatures in each vote
		$GetResultStatcontentValid = function ($voteStr, $validOptionIDs, $schemeConfig) {
			try {
				$vote = json_decode($voteStr, true);
				if ( $vote == null || (! is_array($vote))
				||		(! isset($vote['optionOrder'])) || (! isset   ($vote['options']))
				||   (! is_array($vote['optionOrder'])) || (! is_array($vote['options'])) ) throw new VoteInvalidException();
				$optionOrder = $vote['optionOrder'];
				$voteForStat = array();
				foreach ($vote['options'] as $optionIndex => $curOption) {
					if (! in_array($optionOrder[$optionIndex], $validOptionIDs)) throw new InvalidVoteException();
					$voteScheme = array();
					foreach ($curOption as $ShemeIndex => $curSheme ) {
						if ( (!isset($curSheme['name'])) || (! is_string($curSheme['name'])) ) throw new VoteInvalidException();
						switch ($curSheme['name']) {
							case 'yesNo':
								if (!is_int($curSheme['value'])) throw new InvalidVoteException();
								switch ($curSheme['value']) {
									case  1: $selectedOpt = 'numYes';          break;
									case  0: $selectedOpt = 'numNo';           break;
									case -1: $selectedOpt = 'numAbstention';   break;
									default: throw new InvalidVoteException(); break;
								}
								break;
							case 'score':
								$scoreSchemeConfig = $schemeConfig[find_in_subarray($schemeConfig,'name', 'score')];
								if ($curSheme['value'] > $scoreSchemeConfig['maxScore'] || $curSheme['value'] < $scoreSchemeConfig['minScore']) throw new VoteInvalidException();
								$selectedOpt = $curSheme['value'];
								break;
							default: throw new InvalidVoteException(); break;
						}
						$voteScheme[$curSheme['name']] = $selectedOpt;
					}
					$voteForStat[$optionOrder[$optionIndex]] = $voteScheme;
				}
			} catch (VoteInvalidException $e) {
				$voteForStat = array('invalid' => 'invalid');
			}
			return $voteForStat;
		};


		/**
		 * adds a vote to the statistics
		 * @param $vote: [1: [ {'yesNo': 'numYes'}, {'score': 3}]] or ['invalid': 'invalid']
		 * @param $votestat old $voteStat
		 * @return updated $voteStat
		 * */
		$GetResultStataddToStat = function ($voteForStat, $votestat) {
			foreach ($voteForStat as $optionIndex => $option) {
				if ($option === 'invalid') {
					if (!isset($votestat['invalid'])) $votestat['invalid'] = 0;
					$votestat['invalid']++;
				} else {
					if (!isset($votestat[$optionIndex])) $votestat[$optionIndex] = array();
					foreach ($option as $name => $value) {
						if (!isset($votestat[$optionIndex][$name]))         $votestat[$optionIndex][$name] = array();
						if (!isset($votestat[$optionIndex][$name][$value])) $votestat[$optionIndex][$name][$value] = 0;
						$votestat[$optionIndex][$name][$value]++;
					}
				}
			}
			return $votestat;
		};



		//$optionStat = array();
		//		foreach ($validOptionIDs as $optionID) {
		//			$optionStat[$optionID] = array('numYes' => 0, 'numNo' => 0, 'numAbstention' => 0, 'numInvalid' => 0);
		//		}
		$optionsStat = array();
		foreach ($allVotes as $vote) {
			$voteForStat = $GetResultStatcontentValid($vote['vote']['vote'], $validOptionIDs, $schemeConfig);
			$optionsStat = $GetResultStataddToStat($voteForStat, $optionsStat);
		}

		// make sure that each option has "yes" and "no" set to zero if no one selected this.
		foreach ($validOptionIDs as $curOptID) {
			foreach ($schemeConfig as $i => $curSchemeConfig) {
				switch ($curSchemeConfig['name'])  {
					case 'yesNo':
						if (! isset($optionsStat[$curOptID])) $optionsStat[$curOptID] = array('yesNo' => array());
						if (! isset($optionsStat[$curOptID]['yesNo']['numNo']))         $optionsStat[$curOptID]['yesNo']['numNo'] = 0;
						if (! isset($optionsStat[$curOptID]['yesNo']['numYes']))        $optionsStat[$curOptID]['yesNo']['numYes'] = 0;
						if (! isset($optionsStat[$curOptID]['yesNo']['numAbstention'])) $optionsStat[$curOptID]['yesNo']['numAbstention'] = 0;
						break;
					case 'score':
						for ($score = $curSchemeConfig['minScore']; $score < $curSchemeConfig['maxScore']; $score++) {
							if (! isset($optionsStat[$curOptID['score'][$score]])) $optionsStat[$curOptID['score'][$score]] = 0;
						}
						break;
				}
			}
		}
		return $optionsStat;
	}

} // class end



?>