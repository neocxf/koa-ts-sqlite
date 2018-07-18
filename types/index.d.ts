import { DataTypeAbstract, DefineAttributeColumnOptions } from "sequelize";
import * as Koa from 'koa';
import * as Router from "koa-router";

import './global.d'
import {RedisClient} from "redis";

declare global {
	type SequelizeAttributes<T extends { [key: string]: any }> = {
		[P in keyof T]: string | DataTypeAbstract | DefineAttributeColumnOptions;
	};
}

declare interface IKoaServer {
	port: number | string
	app: Koa
	router: Router

	start(): void
}

declare interface IResourceManager {

	start(): void
}