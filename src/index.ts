import {KoaServer} from "./App";
import {IKoaServer} from "../types";

const port = process.env.PORT || 3000;

const app:IKoaServer = new KoaServer(port);

console.log(`Worker ${process.pid} started...`);

app.start();
