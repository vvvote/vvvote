Server architecture
===============
[TOC]

## Create New Election
	POST /backend/newelection.php

```flow
Entry=>start: Create a new election
verifyInput=>operation: Verify Input
electionIdUnique=>condition: Is the requested ElectionId already used?
instantiateAuth=>subroutine: Instanciate auth module
instantiateBlinder=>subroutine: Instanciate blinding module
instantiateTally=>subroutine: Instanciate tally module
generateConfigHash=>operation: Generate config hash
saveConfig=>operation: Save config
ok=>end: Send the link to the created election
error=>end: Error

Entry->verifyInput->electionIdUnique->electionIdUnique
electionIdUnique(no)->instantiateAuth->instantiateBlinder->instantiateTally->generateConfigHash->saveConfig->ok
electionIdUnique(yes, right)->error

```

## Get Election Config

	GET /backend/getelectionconfig.php?confighash=1c1038751a8f5202caabdec3413042da3ec54683b5f1d8069333371c0d61a22e&api

## Obtain Return Envelope
	POST /backend/getpermission.php

```flow
start=>start: Start
loadModules=>subroutine: Load auth, tally and blinder module

handleReq=>subroutine: Let blinder handle the request

end=>end: End

start->loadModules->handleReq->end
```

	 "cmd": "pickBallots"
	 "cmd": "signBallots"
	 

## Cast the Vote
	POST /backend/storevote.php

```flow
start=>start: Start
loadModules=>subroutine: Load auth, tally and blinder module
handleReq=>subroutine: Let tally handle the request
encapsulateAnswer=>operation: surround the JSON encoded answer with "---vvvote---" 
in order to encapsulate it from data inserted by an anonymizing service
end=>end: End

start->loadModules->handleReq->encapsulateAnswer->end
```


## Get the Result
	POST /backend/getresult.php


> Written with [StackEdit](https://stackedit.io/).
