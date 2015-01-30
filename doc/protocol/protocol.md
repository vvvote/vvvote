Welcome to VVVote!
===================

Short Explanation of the VVVote Protocol

Table of Content
-----------------------
[TOC]

Overview
-------------

vvvote protocol consits of three phases:

 1. obtaining an anonymous return envelope 
 2. using the anonymous return envelope in order to cast the vote
 3. publish all votes 

The phases are fixed periods and publicly announced.


# Phase 1: Obtaining the Return Envelope

In the first phase, the voter identifies to the server and let the server sign an anonymous return envelope. This anonymous return envelope will be used in the voting phase to cast the vote.
The return envelope consists mainly of an RSA public key which was signed blindly by the server. The server signature indicates that this is a valid key for signing a vote, e.g. the key pair belongs to an entitled voter.
>Note: nobody except the voter itelf can do a matching between the RSA key used to sign a vote and the individual voter. This is because the server signs the corresponding public key blindly, meaning it is encrypted by the voter beforehand and decrypted after the server had singed the voter's anonymous public key. 

In order to achiev this, the voter, to be precise the computer of the voter (in the following just the called the voter), generates an RSA key pair. Then the voter blindes the public part of it and sends it to the server, together with the voter's credentials. 
The server checks the credentials and weather it's the first request of this vote for a return envelope.

```sequence
Note left of Voter: subroutine: "Generate Return Envelops" \ngenerates \n - 5 RSA key pairs and \n - 5 corresponding blindung factors\n - blinded hashes of the public parts of the RSA key pairs
Voter->Server: (1) I am Bob, my password is <secret>,\n the blinded hashes of the 5 public keys I generated are []
Note right of Server: - verify password,\n - is first request for a ballot?
Note right of Server: randomly select 3 of the generated keys,\n e.g. key numbers 1, 3 and 4
Server->Voter: (2) Send me the unblinding factors of hashes 1,3 and 4\nas well as the string belonging to the corresponding hashes
Voter-Server: (3) (str, unblindFactor)[1], [3] and [4]
Note right of Server: verify if voter has done everything correctly:\n - unblind the hashes 1, 3 and 4 sent in (1),\n - verify if they match the corresponding hashes of str,\n - verify that the public key contained in str is not used already,\n - verify electionId
Note right of Server: BlindServerSig=Sign blindedHash[7]
Server->Voter: (4) BlindServerSig
Note left of Voter: ServerSig = unblind BlindServerSig
Note left of Voter: Save(private key, ServerSig) = returnEnvelope
```

# Phase 2: Post the Vote
```sequence
Note left of Voter: load returnEnvelope
Note left of Voter: let the voter make his decisions,\n save the decisions in vote
Voter->Server: singedVote = vote + sig(vote) + ServerSig(public key) + public key
Note right of Server: - verifiy ServerSig,\n - verify sig(vote)
Note right of Server: serverSigned = sign signedVote
Note right of Server: store serverSigned
Server->Voter: serverSigned(signedVote)
Note left of Voter: save serverSigned(signedVote)
```


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


----------

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

