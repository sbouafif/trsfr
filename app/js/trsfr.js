'use strict';

var $ = require('jquery');
var gui = window.require('nw.gui');

var AppDispatcher = require('../js/dispatcher/AppDispatcher');
var accountStore = require('../js/stores/AccountStore');

var Window = gui.Window.get();
Window.showDevTools();

var app = app || {};

app.server = {};
app.server.config = {
    host: '192.168.44.44',
    port: 22,
    username: 'vagrant',
    password: 'vagrant'
};

app.server.path = '.';

var Client = ssh2.Client;

var conn = new Client();
var utils = ssh2.utils;

console.log(utils);

var exeSftp = function(callback) {
    conn.on('ready', function() {
        conn.sftp(function(err, sftp) {
            if (err) throw err;
            callback(sftp);
        });
    }).connect(app.server.config);
};

var clearFileList = function() {
    console.log('FileList::Clear');
    $('.files').html('');
}

var enableDownloads = function() {
    $('.get').each(function(i, d) {
        $(d).on('click', function(e) {
            e.preventDefault();
            console.log('click');
            console.log('~/'+$(d).attr('data-filename'));
            exeSftp(function(sftp) {
                sftp.fastGet($(d).attr('data-filename'),
                             'Users/s/trsfr-test/',
                             {
                                 concurrency: 10,
                                 chunkSize: 32768,
                                 step: function(tt, c, t) { console.log(tt);}
                             },
                             function(err) {
                                 if(err) {
                                     console.log(err);
                                 }
                             });
            });
        });
    });
};

var updateFileList = function(list) {
    clearFileList();
    console.log('FileList::Update');
    list.forEach(function(file) {
        $('.files').append("<div class='file'>[<a data-filename='"+file.filename+"' class='get' href='#'>get</a>] "+file.filename+"</div>");
    });

    $('.files .file').each(function(i, d) {
        $(d).on('dragstart', function(e) {
            console.log(e);
            //e.originalEvent.dataTransfer.setData("DownloadURL",fileDetails);
        });
    });

    enableDownloads();
};

var listCurrentDir = function() {
    console.log('FileList::'+app.server.path);
    exeSftp(function(sftp) {
        sftp.readdir(app.server.path, function(err, list) {
            if (err) throw err;
            updateFileList(list);
            conn.end();
        });
    });
};

$(function() {

    $('.connect').on('click', function(e) {
        e.preventDefault();

        listCurrentDir();
        //enableDownloads();
    });

    $('.reload').on('click', function(e) {
        e.preventDefault();

        listCurrentDir();
    });

    $('.file').each(function(i, d) {
        $(d).on({
            click: function(e) {
                e.preventDefault();
            },
            /*
            ondragstart: function(e) {
                e.preventDefault();
                console.log('File::Drag Start');
                console.log(e);

                conn.sftp(function(err, sftp) {
                    sftp.fastGet($(d).attr('data-filename'),
                                 '.',
                                 {
                                     step: function(tt, c, t) { console.log(tt);}
                                 });
                });
            },
            ondrop: function(e) {
                e.preventDefault();
                console.log('File::Drop');
                console.log(e);
            }
            */
        });
    });

    /** DnD **/
    /*
    $('body').on({
        ondragover: function(e) {
            console.log('dragging');
            $(this).addClass('body-hover');
            $(this).addClass('hover');
        }
    });

    $(w).on({
        ondragover: function(e) {
            e.preventDefault();

            $('body').addClass('hover');
            return false;
        },
        ondrop: function(e) {
            e.preventDefault();

            for (var i = 0; i < e.dataTransfer.files.length; ++i) {
                console.log(e.dataTransfer.files[i].path);
            }

            $('body').removeClass('hover');
        }
    });
    */
});
