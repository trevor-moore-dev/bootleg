import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import { createLogger } from "redux-logger";
import auth from "./reducers/authReducer";
import thunk from "redux-thunk";

// Trevor Moore
// CST-451
// 12/9/2019
// This is my own work.

// Set our composer, create our store, and apply middleware:
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export default createStore(combineReducers({ auth }), {}, composeEnhancers(applyMiddleware(createLogger(), thunk)));