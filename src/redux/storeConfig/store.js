import { createStore, applyMiddleware, compose } from 'redux';
import createDebounce from 'redux-debounced';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/rootReducer';
import createSagaMiddleware from '@redux-saga/core';
import RootSaga from '../sagas/RootSaga';

const middlewares = [thunk, createDebounce()];

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducer,
  {},
  composeEnhancers(applyMiddleware(...middlewares, sagaMiddleware))
);

sagaMiddleware.run(RootSaga);

export { store };
