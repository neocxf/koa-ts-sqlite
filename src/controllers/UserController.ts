// check this out
// https://github.com/Microsoft/TypeScript-Node-Starter/blob/master/src/models/User.ts
import koa from 'koa'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import * as crypto from 'crypto'
import {User, UserInstance, UserObject} from "../models";
import {Object2} from "../utils";
import {ResourceManager} from '../service/index'
import {sendEmail} from "../service/GlobalService";
import {sequelize} from '../conn'
import * as util from "util";

class UserController {
	static redisGetAsync = (async (string) => {
	});
	static redisDelAsync = (async (string) => {
	});

	static async viewUsers(ctx, next) {

		if (ctx.user.type != 'admin') {
			ctx.status = 403;
			ctx.body = {
				success: false,
				message: `only type admin user can access the all registration user list!`
			};
			return;
		}

		ctx.body = {
			success: true,
			data: await User.findAll(),
			process: `This is server process : ${process.pid}`
		}
	}

	static async viewUser(ctx, next) {

		if (ctx.userId != ctx.user.id) {
			ctx.status = 401;
			ctx.body = {
				success: false,
				message: `you have no rights to access such endpoint`
			};

			return;
		}

		const user = await User.findOne({where: {id: ctx.user.id}});

		let success: boolean = false;

		if (user) {
			success = true
		}

		ctx.body = {
			success: success,
			user: success ? user : {process: `This is server process : ${process.pid}`}
		}
	}

	static async checkUsernameExists(ctx: koa.Context, next) {
		let {username} = ctx.request.query;

		let user = await User.findOne({where: {name: username}});

		let userExists = !!user;

		ctx.body = {
			success: true,
			exists: userExists,
			message: userExists ? `user with name [${username}] exists` : `user with name [${username}] doesn't exists`
		}
	}

	static async checkEmailExists(ctx: koa.Context, next) {
		let {email} = ctx.request.query;

		let user = await User.findOne({where: {email: email}});

		let userExists = !!user;

		ctx.body = {
			success: true,
			exists: userExists,
			message: userExists ? `user with email [${email}] exists` : `user with email [${email}] doesn't exists`
		}

	}


	static async addUser(ctx: koa.Context, next) {

		let user = ctx.request.body;

		let userBody = new UserObject();

		if (user.password != user.password2) {
			return ctx.body = {
				success: false,
				message: 'password should be equals twice'
			}
		}

		Object2.assignLeft(userBody, user);

		userBody.activated = false;

		let persistUser = await User.findOne({
			where: {
				[sequelize.Op.or]: [{name: user.name}, {email: user.email}]
			}
		});

		if (persistUser) {
			return ctx.body = {
				success: false,
				message: 'use already exists, choose a different name or email address'
			}
		}

		const salt = await bcrypt.genSalt(10);

		userBody.password = await bcrypt.hash(userBody.password, salt);

		persistUser = await User.create(userBody);

		if (persistUser) {
			ctx.body = {
				success: true,
				user: persistUser
			}
		}

		process.nextTick(async () => {
			// send an invitation email
			ctx.request.query = {
				name: persistUser.name,
				email: persistUser.email
			};

			UserController.sendActivateInvitation(ctx, next).then()
		})

	}


	static async sendActivateInvitation(ctx, next) {
		let {name, email} = ctx.request.query;
		let key: string = `auth_name_${name}`;

		const user = await User.findOne({where: {name: name, email: email, activated: false}});

		if (!user) {
			ctx.body = {
				success: false,
				message: `the username and email don't match or the account has already activated`
			};
			return;
		}

		let randomVal = crypto.randomBytes(16).toString('hex');

		ResourceManager.redisInstance.setex(key, 120, randomVal);

		ctx.body = {
			success: true,
			message: 'an invitation letter has been sent to your email, check the email, and hit the link'
		};

		process.nextTick(async () => {
			await ctx.render('activate-account-email', {
				name: name,
				url: `${process.env.HOST_FULL_URL || 'http://localhost:3000'}/v1/users/activate-account?name=${name}&token=${randomVal}`
			});

			sendEmail(email, 'reset password for your account', ctx.body)
		})
	}


	static async confirmActiveAccount(ctx, next) {
		let {name, token} = ctx.request.query;

		let tokenStored = await UserController.redisGetAsync(`auth_name_${name}`);

		if (tokenStored !== token) {
			ctx.body = {
				success: false,
				message: 'token already expired, try to resend the invitation again'
			};

			return;
		}

		{
			const delPromise = UserController.redisDelAsync(`auth_name_${name}`);

			const updateAsync = await User.update({activated: true}, {where: {name: name}});

			await Promise.all([delPromise, updateAsync])
		}

		ctx.body = {
			success: true,
			message: `account with name [${name}] has been successfully activated!`
		};

		process.nextTick(async () => {
			ctx.render('activate-account-success', {name})
		})
	}

