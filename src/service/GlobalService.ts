import {ExposedLimiterOptions, ResourceManager} from './index'
import async from "async";
import koa from 'koa'
import * as HttpStatus from 'http-status'
import {RateLimiter} from "./RateLimiter";
import Application = require("koa");

export function sendEmail(email, subject, template) {
	const mailOptions = {
		from: ResourceManager.senderEmail,
		to: email,
		subject: subject,
		html: template
	};

	async.retry(3, (callback) => {
		ResourceManager.emailTransporter.sendMail(mailOptions, callback)
	}, function (err, result) {
		if (err) {
			console.error('email failed, check');
			return;
		}
		console.log(`send email to ${email} success`)
	});
}

async function apiQuota(ctx: koa.Context, next) {
	let request: Application.Request = ctx.request;
	let response: Application.Response = ctx.response;

	const limit = await ResourceManager.globalLimiter.get({id: request.ip});

	if (!response.res.finished && !response.res.headersSent) {
		ctx.set('X-Rate-Limit-Limit', `${limit.total}`);
		ctx.set('X-Rate-Limit-Remaining', `${Math.max(0, limit.remaining - 1)}`);
		ctx.set('X-Rate-Limit-Reset', `${limit.reset}`);
	}

	if (!limit.remaining) {

		let delta = (limit.reset * 1000) - Date.now() | 0;
		let after = limit.reset - (Date.now() / 1000) | 0;

		ctx.set('Retry-After', `${after}`);
		ctx.status = HttpStatus.TOO_MANY_REQUESTS;

		ctx.body = {
			success: false,
			message: `rate limit exceeded the limit of ${limit.total}, retry in ${delta / 1000} to rerun!!`
		};

		return;

	} else {
		await next()
	}
}

function apiLimiterFactory(options: ExposedLimiterOptions = {max: 5}) {

	const rateLimiter: RateLimiter  = ResourceManager.limiter(options);

	return async(ctx: koa.Context, next: () => Promise<any>) => {
		let request: Application.Request = ctx.request;
		let response: Application.Response = ctx.response;

		const limit = await rateLimiter.get({id: request.ip})


		if (!response.res.finished && !response.res.headersSent) {
			ctx.set('X-Rate-Limit-Limit', `${limit.total}`);
			ctx.set('X-Rate-Limit-Remaining', `${Math.max(0, limit.remaining - 1)}`);
			ctx.set('X-Rate-Limit-Reset', `${limit.reset}`);
		}

		if (!limit.remaining) {

			let delta = (limit.reset * 1000) - Date.now() | 0;
			let after = limit.reset - (Date.now() / 1000) | 0;

			ctx.set('Retry-After', `${after}`);
			ctx.status = HttpStatus.TOO_MANY_REQUESTS;

			ctx.body = {
				success: false,
				message: `rate limit exceeded the limit of ${limit.total}, retry in ${delta / 1000} to rerun!!`
			};


		} else {
			await next()
		}

	}
}

export {apiQuota, apiLimiterFactory}

