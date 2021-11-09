import {combineReducers} from "redux"
import bookmarkReducer from "./bookmarkReducer";


const bookmarkReducers = combineReducers({
    bookmark: bookmarkReducer,
})

export default bookmarkReducers
