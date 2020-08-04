/** @format */

import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import getData from "./reducer";
import { StateType } from "./type";
import { composeWithDevTools } from "redux-devtools-extension";

const loggerMiddleware = createLogger();

export default function configureStore(preloadedState: StateType) {
	return createStore(
		getData,
		preloadedState,
		composeWithDevTools(applyMiddleware(thunkMiddleware, loggerMiddleware))
	);
}
