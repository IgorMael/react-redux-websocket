function waitForSocket(socket, callback) {
    setTimeout(() => {
        socket.readyState === 1 ? callback() : waitForSocket(socket, callback);
    }, 10);
}

export default socket => store => {
    socket.onmessage = event => store.dispatch(JSON.parse(event.data));
    return next => action => {
        if (action.socket && action.socket.send) {
            if (socket.readyState == 1) {
                if (!action.socket.keepSocket) {
                    let {socket, ...action2} = action;
                    action = action2;
                }
                waitForSocket(socket, socket.send(JSON.stringify(action)));
            } else {
                if (action.socket && !action.socket.silent)
                    throw new Error('Socket is not ready');
            }
        }
        return next(action);
    };
};
