'use strict';

var _reduxMidsocket = require('../src');

var _reduxMidsocket2 = _interopRequireDefault(_reduxMidsocket);

var _mockSocket = require('mock-socket');

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
}

global.socket = new _mockSocket.WebSocket('ws://localhost:30310');
global.server = new _mockSocket.Server('ws://localhost:30310');
socket.send = jest.fn(function(action) {
    return true;
});
socket.readyState = 1;

var create = function create() {
    var store = {
        getState: jest.fn(function() {
            return {};
        }),
        dispatch: jest.fn()
    };
    var next = jest.fn();
    var invoke = function invoke(action) {
        return (0, _reduxMidsocket2.default)(socket)(store)(next)(action);
    };
    return {store: store, next: next, invoke: invoke};
};

it('passes through non-socket action', function() {
    var _create = create(),
        next = _create.next,
        invoke = _create.invoke;

    var action = {type: 'TEST'};
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
});

it('send the action and keep socket field', function() {
    var _create2 = create(),
        next = _create2.next,
        invoke = _create2.invoke;

    var action = {type: 'TEST', socket: {send: true, keepSocket: true}};
    invoke(action);
    expect(socket.send).toHaveBeenCalledWith(JSON.stringify(action));
    expect(next).toHaveBeenCalledWith(action);
});

it('send the action and strip socket field', function() {
    var _create3 = create(),
        next = _create3.next,
        invoke = _create3.invoke;

    var action = {type: 'TEST', socket: {send: true}};
    invoke(action);
    action.socket = undefined;
    expect(socket.send).toHaveBeenCalledWith(JSON.stringify(action));
    expect(next).toHaveBeenCalledWith(action);
});

it('send the action with socket not ready, throw error', function() {
    var _create4 = create(),
        next = _create4.next,
        invoke = _create4.invoke;

    var socketNotReady = socket;
    socketNotReady.readyState = 0;
    var action = {type: 'TEST', socket: {send: true, keepSocket: true}};
    expect(function() {
        return invoke(action);
    }).toThrowError();
});

it('send the action with socket not ready, omit error', function() {
    var _create5 = create(),
        next = _create5.next,
        invoke = _create5.invoke;

    var socketNotReady = socket;
    socketNotReady.readyState = 0;
    var action = {type: 'TEST', socket: {send: true, keepSocket: true, silent: true}};
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
});
