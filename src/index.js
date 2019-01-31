'use strict';

exports.__esModule = true;

function _objectWithoutProperties(obj, keys) {
    var target = {};
    for (var i in obj) {
        if (keys.indexOf(i) >= 0) continue;
        if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
        target[i] = obj[i];
    }
    return target;
}

function waitForSocket(socket, callback) {
    setTimeout(function() {
        socket.readyState === 1 ? callback() : waitForSocket(socket, callback);
    }, 10);
}

exports.default = function(socket) {
    return function(store) {
        socket.onmessage = function(event) {
            return store.dispatch(JSON.parse(event.data));
        };
        return function(next) {
            return function(action) {
                if (action.socket && action.socket.send) {
                    if (!action.socket.keepSocket) {
                        var _action = action,
                            _socket = _action.socket,
                            action2 = _objectWithoutProperties(_action, [
                                'socket'
                            ]);

                        action = action2;
                    }
                    waitForSocket(socket, function() {
                        return socket.send(JSON.stringify(action));
                    });
                }
                return next(action);
            };
        };
    };
};
