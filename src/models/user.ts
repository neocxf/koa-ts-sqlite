import {conn, sequelize} from '../conn'

// https://michalzalecki.com/using-sequelize-with-typescript/

export type UserAttributes = {
	id?: number,
	name: string,
	email: string,
	password: string,
	bonusAddress?: string,
	img?:  | string,
	type?: 'user' | string
}

export type UserInstance = sequelize.Instance<UserAttributes> & UserAttributes

const User = conn.define<UserInstance, UserAttributes>('users', {
  name: sequelize.STRING,
  email: sequelize.STRING,
  password: sequelize.STRING,
  bonusAddress: sequelize.STRING,
  img: sequelize.STRING,
  type: sequelize.STRING
})

export enum UserTypeEnum {
	USER = 'user',
	ADMIN = 'admin'
}

export class UserObject {
	public name: string = ''
	public email: string = ''
	public password: string = ''
	public bonusAddress: string = ''
	public img: string = 'http://imgsrc.baidu.com/imgad/pic/item/0823dd54564e925825ed16c49782d158ccbf4e3b.jpg'
	public type: UserTypeEnum = UserTypeEnum.USER

	public constructor(init?:Partial<UserObject>) {
		Object.assign(this, init);
	}
}

export {User}
