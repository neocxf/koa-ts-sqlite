// check this out
// https://github.com/Microsoft/TypeScript-Node-Starter/blob/master/src/models/User.ts
import koa from 'koa'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import {User, UserInstance, UserObject} from "../models";
import {Object2} from "../utils";

class UserController {

	static async viewUsers(ctx, next) {
		ctx.body = {
			success: true,
			data: await User.findAll(),
			process: `This is server process : ${process.pid}`
		}
	}

	static async viewUser(ctx, next) {

		const user:any = await User.findOne({where: {id: ctx.userId}})

		let success:boolean = false

		if (user) {
			success = true
		}

		ctx.body = {
			success: success,
			user: success ? user : {process: `This is server process : ${process.pid}`}
		}
	}

	static async addUser(ctx: koa.Context, next)  {

		let user = ctx.request.body

		let userBody = new UserObject()

		Object2.assignLeft(userBody, user)

		let persistUser = await User.findOne({where: {name: userBody.name}})

		if (persistUser) {
			return ctx.body = {
				success: false,
				user: persistUser
			}
		}

		const salt = await bcrypt.genSalt(10)

		userBody.password = await bcrypt.hash(userBody.password, salt)

		persistUser = await User.create(userBody)

		if (persistUser) {
			return ctx.body = {
				success: true,
				user: persistUser
			}
		}

	}

	static async loginUser(ctx, next) {

		const {username, password} = ctx.request.body

		let persistUser: UserInstance = await User.findOne({where: {name: username}})

		if (!persistUser) {
			ctx.body = {
				success: false,
				message: `user [${username}] don't exist`
			}

			return
		}

		let isPassMatched = await bcrypt.compare(password, persistUser.password)

		if (!isPassMatched) {
			ctx.body = {
				success: false,
				message: `user [${username}] password don't match`
			}
			return
		}

		const secret = 'dappstore'

		const userToken = {
			name: persistUser.name,
			type: persistUser.type,
			id: persistUser.id
		}

		const token = jwt.sign(userToken, secret, {expiresIn: '4h'})

		ctx.body = {
			success: true,
			message: 'login success',
			token: token
		}

	}

	static async deleteUser(ctx, next)  {
		ctx.body = {
			status: 'success',
			message: 'hello, world!'
		}
	}

	static async modifyUser(ctx, next)  {
		ctx.body = {
			status: 'success',
			message: 'hello, world!'
		}
	}

}

export default UserController