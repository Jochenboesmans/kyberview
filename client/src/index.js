import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import {Provider} from "react-redux";
import {applyMiddleware, createStore} from "redux";
import reducer from "./reducers/index";
import reduxThunk from "redux-thunk";

import {subscribeToSocketBroadcasts} from "./websocketclient";

/* Temporary solution for usage of alpha version of MUI styles */
import { install } from "@material-ui/styles";
install();

export const store = createStore(reducer, {}, applyMiddleware(reduxThunk));
subscribeToSocketBroadcasts();

const reduxedApp = <Provider store={store}><App/></Provider>;

ReactDOM.render(reduxedApp, document.getElementById("root"));