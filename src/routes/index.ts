import * as Router from 'koa-router'
import * as koaBody from 'koa-body'

const router = new Router()

import UserController from '../controllers/UserController'
import {HttpUtils} from "../utils";

async function root(ctx, next) {
	if (ctx.request.url !== '/home') { // at this middleware, we don't call await next(), so the chain will not continue but return
		return await next()
	}

	ctx.body = {
		status: 'success',
		message: 'request / success'
	}
}

async function about(ctx, next) {
	ctx.body = {
		status: 'success',
		message: 'hello, world!'
	}
}

router
	.get('/home', root)

router
	.get('/about', about)


router.use(async (ctx, next) => {
	if (ctx.request.method !== 'GET' && ctx.request.headers['content-type'] !== HttpUtils.MediaTypes.JSON && ctx.request.headers['content-type'] !== HttpUtils.MediaTypes.JSON_CHARSET) {
		ctx.body = {
			success: false,
			msg: 'invalid content-type'
		}
		return
	}

	await next()
})


router
	.get('/users', UserController.viewUsers)

router
	.post('/users', koaBody(), UserController.addUser)
	.post('/users/login', koaBody(), UserController.loginUser)

router.param('id', async(id, ctx: any, next) => {
	ctx.userId = id
	await next()
})
	.get('/users/:id', UserController.viewUser)
	.del('/users/:id', UserController.deleteUser)
	.put('/users/:id', UserController.modifyUser)


export default router