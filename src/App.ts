import * as Koa from 'koa'
import * as path from 'path'
import middleware from './middlewares'
import router from './routes'
import * as Router from 'koa-router';
import * as koaSwagger from 'koa2-swagger-ui'
import * as swaggerJSDoc from 'swagger-jsdoc'
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
		}));

		let options = {
			swaggerDefinition: {
				// openapi: '3.0.0',
				swagger: "2.0",
				info: {
					description: "neospot authorization service. You can find out more about Neo\'s contribution at [https://www.neospot.top](https://www.neospot.top) or on [github.com, #SFG](http://github.com/neocxf/). For this sample, you can use the api key `special-key` to test the authorization filters.",
					title: 'Neo Auth',
					version: '1.0.0',
					contact: {
						email: "neocxf@gmail.com"
					},
					license: {
						name: "Apache 2.0",
						url: "http://www.apache.org/licenses/LICENSE-2.0.html"
					}
				},
				host: `${process.env.HOST_URL || 'localhost:3000'}`,
				basePath: "/v1",
				schemes: [
					"http",
					"https",
				],
				tags: [
					{
						name: "users",
						description: "Authentication using mechanisms such as JWT, provide user registration, login, and etc..",
						externalDocs: {
							description: "Find out more",
							url: "http://swagger.io"
						}
					},
					{
						name: "store",
						description: "Access to Petstore orders"
					},
					{
						name: "user",
						description: "Operations about user",
						externalDocs: {
							description: "Find out more about our store",
							url: "http://swagger.io"
						}
					}
				],

				"securityDefinitions": {
					"JWT": {
						"description": "the jwt access token that append when try to access sensitive information",
						"type": "apiKey",
						"name": "Authorization",
						"in": "header"
					}
				}

			},
			apis: ['dist/**/*.js'], // Path to the API docs
		};

		const requestInterceptor = (req) => {
			console.log(`req is ${JSON.stringify(req, null ,4)}`)
			return req;
		};

		this.router.prefix("/v1");

		this.router.get('/api-docs.json', async (ctx, next) => {
			ctx.headers['Content-Type'] = 'application/json'
			ctx.body = swaggerJSDoc(options)
		});


		this.app.use(
			koaSwagger({
				routePrefix: '/docs',
				swaggerOptions: {
					url: `${process.env.HOST_URL || 'http://localhost:3000'}/v1/api-docs.json`, // example path to json
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