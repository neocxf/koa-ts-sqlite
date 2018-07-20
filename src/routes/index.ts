import * as Router from 'koa-router'
import * as koaBody from 'koa-body'
import UserController from '../controllers/UserController'
import {ensureLogin} from "../middlewares";
import {apiLimiterFactory} from "../service/GlobalService";

const router = new Router()

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


// router.use(async (ctx, next) => {
// 	if (ctx.request.method !== 'GET' && ctx.request.headers['content-type'] !== HttpUtils.MediaTypes.JSON && ctx.request.headers['content-type'] !== HttpUtils.MediaTypes.JSON_CHARSET) {
// 		ctx.body = {
// 			success: false,
// 			msg: 'invalid content-type'
// 		}
// 		return
// 	}
//
// 	await next()
// })

router
/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - users
 *     description: check all the user's list
 *     summary: check all the user's list
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: login
 *     security:
 *        - JWT: []
 *
 *     deprecated: true
 */
	.get('/users', UserController.viewUsers)

	/**
	 * @swagger
	 * /users/check_username:
	 *   get:
	 *     tags:
	 *       - users
	 *     description: check whether the username exists
	 *     summary: Check whether the username exists
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - name: username
	 *         description: username.
	 *         in: query
	 *         required: true
	 *         type: string
	 *     responses:
	 *       200:
	 *         description: the check complete successfully
	 */
	.get('/users/check_username', UserController.checkUsernameExists)
	/**
	 * @swagger
	 * /users/check_email:
	 *   get:
	 *     tags:
	 *       - users
	 *     description: check whether the email exists
	 *     summary: Check whether the email exists
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - name: email
	 *         description: email.
	 *         in: query
	 *         required: true
	 *         type: string
	 *     responses:
	 *       200:
	 *         description: the check complete successfully
	 */
	.get('/users/check_email', UserController.checkEmailExists)

	/**
	 * @swagger
	 * /users/reset_password:
	 *   get:
	 *     tags:
	 *       - users
	 *     description: send the reset email to the given email, and begin the reset process. For every 60s, every ip can access 2 times
	 *     summary: Check whether the email exists
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - name: username
	 *         description: username.
	 *         in: query
	 *         required: true
	 *         type: string
	 *       - name: email
	 *         description: email.
	 *         in: query
	 *         required: true
	 *         type: string
	 *     responses:
	 *       200:
	 *         description: the reset mail process have successfully begin
	 */
	.get('/users/reset_password', apiLimiterFactory({namespace:'limit:users:reset_password', max: 2}), UserController.resetPassword)
	.get('/users/reset-password-page', UserController.resetPasswordPage)

	/**
	 * @swagger
	 * /users/activate-account:
	 *   get:
	 *     tags:
	 *       - users
	 *     description: confirm the activation of given account. For every 60s, every ip can access 2 times
	 *     summary: Confirm to activate the account
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - name: name
	 *         description: username.
	 *         in: query
	 *         required: true
	 *         type: string
	 *       - name: token
	 *         description: token you receive from email.
	 *         in: query
	 *         required: true
	 *         type: string
	 *       - name: password
	 *         description: new password.
	 *         in: query
	 *         required: true
	 *         type: string
	 *         format: password
	 *       - name: password2
	 *         description: new password confirmed.
	 *         in: query
	 *         required: true
	 *         type: string
	 *         format: password
	 *     responses:
	 *       200:
	 *         description: success activate the account with the given name
	 */
	.post('/users/confirm_password_reset', apiLimiterFactory({namespace:'limit:users:confirm_reset_password', max: 2}), koaBody(), UserController.confirmChangePassword)

router
/**
 * @swagger
 * /users:
 *   post:
 *     tags:
 *       - users
 *     description: Register as a new user. For every 60s, every ip can access 5 times
 *     summary: Register as a new user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: name
 *         description: Username to use for login.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: email
 *         description: identical email address for account activation, One email can only be bound to one account.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: user password, at least 3.
 *         in: formData
 *         required: true
 *         type: string
 *         format: password
 *       - name: password2
 *         description: confirm the password, at least 3.
 *         in: formData
 *         required: true
 *         type: string
 *         format: password
 *       - name: img
 *         description: default image for the user, optional.
 *         in: formData
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: login
 */
	.post('/users',apiLimiterFactory({namespace:'limit:users:register', max: 5}), koaBody(), UserController.addUser)
	/**
	 * @swagger
	 * /users/activate-account:
	 *   get:
	 *     tags:
	 *       - users
	 *     description: confirm the activation of given account
	 *     summary: Confirm to activate the account
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - name: name
	 *         description: username.
	 *         in: query
	 *         required: true
	 *         type: string
	 *       - name: token
	 *         description: token you receive from email.
	 *         in: query
	 *         required: true
	 *         type: string
	 *     responses:
	 *       200:
	 *         description: success activate the account with the given name
	 */
	.get('/users/activate-account', apiLimiterFactory({namespace:'limit:users:activate_account', max: 2}), UserController.confirmActiveAccount)

	/**
	 * @swagger
	 * /users/resend-activate-invitation:
	 *   get:
	 *     tags:
	 *       - users
	 *     description: Resend the activation letter to your email. For every 60s, every ip can access 5 times
	 *     summary: Resend the activation letter to your email
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - name: name
	 *         description: username.
	 *         in: query
	 *         required: true
	 *         type: string
	 *       - name: email
	 *         description: email that you give when you register a given username.
	 *         in: query
	 *         required: true
	 *         type: string
	 *     responses:
	 *       200:
	 *         description: accept the re-send email request
	 */
	.get('/users/resend-activate-invitation', apiLimiterFactory({namespace:'limit:users:resend_invitation', max: 2}), UserController.sendActivateInvitation)


	/**
	 * @swagger
	 * /users/login:
	 *   post:
	 *     tags:
	 *       - users
	 *     description: Login to the application
	 *     summary: Login to the application
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - name: username
	 *         description: Username to use for login.
	 *         in: formData
	 *         required: true
	 *         type: string
	 *       - name: password
	 *         description: User\'s password.
	 *         in: formData
	 *         required: true
	 *         type: string
	 *         format: password
	 *     responses:
	 *       200:
	 *         description: login
	 */
	.post('/users/login', koaBody(), UserController.loginUser);

router.param('id', async (id, ctx: any, next) => {
	ctx.userId = id;
	await next()
})
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags:
 *       - users
 *     description: get the detail info of a given user
 *     summary: get the detail info of a given user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: user identifier.
 *         in: path
 *         required: true
 *         format: int
 *     responses:
 *       200:
 *         description: success retrieve the user info
 *     security:
 *        - JWT: []
 *
 */
	.get('/users/:id', ensureLogin,  UserController.viewUser)
	.del('/users/:id',  ensureLogin, UserController.deleteUser)
	.put('/users/:id',  ensureLogin, UserController.modifyUser)


export default router