import * as redis from 'redis'
import * as bluebird from 'bluebird'
import {IResourceManager} from "../../types";
import {RedisClient} from "redis";
import {Transporter} from "nodemailer";
import mailer = require( 'nodemailer')
import config from "../config";
import {NeoUtils} from "../utils";

class ResourceManager implements IResourceManager{
	private _redisInstance: RedisClient;
	private _emailTransporter: Transporter;
	private _senderEmail: string;
	constructor() {
	}

	start() {
		if (! this._redisInstance) {
			bluebird.promisifyAll(redis)
			this._redisInstance = redis.createClient(6379, process.env.REDIS_URL || 'localhost');
		}

		if (! this._emailTransporter) {
			const password = NeoUtils.CryptoUtils.decrypt(config.mailer.gmail.password);
			const username = config.mailer.gmail.username

			this._senderEmail = username

			this._emailTransporter = mailer.createTransport({
				service: 'gmail',
				auth: {
					user: username,
					pass: password
				}
			});

		}
	}

	get redisInstance(): RedisClient  {
		return this._redisInstance
	}

	get emailTransporter(): Transporter {
		return this._emailTransporter
	}

	get senderEmail(): string {
		return this._senderEmail
	}
}

let manager = new ResourceManager()

process.nextTick(() => {
	manager.start()
});

export {manager as ResourceManager}

