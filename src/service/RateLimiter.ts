'use strict'
import {Redis} from "ioredis";

const assert = require('assert');

const microtime = require('./microtime');

export type LimiterOptions = {
	id?: string, db?: Redis, max?: number, duration?: number, namespace?: string
}

export type LimiterGetOptions = {
	id?: string,
	max?: number,
	duration?: number
}

export type LimiterGetResult = {
	remaining: number,
	reset: number,
	total: number
}

export class RateLimiter {
	private id: string;
	private db: Redis;
	private max: number;
	private duration: number;
	private readonly namespace: string;

	constructor ({ id, db, max = 2500, duration = 60*1000, namespace = 'limit' }: LimiterOptions) {
		assert(db, 'db required');
		this.db = db;
		this.id = id;
		this.max = max;
		this.duration = duration;
		this.namespace = namespace;
	}

	async get ({ id = this.id, max = this.max, duration = this.duration }: LimiterGetOptions = {} ): Promise<LimiterGetResult> {
		assert(id, 'id required');
		assert(max, 'max required');
		assert(duration, 'duration required');

		const { db } = this;
		const key = `${this.namespace}:${id}`;
		const now = microtime.now();
		const start = now - duration * 1000;

		const res = await db
			.multi()
			.zremrangebyscore(key, 0, start)
			.zcard(key)
			.zadd(key, now, now)
			.zrange(key, 0, 0)
			.pexpire(key, duration)
			.exec();

		const count = parseInt(Array.isArray(res[0]) ? res[1][1] : res[1]);
		const oldest = parseInt(Array.isArray(res[0]) ? res[3][1] : res[3]);

		return {
			remaining: count < max ? max - count : 0,
			reset: Math.floor((oldest + duration * 1000) / 1000000),
			total: max
		}
	}
}
