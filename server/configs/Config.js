// Config class.
var config = {
    configSalt: 'TLYatish',
    mongoConfig:{
		'projectUrl':'mongodb://localhost:27017/taskLance',
		'userCollectionName':'tlUsers',
	},
	logger : {
		logDir : __dirname + '/../server/log/',
		logFileName : __dirname + '/../server/log/app.log'
	},
	emailSettings:{
		userid: 'mail@geektree.in',
		password: 'G@@ktree',
		server: 'smtp.gmail.com',
		subject: 'Test Email',
		fromEmail: 'SEED Dashboard Subscription<mail@geektree.in>'
	},
    env:'dev' // When doing development
	//env:'prod''
};

config.port = config.env == 'prod' ? 9090 : 9090;
module.exports = config;