	static async confirmChangePassword(ctx, next) {

		let {name, token, password, password2} = ctx.request.body;

		if (password !== password2) {
			return;
		}

		let clearRedisTokenPromise = (async () => {
			let tokenStored = await UserController.redisGetAsync(`auth_reset_pass:${name}`);

			if (tokenStored !== token) {
				throw new Error('token already expired, try to reset again');
			}

			await UserController.redisDelAsync(`auth_reset_pass:${name}`);
		})();

		let genPasswordPromiseFactory = (async () => { // have to wait for the completion of token promise
			const salt = await bcrypt.genSalt(10);

			let hashPassword = await bcrypt.hash(password, salt);

			return User.update({password: hashPassword}, {where: {name: name, activated: true}})
		});


		let findUserPromise = User.findOne({where: {name: name, activated: true}});

		let batchPromiseResult;

		try {
			batchPromiseResult = await Promise.all([clearRedisTokenPromise.then(() => genPasswordPromiseFactory()), findUserPromise]);

			ctx.body = {
				success: true,
				message: 'congratulations, you have successfully change your password, try to login to the system'
			};

			process.nextTick(async () => {
				await ctx.render('reset-password-email', {name: name});

				sendEmail(batchPromiseResult[1].email, 'reset password confirmed', ctx.body)
			})

		} catch (e) {
			ctx.body = {
				success: false,
				message: e.message
			}
		}

	}

	static async resetPasswordPage(ctx, next) {
		let {name, token} = ctx.request.query;

		await ctx.render('reset-password-page', {
			name,
			token,
			url: `${process.env.HOST_FULL_URL || 'http://localhost:3000'}/v1/users/confirm_password_reset`
		});
	}

	static async resetPassword(ctx, next) {

		let {username, email} = ctx.request.query;

		let user = await User.findOne({where: {name: username, email: email}});

		if (!user) {
			ctx.body = {
				success: false,
				message: `the username you provided [${username}] and [${email}] does exist, try register first`
			};

			return;
		}

		ctx.body = {
			success: true,
			message: 'pending to email, check your email'
		};

		process.nextTick(async () => {

			let key: string = `auth_reset_pass:${user.name}`;

			let randomVal = crypto.randomBytes(16).toString('hex');

			ResourceManager.redisInstance.setex(key, 120, randomVal);

			await ctx.render('forgot-password-email', {
				name: user.name,
				url: `${process.env.HOST_FULL_URL || 'http://localhost:3000'}/v1/users/reset-password-page?name=${user.name}&token=${randomVal}`
			}, () => {
			});


			sendEmail(user.email, 'reset password for your account', ctx.body)
		})

	}

	static async loginUser(ctx, next) {

		const {username, password} = ctx.request.body;

		let persistUser: UserInstance = await User.findOne({where: {name: username}});

		if (!persistUser) {
			ctx.body = {
				success: false,
				message: `user [${username}] don't exist`
			};

			return
		}

		if (!persistUser.activated) {
			ctx.body = {
				success: false,
				message: `user [${username}] don't activated yet, try check the email and activate the account first`
			};

			return;
		}

		let isPassMatched = await bcrypt.compare(password, persistUser.password);

		if (!isPassMatched) {
			ctx.body = {
				success: false,
				message: `user [${username}] password don't match`
			};

			return;
		}

		const secret = 'dappstore';

		const userToken = {
			name: persistUser.name,
			type: persistUser.type,
			id: persistUser.id,
			email: persistUser.email
		};

		const token = jwt.sign(userToken, secret, {expiresIn: '4h'});

		ctx.body = {
			success: true,
			message: 'login success',
			token: token
		}

	}

	static async deleteUser(ctx, next) {
		ctx.body = {
			status: 'success',
			message: 'hello, world!'
		}
	}

	static async modifyUser(ctx, next) {
		ctx.body = {
			status: 'success',
			message: 'hello, world!'
		}
	}

}

process.nextTick(async () => {
	UserController.redisGetAsync = util.promisify(ResourceManager.redisInstance.get).bind(ResourceManager.redisInstance);
	UserController.redisDelAsync = util.promisify(ResourceManager.redisInstance.del).bind(ResourceManager.redisInstance);
});

export default UserController