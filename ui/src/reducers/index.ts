import { combineReducers } from 'redux';
import { users } from './user';
import { authentication } from "./auth"
import { pipeline } from "./pipelines"
import { StoreState } from "../types"

const rootReducer = combineReducers({
    user: users,
    pipeline: pipeline,
    auth: authentication
});

export default rootReducer;