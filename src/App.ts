import * as Koa from 'koa'
import * as path from 'path'
import middleware from './middlewares'
import router from './routes'
import * as Router from 'koa-router';
import {IKoaServer} from "../types";
import * as views from 'koa-views';

class KoaServer implements IKoaServer{
	port: number | string;
	app: Koa;
	router: Router;

	constructor(port: string | number = 3000) {
		this.port = port;
		this.app = new Koa();
		this.router = router;
	}

	start() {
		this.app.use(middleware);

		this.app.use(views(path.join(__dirname, '../src', '/template'), {
			// extension: 'hbs',
			map: {
				html: 'handlebars'
			}
		}))

		this.app.use(this.router.routes());

		this.app.use(async ctx => {
			await ctx.render('index', {
					theme: 'Koa.js'})

		});

		this.app.listen(this.port).addListener('connection', (data) => {
			console.log(`Worker ${process.pid} has established the connection at ${this.port}`)
		})
	}
}


export {KoaServer}

export default KoaServer