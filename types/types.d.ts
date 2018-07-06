import { DataTypeAbstract, DefineAttributeColumnOptions } from "sequelize";
import * as Koa from 'koa';
import * as Router from "koa-router";

declare global {
	type SequelizeAttributes<T extends { [key: string]: any }> = {
		[P in keyof T]: string | DataTypeAbstract | DefineAttributeColumnOptions;
	};
}

declare interface IKoaServer {
	port: number
	app: Koa
	router: Router

	start(): void
}