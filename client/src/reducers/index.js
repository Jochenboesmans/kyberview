import { combineReducers } from "redux";
import { deltaYReducer } from "./deltaYReducer";
import { marketReducer } from "./marketReducer";
import { navigationReducer } from "./navigationReducer";
import { searchFilterReducer } from "./searchFilterReducer";
import { timeReducer } from "./timeReducer";

const reducer = combineReducers({
	activePage: navigationReducer, market: marketReducer, searchFilter: searchFilterReducer, deltaY: deltaYReducer, time: timeReducer,
});

export { reducer };