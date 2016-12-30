// Library inclusions.
var uuid = require('node-uuid');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Class inclusions.
var logger = require('./../utils/Logger');
var msgs = require('./../utils/Messages');
var config = require('./../configs/Config');
var userRep = require('./../mongoDB/UserDB');
var utils = require('./../utils/commonUtils');

/* PASSPORT IMPLEMENTATION START */
// Login implementation.
passport.use('local-login', new LocalStrategy({
	usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
}, function(req, username, password, done) {	
	userRep.getUserDocByUName(username).then(function(row) {
		if(!row) 
            return done(null, false);

		var hash = utils.hashPassword(password, row.salt);
		userRep.getUserDetailsByUserNameAndPass(username, hash).then(function(row) {
			if (!row) {
				logger.log(msgs.loginFailed + username);
				return done(null, false);
			} 
            else {
                if (row.validate == true) {
                    logger.log(msgs.loggedIn + username);
                    return done(null, row);    
                } 
                else {
                    logger.log(msgs.invalidLogin + username);
                    return done(null, false);
                }                    
            }			
		})
		.catch(function(error) {
			logger.log(JSON.stringify(error));
			return done(null, false);
		});
	});
}))	;

// User serialization.
passport.serializeUser(function(user, done) {
  return done(null, user.id);
});

// User deserialization.
passport.deserializeUser(function(id, done) {
  userRep.getUserById(id).then(function(row) {
    if (!row) 
        return done(null, false);

    return done(null, row);
  })
  .catch(function(err){
  	 logger.log(JSON.stringify(err));
  	 return done(null, false);
  });
});
/* PASSPORT IMPLEMENTATION END */

/* AUTH DECLARATION START */
var auth = {};
auth.passport = passport;
/* AUTH DECLARATION END */

/* AUTH EXTENSION START */
/* AUTH EXTENSION END */

module.exports = auth;