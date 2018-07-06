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