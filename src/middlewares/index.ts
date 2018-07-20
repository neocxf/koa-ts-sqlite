import * as compose from 'koa-compose'
import * as jwt from 'jsonwebtoken'
import * as util from "util";
import koa from 'koa'

async function logger(ctx, next) {
	// ...
	const start = Date.now();
	await next();
	const ms = Date.now() - start;
	console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
}

async function responseTime(ctx: koa.Context, next) {
	const start = Date.now();
	await next();
	const ms = Date.now() - start;
	ctx.set('X-Response-Time', `${ms}ms`);
}

async function verifyToken(ctx, next) {
	const token = ctx.request.headers['authorization'];

	if (token) {
		let pureToken = token.split(' ')[1];

		const verify = util.promisify(jwt.verify).bind(jwt)

		try {
			ctx.user = await verify(pureToken, 'dappstore');
		} catch (e) {
			ctx.status = 403;
			ctx.body = {
				success: false,
				message: 'token expired or invalid token, try login again to get a valid token'
			};

			return;
		}

	}

	await next()

}

async function ensureLogin(ctx, next) {
	if (ctx.user) {
		return await next();
	}

	const token = ctx.request.headers['authorization'];

	if (!token) {
		ctx.status= 401;
		ctx.body = 'should login first to make the privileged actions'
	}
}


const all = compose([logger, verifyToken,  responseTime]);

export default all
export {ensureLogin}