
declare module "async-ratelimiter" {

	import {Redis} from "ioredis";
	type LimiterOptions = {
		id?: string, db?: Redis, max?: number, duration?: number, namespace?: string
	}

	type LimiterGetOptions = {
		id?: string,
		max?: number,
		duration?: number
	}

	type LimiterGetResult = {
		remaining: number,
		reset: number,
		total: number
	}

	class RateLimiter {
		constructor(options: LimiterOptions)

		get(options: LimiterGetOptions): LimiterGetResult;
	}

	export = RateLimiter

}