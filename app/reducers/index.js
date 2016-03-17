import { combineReducers } from 'redux';

import boards from './boards';
import auth from './auth';
import ui from './ui';

export default combineReducers({
  boards,
  auth,
  ui
})

