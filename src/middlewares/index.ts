import * as compose from 'koa-compose'

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

const all = compose([logger, responseTime])

export default all