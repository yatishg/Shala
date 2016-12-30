// Library inclusions.
var express = require('express');

// Class inclusions.
var urls = require('./../utils/URLs'); 

// Initializations.
var router = express.Router();

/* PUBLIC METHODS START */
// Redirect to home on non-authentication.
router.isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect(urls.home);
}

// Session expiration handling for response.
router.resAuthenticated = function (req, res, next) {    
    if (req.isAuthenticated())
        return next();

    res.json({
        'status': 0,
        'message': msgs.sessionExpired,
        'errorType': '1'
    });
};
/* PUBLIC METHODS END */

module.exports = router;