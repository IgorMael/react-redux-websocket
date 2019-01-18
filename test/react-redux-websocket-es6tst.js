import Midsocket from '../src/redux-midsocket';
import {WebSocket, Server} from 'mock-socket';

global.socket = new WebSocket('ws://localhost:30310');
global.server = new Server('ws://localhost:30310');
socket.send = jest.fn(action => true);
socket.readyState = 1;

const create = () => {
    const store = {
        getState: jest.fn(() => ({})),
        dispatch: jest.fn()
    };
    const next = jest.fn();
    const invoke = action => Midsocket(socket)(store)(next)(action);
    return {store, next, invoke};
};

it('passes through non-socket action', () => {
    const {next, invoke} = create();
    const action = {type: 'TEST'};
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
});

it('send the action and keep socket field', () => {
    const {next, invoke} = create();
    const action = {type: 'TEST', socket: {send: true, keepSocket: true}};
    invoke(action);
    expect(socket.send).toHaveBeenCalledWith(JSON.stringify(action));
    expect(next).toHaveBeenCalledWith(action);
});

it('send the action and strip socket field', () => {
    const {next, invoke} = create();
    const action = {type: 'TEST', socket: {send: true}};
    invoke(action);
    action.socket = undefined;
    expect(socket.send).toHaveBeenCalledWith(JSON.stringify(action));
    expect(next).toHaveBeenCalledWith(action);
});

it('send the action with socket not ready, throw error', () => {
    const {next, invoke} = create();
    let socketNotReady = socket;
    socketNotReady.readyState = 0;
    const action = {type: 'TEST', socket: {send: true, keepSocket: true}};
    expect(() => invoke(action)).toThrowError();
});

it('send the action with socket not ready, omit error', () => {
    const {next, invoke} = create();
    let socketNotReady = socket;
    socketNotReady.readyState = 0;
    const action = {type: 'TEST', socket: {send: true, keepSocket: true, silent: true}};
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
});
