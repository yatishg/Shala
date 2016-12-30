// Library inclusions.
var express = require('express');
var busboy = require('connect-busboy');
var bodyParser = require('body-parser');
var compression = require('compression');
var session = require('express-session');
var cookieParser = require('cookie-parser');

// Class inclusions.
var auth = require('./server/auths/Auth');
var urls = require('./server/utils/URLs');
var msgs = require('./server/utils/Messages');
var logger = require('./server/utils/Logger');
var config = require('./server/configs/Config');
var sTask = require('./server/utils/StartupTask');
var cUtils = require('./server/utils/CommonUtils');
var taskRouter = require('./server/routers/TaskRouter');

// Initializations.
var env = config.env;
var app = new express();

// Communication settings.
app.use(compression({
	threshold: 0
}));

app.use(cookieParser());
app.use(bodyParser.json({
	limit: '50mb'
}));

app.use(bodyParser.urlencoded({
	limit: '50mb',
	extended: true
}));

app.use(busboy());

// Persistent login sessions.
app.use(session({ 
	secret: msgs.secret,
	resave: false,
	saveUninitialized: false,
	cookie: { secure: false } 
}));

app.use(auth.passport.initialize());
app.use(auth.passport.session());

// Routing settings.
app.use('/', express.static(__dirname + urls.distDir));
app.use('/dist', express.static(__dirname + urls.distDir));
app.use('/node_modules', express.static(__dirname + urls.extLibsDir));
app.use('/app', [taskRouter.isAuthenticated, express.static(__dirname + urls.appDir)]);
app.use('/fav',express.static(__dirname + urls.favicon))
app.use('/taskApi', taskRouter);
app.get('/', function(req, res) {
	res.redirect(urls.home);
});

app.use(function(err, req, res, next) {
	logger.log(err.stack);
	cUtils.sendErrEmail(req.headers.host + req.url + '\n\n\n' + err.message + '\n\n\n' + err.stack);
	res.status(500).json({
		success:false, 
		data: msgs.internalSvrErr
	});
});

app.listen(config.port);
sTask.migrate();
console.log(msgs.portMsg + config.port);