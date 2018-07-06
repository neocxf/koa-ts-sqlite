import * as Koa from 'koa'
import * as fs from 'mz/fs'
import * as path from 'path'
import middleware from './middlewares'
import router from './routes'
import * as Router from 'koa-router';
import {IKoaServer} from "../types/types";

class KoaServer implements IKoaServer{
	port: number;
	app: Koa;
	router: Router;

	constructor(port: number = 3000) {
		this.port = port;
		this.app = new Koa();
		this.router = router;
	}

	start() {
		this.app.use(middleware);

		this.app.use(router.routes());

		this.app.use(async ctx => {
			ctx.body = await fs.readFile(path.join(__dirname, '../', 'readme.md'), 'utf8')
			ctx.type = 'markdown'
		});

		this.app.listen(this.port).addListener('connection', (data) => {
			console.log(`Worker ${process.pid} has established the connection at ${this.port}`)
		})
	}
}


export {KoaServer}