// import * as redis from 'redis'
import * as IoRedis from 'ioredis'
import {IResourceManager} from "../../types";
import {Transporter} from "nodemailer";
import config from "../config/index";
import {NeoUtils} from "../utils";
import {LimiterOptions, RateLimiter} from "./RateLimiter";
import mailer = require( 'nodemailer');

export type ExposedLimiterOptions = Pick<LimiterOptions, 'id' | 'max' | 'namespace' | 'duration'>

class ResourceManager implements IResourceManager{
	private _redisInstance: IoRedis.Redis;
	private _emailTransporter: Transporter;
	private _senderEmail: string;
	private _limit: RateLimiter;
	private _limiterMap: Map<string, RateLimiter> = new Map<string, RateLimiter>();
	constructor() {
	}

	start() {
		if (! this._redisInstance) {
			this._redisInstance = new IoRedis(6379, process.env.REDIS_URL || 'localhost');
		}

		if( ! this._limit) {
			this._limit = new RateLimiter({db: this._redisInstance, max: 2, duration: 60 * 1000})
		}

		if (! this._emailTransporter) {
			const password = NeoUtils.CryptoUtils.decrypt(config.mailer.gmail.password);
			const username = config.mailer.gmail.username;

			this._senderEmail = username;

			this._emailTransporter = mailer.createTransport({
				service: 'gmail',
				auth: {
					user: username,
					pass: password
				}
			});
		}
	}

	get redisInstance(): IoRedis.Redis  {
		return this._redisInstance
	}

	get emailTransporter(): Transporter {
		return this._emailTransporter
	}

	get senderEmail(): string {
		return this._senderEmail
	}

	get globalLimiter(): RateLimiter {
		return this._limit
	}

	limiter(options: ExposedLimiterOptions = { max: 2, duration: 60 * 1000}): RateLimiter {

		let limiterKey = options.namespace;

		let limiter = this._limiterMap.get(limiterKey);

		if (! limiter) {
			limiter = new RateLimiter({db: this._redisInstance, ...options})
			this._limiterMap.set(limiterKey, limiter);

		}

		return limiter;
	}


}

let manager = new ResourceManager();

manager.start();

export {manager as ResourceManager}

