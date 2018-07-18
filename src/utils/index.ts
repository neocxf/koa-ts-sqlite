export module Object2 {
	export function assignLeft(left: Object, right: Object): Object {
		Object.keys(left).forEach(key => {
			if (right[key] !== undefined) {
				left[key] = right[key]
			}
		})

		return left
	}
}

export module HttpUtils {

	 export function isValidMediaTypes(c1: string, c2:MediaTypes): boolean {
	 	return c1 === c2
	 }

	export enum MediaTypes {
		JSON = 'application/json',
		JSON_CHARSET = 'application/json; charset=UTF-8',
		XML = 'application/xml',
		XML_CHARSET = 'application/xml; charset=utf8',
		TEXT = 'text/plain'
	}
}

export module NeoUtils {
	const crypto = require('crypto'),
		algorithm = 'aes-256-ctr',
		password = 'www.neospot.top';

	function encrypt(text){
		const cipher = crypto.createCipher(algorithm,password)
		let crypted = cipher.update(text,'utf8','hex')
		crypted += cipher.final('hex');
		return crypted;
	}

	function decrypt(text){
		const decipher = crypto.createDecipher(algorithm,password)
		let dec = decipher.update(text,'hex','utf8')
		dec += decipher.final('utf8');
		return dec;
	}

	export const CryptoUtils = {
		encrypt,
		decrypt
	}

}