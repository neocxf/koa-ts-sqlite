import * as Koa from 'koa'
import * as path from 'path'
import middleware from './middlewares'
import router from './routes'
import * as Router from 'koa-router';
import * as koaSwagger from 'koa2-swagger-ui'
import * as swaggerJSDoc from 'swagger-jsdoc'
import {IKoaServer} from "../types";
import * as views from 'koa-views';
import swaggerConfig from './config/swagger';


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
			map: {
				html: 'handlebars'
			}
		}));

		let options = swaggerConfig;

		const requestInterceptor = (req) => {
			console.log(`req is ${JSON.stringify(req, null ,4)}`)
			return req;
		};

		this.router.prefix("/v1");

		this.router.get('/api-docs.json', async (ctx, next) => {
			ctx.headers['Content-Type'] = 'application/json';
			ctx.body = swaggerJSDoc(options)
		});


		this.app.use(
			koaSwagger({
				routePrefix: '/docs',
				swaggerOptions: {
					url: `${process.env.HOST_FULL_URL || 'http://localhost:3000'}/v1/api-docs.json`, // example path to json
					requestInterceptor
				},
			}),
		);

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