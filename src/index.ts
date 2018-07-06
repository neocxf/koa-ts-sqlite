import * as cluster from 'cluster'
import * as os from 'os'
import {KoaServer} from './App'
import {IKoaServer} from "../types/types";
import {Worker} from "cluster";

const port = process.env.PORT || 3000;

if (cluster.isMaster) {
	let num:number = os.cpus().length;

	console.log(`Master ${process.pid} is running`);

	for (let i = 0; i < num; i++) {
		console.log(`Forking process number ${i} ...`);
		cluster.fork()
	}

	cluster.on('online', (worker: Worker) => {
		console.log(`Worker ${worker.process.pid} is online`)
	});

	cluster.on('exit', (worker: Worker, code, signal) => {
		console.log(`Worker ${worker.process.pid} died`);
		console.log(`Forking a new process...`);

		cluster.fork();
	});

} else {
	console.log(`Worker ${process.pid} started...`);

	const app:IKoaServer = new KoaServer(port);

	app.start()
}



