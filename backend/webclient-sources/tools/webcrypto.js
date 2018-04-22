/**
 * 
 */

function spkiToPEM(keydataArrayBuffer){
	var base64 = arrayBuf2Base64(keydataArrayBuffer);
    var keydataB64Pem = formatAsPem(base64);
    return keydataB64Pem;
}

function formatAsPem(str) {
	var finalString = '-----BEGIN PUBLIC KEY-----\n';
	while(str.length > 0) {
		finalString += str.substring(0, 64) + '\n';
		str = str.substring(64);
	}
	finalString = finalString + "-----END PUBLIC KEY-----";
	return finalString;
}
function jwk2pemPromise(jwk) {
	return new Promise (function (resolve, reject) {
		window.crypto.subtle.importKey('jwk', jwk, {name: 'RSASSA-PKCS1-v1_5', hash:{name: 'SHA-256'}}, true, ['verify'])
		.then(function(keyAPI){
			window.crypto.subtle.exportKey('spki', keyAPI)
			.then(function (spkikey){
				PEM = spkiToPEM(spkikey);
				resolve(PEM);
			})
		})
		.catch(function(err) {
			throw err;
		})
	});
}
/* async and await are only in draft status as of 22-02-2018, so we do not use it
async function jwk2pem(jwk) {
	return await jwk2pemPromise(jwk);
}
*/
