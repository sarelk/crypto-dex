import { createStore, applyMiddleware, compose } from "redux";
import { createLogger } from "redux-logger"
import rootReducer from "./reducers";

const loggerMiddleware = createLogger()
const middleware = []

const composeEnhacers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default function configureStore(preloadedState) {
    return createStore(
        rootReducer,
        preloadedState,
        composeEnhacers(applyMiddleware(...middleware, loggerMiddleware))
    )
}