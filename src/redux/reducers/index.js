import { combineReducers } from 'redux';
import {reducer as toastr} from 'react-redux-toastr'

import main from './main';
import filters from "./filters";

export default combineReducers({ main, filters, toastr });
