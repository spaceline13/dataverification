import { combineReducers } from 'redux';

import main from './main';
import filters from "./filters";

export default combineReducers({ main, filters });
