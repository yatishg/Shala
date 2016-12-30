// Library inclusions.
var crypto = require('crypto');

// Class inclusions.
var config = require('./../configs/Config');

// Class.
var commonUtils = {
    // Sends error mail to admins.
	sendErrEmail : function(mailBody) {
		if(config.env === 'dev') 
            return;

		var emailSettings = config.emailSettings;
		var tansportUrl = 'smtps://' + emailSettings.userid + ':' + emailSettings.password + '@' + emailSettings.server;
		var transporter = nodemailer.createTransport(tansportUrl);
		var mailOptions = {
			from : 'Test App ' + emailSettings.userid,
			to: 'yatishg@geektree.in',
			subject : 'TEST application error',
			text : mailBody
		};

		transporter.sendMail(mailOptions, function(error, info) {
			if(error) {
		        return console.log(error);
		    }
		});
	},

    // Returns hashed password.
    hashPassword : function (password, salt) {
        var hash = crypto.createHash('sha256');
        hash.update(password);
        hash.update(salt);
        return hash.digest('hex');
    }
};

module.exports = commonUtils;
