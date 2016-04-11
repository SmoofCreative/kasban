import { combineReducers } from 'redux'

import workspaces from './workspaces';
import projects from './projects';
import sections from './sections';
import cards from './cards';
import comments from './comments';

const entities = combineReducers({
  workspaces,
  projects,
  sections,
  cards,
  comments
});

export default entities;
