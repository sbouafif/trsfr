/**
 * AccountStore
 **/

var gui = window.require('nw.gui');
var PouchDB = require('pouchdb');
var keychain = require('keychain');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AccountConstants = require('../constants/AccountConstants');

var app = app || {};

function create(account) {
    getDb(function(db) {

        keychain.setPassword({ account: account.name, service: account.service, password: account.password }, function(err) {
            if(err) {
                console.log(err);
            }

            account._id = createUuid();

            db.put(account).then( function(response) {
                console.log('account created')
            }).catch( function(err) {
                console.log(err);
            });

            db.changes().on('change', function() {
                console.log('updated');
            });
        });
    });
}

function get(account) {
    keychain.getPassword({ account: account.name, service: account.service}, function(err, password) {
        if(err) {
            console.log(err);
        }

        console.log(password);

        account.password = password;
    });
}

function getAll(callback) {
    getDb(function(db) {
        db.allDocs({
            include_docs: true,
            attachments: true
        }).then(function(result) {
            callback(result);
        }).catch(function(err) {
            console.log(err);
        });
    });
}

function getDb(callback) {
    callback(new PouchDB('dbjs'));
}

function createUuid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

AppDispatcher.register(
    function(action) {
        switch(action.type) {
        case 'create':
            create(action.account);
            break;
        case 'getAll':
            getAll(action.callback);
            break;
        }
    }
);
