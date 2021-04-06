import { combineReducers } from "redux";

import entityReducer from "./entities/entitySlice";

export default combineReducers({
  nameInReducer: entityReducer,
});
