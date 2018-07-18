import {ClientOpts, RedisClient} from "redis";

declare module "http2" {
	export interface Http2ServerRequest{}
	export interface Http2ServerResponse{}
}

declare module "http" {
	export interface OutgoingHttpHeaders {}
}

declare module 'redis' {
	export interface RedisClient extends NodeJS.EventEmitter {
		hdelAsync(...args: any[]): Promise<any> | void;
		getAsync(...args: any[]): Promise<any> | void;
		delAsync(...args: any[]): Promise<any> | void;
		// add other methods here

	}

	export function createClient(port: number, host?: string, options?: ClientOpts): RedisClient;
	export function createClient(unix_socket: string, options?: ClientOpts): RedisClient;
	export function createClient(redis_url: string, options?: ClientOpts): RedisClient;
	export function createClient(options?: ClientOpts): RedisClient;
}