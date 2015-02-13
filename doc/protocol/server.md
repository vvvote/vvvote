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

## Obtain Return Enveleope
	POST /backend/getpermission.php

	 "cmd": "pickBallots"
	 "cmd": "signBallots"
	 
## Cast the Vote
	POST /backend/storevote.php

## Get the Result
	POST /backend/getresult.php


> Written with [StackEdit](https://stackedit.io/).
