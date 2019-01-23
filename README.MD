# React-Redux-Websocket

A websocket Middleware

## What it does?

This middleware send and receive actions from a server, dispatching as needed

```js
const FOO = 'FOO';

function Bar() {
    return {
        type: FOO,
        payload: "Receive this"
        socket: {
            send: true
        }
    };
}
```

## Installation and Usage

### Installing

```
npm install react-redux-websocket
```

Then you create the socket and use ApplyMiddleware

```js
import {createStore, applyMiddleware} from 'redux';
import reduxWebsocket from 'react-redux-websocket';

const socket = new WebSocket('ws://localhost:3030');
const store = createStore(rootReducer, applyMiddleware(reduxWebsocket(socket)));
```

### Receiving actions

Any action received through the websocket will be dispatched and handled normally, so your reducers should handle them.

### Dispatching actions

To send actions through the socket you need the special object **socket** with the key _send_ set to **true**

```js
const FOO = 'FOO';

function Bar() {
    return {
        type: FOO,
        payload: "Receive this"
        socket: {
            send: true
        }
    };
}
```

### Configuration

The **socket** object has some properties that you can use, currently those properties are: _send_, _keepSocket_ and _silent_.

```js
const FOO = 'FOO';

function Bar() {
    return {
        type: FOO,
        socket: {
            send: true, // The action will be send through the socket, default: false
            keepSocket: false, // If false, the socket object will be removed after send, default: false
            silent: false // If true, it will not raise erros if fail to send, default: false
        }
    };
}
```

## Test
run
```
npm test
```

## License

react-redux-websocket is free and unencumbered software released into the public domain. See UNLICENSE for details.
