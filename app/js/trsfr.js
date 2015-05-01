'use strict';

var $ = require('jquery');
var gui = window.require('nw.gui');

var Window = gui.Window.get();
Window.showDevTools();

var AppDispatcher = require('./js/dispatcher/AppDispatcher');
var accountStore = require('./js/stores/AccountStore');

var app = app || {};