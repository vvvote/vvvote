view this document showing the sequence diagrams: https://stackedit.io/viewer#!url=https://raw.githubusercontent.com/pfefffer/vvvote/master/doc/protocol/protocol.md

Welcome to VVVote!
===================

Short Explanation of the VVVote Protocol

Table of Content
-----------------------
[TOC]

Overview
-------------

vvvote protocol consists of three phases:

 1. obtaining an anonymous return envelope 
 2. using the anonymous return envelope in order to cast the vote
 3. publish all votes 

The phases are fixed periods and publicly announced.

# Definitions
voter
:	the computer of the voter (in the following just the called the voter)

# Phase 1: Obtaining the Return Envelope

In the first phase, the voter identifies to the server and let the server sign an anonymous return envelope. This anonymous return envelope will be used in the voting phase to cast the vote.
The return envelope consists mainly of an RSA public key which was signed blindly by the server. The server signature indicates that this is a valid key for signing a vote, e.g. the key pair belongs to an entitled voter.
>Note: nobody except the voter himself can do a matching between the RSA key used to sign the vote and the individual voter. This is because the server signs the corresponding public key blindly, meaning it is encrypted by the voter beforehand and decrypted after the server had singed the voter's anonymous public key. 

## The General Idea

In this phase the voter will obtain an RSA key which is signed blindly by the server indicating that it is allowed for signing the vote and thereby giving the right to vote.
In order to achieve this, the voter generates an RSA key pair. Then the voter blinds the public part of it and sends it to the server, together with the voter's credentials. 
The server checks the credentials and weather it's the first request of this voter for a return envelope. If everything is ok, the server signs the blinded public key and sends it back to the voter.

## The Process in More Detail
Two problems are additionally addressed:

1. avoid the necessity to trust a single server
In order to add some more resistance against manipulation attacks to the server, we added a second server which does mainly the same as the first one and also verifies if the first server was acting correctly. 
2. do not rely blindly on the client program to function correctly
In order to be able to verify if the client program is working correctly, it must produce 5 RSA key pairs and individual blinding factors. Each server will ask randomly for some of them for the unblinding factors so that the servers can verify if the client knows the corresponding unblind factor, the private RSA key and has done the procedures correctly.

Putting these things togehter, we get the following protocol:


```sequence
Note right of Voter: subroutine: "Generate Return Envelops" \ngenerates \n - 5 RSA key pairs and \n - 5 corresponding blinding factors\n - blinded hashes of the public parts of the RSA key pairs
Voter->Server_1: (1) I am Bob, my password is <secret>,\n the blinded hashes of the 5 public keys I generated are [] - 'pickBallots'

Note left of Server_1: - verify password,\n - is first request for a ballot?
Note left of Server_1: randomly select 3 of the generated keys,\n e.g. key numbers 1, 3 and 4
Server_1->Voter: (2) Send me the unblinding factors of hashes 1,3 and 4\nas well as all the data belonging to the corresponding hashes - 'unblindBallots'

Voter->Server_1: (3) (str, unblindFactor)[1], [3] and [4] - 'signBallots'
Note left of Server_1: verify if voter has done everything correctly:\n - unblind the hashes 1, 3 and 4 sent in (1),\n - verify if they match the corresponding hashes of str,\n - verify that the public key contained in str is not used already,\n - verify electionId

Note left of Server_1: randomly select 2 still blinded hashes (e.g. 2 and 5) and sign them\n BlindServer_1Sigs={Sign blindedHash[2], Sign blindedHash[5]}
Server_1->Voter: (4) BlindServer_1Sigs - 'reqSigsNextpServer'

Note right of Voter: Verify if the BlindServer_1Sigs are correct
Voter->Server_2: (5) I am Bob, my password is <secret>,\n the BlindServer_1Sigs are [] - 'pickBallots'

Note left of Server_2: - verify password,\n - is first request for a ballot at this server?
Note left of Server_2: randomly select 1 one of the 2 BlindServer_1Sigs, e.g. 2.
Server_2->Voter: (6) send me the unblindig factor for BlindServer_1Sig no. 2  - 'unblindBallots'

Note right of Voter: Server_1Sig no. 2 = unblind BlindServerSig
Voter->Server_2: (7) str, unblind factor for no. 2 - 'signBallots'
Note left of Server_2: verify if voter has done everything correctly:\n - unblind the hash of no. 2 sent in (5),\n - verify if they match the corresponding hashes of str,\n - verify that the public key contained in str is not used already,\n - verify electionId
Note left of Server_2: verify if Server_1 has done everything correctly: verify the signature of Server_1
Note left of Server_2: sign the left over still blind hash: BlindServer_2Sig = Sign blindedHash[5]

Server_2->Voter: (8) BlindedServer_2Sig - 'savePermission'
Note right of Voter: - Server_1Sig = unblind BlindServer_1Sigs[5]\n  - Server_2Sig = unblind BlindServer_2Sig
Note right of Voter: Save(private key, public key, Server_1Sig, Server_2Sig) = returnEnvelope
```

