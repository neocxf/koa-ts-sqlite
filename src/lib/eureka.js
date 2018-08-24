'use strict';

// Or, if you're not using a transpiler:
const Eureka = require('eureka-js-client').Eureka;

// example configuration
const client = new Eureka({
	// application instance information
	instance: {
		id: 'neo-auth-service',
		app: 'neo-auth-service',
		hostName: process.env.HOST_URL,
		ipAddr: process.env.HOST_URL,
		port: {
			'$': process.env.PORT,
			'@enabled': 'true',
		},
		vipAddress: 'node-simple-service',
		homePageUrl: 'http://localhost:3000',
		statusPageUrl: 'http://localhost:3000/v1/status',
		healthCheckUrl: `${process.env.HOST_URL}:${process.env.PORT}/v1/healthcheck`,
		dataCenterInfo: {
			'@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
			name: 'MyOwn',
		},
	},
	eureka: {
		// eureka server host / port
		host: 'www.neospot.top',
		port: 8761,
		servicePath: '/eureka/apps/'
	},
});

function connectToEureka() {
	client.logger.level('debug');
	client.start(function(error) {
		console.log('########################################################');
		console.log(JSON.stringify(error) || 'Eureka registration complete');   });
}

export {
	connectToEureka
}