'use strict';

var $ = require('jquery');
var gui = window.require('nw.gui');

var AppDispatcher = require('../js/dispatcher/AppDispatcher');
var accountStore = require('../js/stores/AccountStore');

var Window = gui.Window.get();
Window.showDevTools();

var app = app || {};

console.log('start');

app.server = {};
app.server.config = {
    host: '192.168.44.44',
    port: 22,
    username: 'vagrant',
    password: 'vagrant'
};

app.server.path = '.';

var Client = require('ssh2').Client;

var conn = new Client();

var exeSftp = function(callback) {
    conn.on('ready', function() {
        conn.sftp(function(err, sftp) {
            if (err) throw err;
            callback(sftp);
        });
    }).connect(app.server.config);
};

var updateFileList = function(list) {
    $('.files').html();
    list.forEach(function(file) {
        $('.files').append("<div class='file'>"+file.filename+"</div>");
    });
};

var listCurrentDir = function() {
    exeSftp(function(sftp) {
        sftp.readdir(app.server.path, function(err, list) {
            if (err) throw err;
            updateFileList(list);
            conn.end();
        });
    });
};

console.log($('.toolbar').html());

$('.connect').on('click', function(e) {
    e.preventDefault();

    listCurrentDir();
});
