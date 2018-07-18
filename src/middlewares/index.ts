import * as compose from 'koa-compose'
import * as jwt from 'jsonwebtoken'

async function logger(ctx, next) {
	// ...
	const start = Date.now();
	await next();
	const ms = Date.now() - start;
	console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
}

async function responseTime(ctx, next) {
	const start = Date.now();
	await next();
	const ms = Date.now() - start;
	ctx.set('X-Response-Time', `${ms}ms`);
}

async function verifyToken(ctx, next) {
	const token = ctx.request.headers['authorization'];

	if (token) {
		let pureToken = token.split(' ')[1]

		jwt.verify(pureToken, 'dappstore', (err, decoded) => {
			if (err) {
				ctx.status = 403;
				ctx.body = 'invalid token, try to login again';
				return next()
			}

			ctx.user = decoded

			next()
		})
	} else {
		await next()
	}

}

async function ensureLogin(ctx, next) {
	if (ctx.user) {
		next();
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