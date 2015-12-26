TransportEncryption = function () {

};

TransportEncryption.prototype.encrypt = function(plaintext, callbackObj, callbackFunc, serverkey) {
	serverkey.alg = 'RSA-OAEP-256';
	serverkey.ext = true;
	window.crypto.subtle.importKey('jwk', serverkey, 
			{name: 'RSA-OAEP', hash:{name: 'SHA-256'}}, true, ['encrypt', 'wrapKey'])
			.then(function(publickey) {
				this.server1KeyAPI = publickey;
				console.log('server1KeyAPI: ' + TransportEncryption.server1KeyAPI);

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
					this.transportKey = key;
					window.crypto.subtle.exportKey('jwk', key)
					.then(function(keydata) { console.log(keydata); });

					window.crypto.subtle.wrapKey('raw', this.transportKey, this.server1KeyAPI, 
							{  name: "RSA-OAEP", hash: {name: "SHA-256"},
							})
							.then(function(wrappedKey) {
								console.log(wrappedKey);
								console.log('wrappedKey: ' + btoa(String.fromCharCode.apply(null, new Uint8Array(wrappedKey))));
								this.wrappedKey = wrappedKey;

								this.iv = window.crypto.getRandomValues(new Uint8Array(16));
								console.log('iv: ' + arrayBuf2Base64Url(this.iv));
//								var text = 'Text, der verschlüsselt werden sollÄÖÜßäöü1234θ098765ạ4321';
//								console.log(text);
								var cleartext = str2arrayBuf(plaintext);
								console.log('vorm verschlüsseln: ' + arrayBuf2str(cleartext));
								window.crypto.subtle.encrypt(
										{
											name: "AES-CBC",
											//Don't re-use initialization vectors!
											//Always generate a new iv every time your encrypt!
											iv: this.iv,
										},
										this.transportKey, //from generateKey or importKey above
										cleartext //ArrayBuffer of data you want to encrypt
								)
								.then(function(encrypted){
									//returns an ArrayBuffer containing the encrypted data
									var encUI8A = new Uint8Array(encrypted);
									console.log(encUI8A);
									console.log('encrypted: ' + btoa(String.fromCharCode.apply(null, encUI8A)));
									this.encrypted = encrypted;
									var ret = {
											'iv': 			arrayBuf2Base64Url(this.iv),
											'wrappedKey': 	arrayBuf2Base64Url(this.wrappedKey),
											'encrypted': 	arrayBuf2Base64Url(this.encrypted)
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

/*  not needed, not tested, only to show the prodecude and syntax 

TransportEncryption.prototype.decrypt = function (encrypted) {
	window.crypto.subtle.decrypt(
			{
				name: "AES-CBC",
				iv: this.iv // ArrayBuffer(16), //The initialization vector you used to encrypt
			},
			this.transportKey, //from generateKey or importKey above
			encrypted //ArrayBuffer of the data
	)
	.then(function(decryptedba){
		//returns an ArrayBuffer containing the decrypted data
		var decrypted = new Uint8Array(decryptedba); 
		console.log(decrypted);
		console.log('ver- und wieder entschlüsselt: ' + arrayBuf2str(decrypted));
	})
	.catch(function(err){
		console.error(err);
	});
};

*/