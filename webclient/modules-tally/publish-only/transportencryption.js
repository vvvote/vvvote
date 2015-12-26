TransportEncryption = function () {

};

TransportEncryption.prototype.encrypt = function(plaintext, callbackObj, callbackFunc, serverkey) {
	serverkey.alg = 'RSA-OAEP-256';
	serverkey.ext = true;
	var me = this;
	window.crypto.subtle.importKey('jwk', serverkey, 
			{name: 'RSA-OAEP', hash:{name: 'SHA-256'}}, true, ['encrypt', 'wrapKey'])
			.then(function(publickey) {
				me.serverKeyAPI = publickey;
				console.log('serverKeyAPI: ' + me.serverKeyAPI);

				window.crypto.subtle.generateKey(
						{
							name: 'AES-CBC',
							length: 256, //can be  128, 192, or 256
						},
						true, //whether the key is extractable (i.e. can be used in exportKey)
						['encrypt', 'decrypt'] //can be "encrypt", "decrypt", "wrapKey", or "unwrapKey"
				)
				.then(function(key){
					//returns a key object
					console.log(key);
					me.transportKey = key;
					window.crypto.subtle.exportKey('jwk', key)
					.then(function(keydata) { console.log(keydata); });

					window.crypto.subtle.wrapKey('raw', me.transportKey, me.serverKeyAPI, 
							{  name: "RSA-OAEP", hash: {name: "SHA-256"},
							})
							.then(function(wrappedKey) {
								console.log(wrappedKey);
								console.log('wrappedKey: ' + btoa(String.fromCharCode.apply(null, new Uint8Array(wrappedKey))));
								me.wrappedKey = wrappedKey;

								me.iv = window.crypto.getRandomValues(new Uint8Array(16));
								console.log('iv: ' + arrayBuf2Base64Url(me.iv));
//								var text = 'Text, der verschlüsselt werden sollÄÖÜßäöü1234θ098765ạ4321';
//								console.log(text);
								var cleartext = str2arrayBuf(plaintext);
								console.log('vorm verschlüsseln: ' + arrayBuf2str(cleartext));
								window.crypto.subtle.encrypt(
										{
											name: "AES-CBC",
											//Don't re-use initialization vectors!
											//Always generate a new iv every time your encrypt!
											iv: me.iv,
										},
										me.transportKey, //from generateKey or importKey above
										cleartext //ArrayBuffer of data you want to encrypt
								)
								.then(function(encrypted){
									//returns an ArrayBuffer containing the encrypted data
									var encUI8A = new Uint8Array(encrypted);
									console.log(encUI8A);
									console.log('encrypted: ' + btoa(String.fromCharCode.apply(null, encUI8A)));
									me.encrypted = encrypted;
									var ret = {
											'iv': 			arrayBuf2Base64Url(me.iv),
											'wrappedKey': 	arrayBuf2Base64Url(me.wrappedKey),
											'encrypted': 	arrayBuf2Base64Url(me.encrypted)
									};
									callbackFunc.call(callbackObj, JSON.stringify(ret));

								})
								.catch(function(err){
									console.error(err);
								});
							})
							.catch(function(err){
								console.error(err);
							});
				})
				.catch(function(err) {
					console.error(err);
				});
			})
			.catch(function(err) {
				console.error(err);
			});
};		

/**
 *  encryptedmessage: already decoded JSON object
 */
TransportEncryption.prototype.decrypt = function (encryptedmessage, decodeJSON) {
	var me = this;
	var promis = new Promise( function (resolve, reject ){
		try {
			var encrypted = encryptedmessage;
			var iv =  base64Url2ArrayBuf(encrypted.iv);
			var encryptedAB = base64Url2ArrayBuf(encrypted.encrypted);
			window.crypto.subtle.decrypt(
					{
						name: "AES-CBC",
						iv: iv // ArrayBuffer(16), //The initialization vector you used to encrypt
					},
					me.transportKey, //from generateKey or importKey above
					encryptedAB //ArrayBuffer of the data
			)
			.then(function(decryptedba){
				//returns an ArrayBuffer containing the decrypted data
				var decrypted = new Uint8Array(decryptedba);
				var decryptedStr = arrayBuf2str(decrypted);
				var ret = decryptedStr;
				if (decodeJSON === true) ret = JSON.parse(decryptedStr);
				console.log(decrypted);
				console.log('ver- und wieder entschlüsselt: ' + ret);
				resolve(ret);
			})
			.catch(function(err){
				console.error(err);
				reject(new ErrorInServerAnswer(75554, 'decrypt: decryption failed', err.toString()));
			});
		} catch (e) {
			reject(new ErrorInServerAnswer(75555, 'decrypt: Server answer does not match the expected format', e.message));
		};
	});
	return promis;
};

