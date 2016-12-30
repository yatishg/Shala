// Library inclusions.
var uuid = require('node-uuid');
var promise = require('bluebird');

// Class inclusions.
var mongoDB = require('./MongoDB');
var collectionName = require('./../configs/Config').mongoConfig.userCollectionName;

// Private variables.
var map = promise.map;

// Main Class
var userDB = {
    /* GET METHODS START */
    // Returns user for id.
    getUserById: function (id) {
        var doc = { id: id };
        return mongoDB.findOneDocument(doc, collectionName);
    },

    // Retruns user document for username.
    getUserDocByUName: function (username) {
        var doc = {
            'username': username
        };

        return mongoDB.findOneDocument(doc, collectionName);
    },

    // Returns user document for username and hashed password.
    getUserDetailsByUserNameAndPass: function (userName, pass) {
        var doc = {
            'username': userName,
            'password': pass
        }

        return mongoDB.findOneDocument(doc, collectionName);
    }
    /* GET METHODS END */
};

module.exports = userDB;