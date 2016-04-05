import { combineReducers } from 'redux';

import auth from './auth';
import entities from './entities/index';
import workspacesList from './workspacesList';
import ui from './ui';

export default combineReducers({
  auth,
  entities,
  workspacesList,
  ui
})

