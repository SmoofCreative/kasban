import { combineReducers } from 'redux';

import boards from './boards';
import auth from './auth';

export default combineReducers({
  boards,
  auth
})

