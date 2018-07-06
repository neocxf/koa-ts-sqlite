module.exports = {
	"dialect": "sqlite",
	"database": "dappstore",
	"username": "root",
	"password": "dappstore",
	"host": "localhost",
	"storage": "dappstore.sqlite",
	"pool": {
		"max": 5,
		"min": 0,
		"acquire": 30000,
		"idle": 10000
	}
}