# Phase 2: Cast the Vote
```sequence
Note right of Voter: load returnEnvelope
Note right of Voter: let the voter make his decisions,\n save the decisions in vote
Voter->Server: singedVote = vote + sig(vote) + Server_1Sig(public key) + Server_2Sig(public key) + public key
Note left of Server: - verify ServerSigs,\n - verify sig(vote),\n - verify if the public key is used the first time to sign a vote
Note left of Server: serverSigned = sign signedVote [to be implemented]
Note left of Server: store serverSigned [to be implemented]
Server->Voter: serverSigned(signedVote) [to be implemented, right now only "accepted" is sent]
Note right of Voter: save serverSigned(signedVote)
```
The Data-Package which contains the vote is sent through an anonymizing service which anonymizes the senders IP-Adress and removes the browsers fingerprint. This is done, because in this way the counting server cannot use the voter's ip address or his browser's finderprint to try a matching to information about the voter's location or other information which the admin might know from elsewhere about one voter's ip adress or his browser's fingerprint. If you did not change it, anonymouse.org is used for that purpose.


# Routine to Prepare Return Envelops in the Client 
```flow
st=>start: Generate Return Envelops
opRSAgen=>operation: keys[] = Generate 10 RSA key pairs
opBlindFgen=>operation: - blindf[] = Generate 10 blinding factors 
- unblindf[] = compute the corresopnding unblinding factors
opBallotGen=>operation: For each RSA-key-pair:
- str = concanate electionId, RSA public key, salt
- hash = Hash it /sha256/
- blindedHash = blind the hash
e=>end: return returnEnvelops = array[object(keys[index], blindf[index], unblindf[index], str, hash, blindedHash) for each key]

cond=>condition: Yes or No?

st->opRSAgen->opBlindFgen->opBallotGen->e
cond(yes)->e
cond(no)->op
```

# Phase 3: Publish All Votes
All Votes are published and can be obtained from the server in order to...

 - verify that no vote was changed (e.g. on each vote the voter's signature is valid)
 - verify that all votes come from legitimate voters (e.g. the server signature of the public key of each voter is valid)
 - verify that my vote is contained
 - tally the votes



# More Information
 - Description of the JSON format used to transmit the data:   https://stackedit.io/viewer#!url=https://raw.githubusercontent.com/pfefffer/vvvote/master/doc/protocol/protocol-format-definition.md

-----
> **Note:** You can find more information:

> - about **Sequence diagrams** syntax [here][7],
> - about **Flow charts** syntax [here][8].

### Support StackEdit

[![](https://cdn.monetizejs.com/resources/button-32.png)](https://monetizejs.com/authorize?client_id=ESTHdCYOi18iLhhO&summary=true)

  [^stackedit]: [StackEdit](https://stackedit.io/) is a full-featured, open-source Markdown editor based on PageDown, the Markdown library used by Stack Overflow and the other Stack Exchange sites.


  [1]: http://math.stackexchange.com/
  [2]: http://daringfireball.net/projects/markdown/syntax "Markdown"
  [3]: https://github.com/jmcmanus/pagedown-extra "Pagedown Extra"
  [4]: http://meta.math.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference
  [5]: https://code.google.com/p/google-code-prettify/
  [6]: http://highlightjs.org/
  [7]: http://bramp.github.io/js-sequence-diagrams/
  [8]: http://adrai.github.io/flowchart.js/

