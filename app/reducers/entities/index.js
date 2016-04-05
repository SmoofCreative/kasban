import { combineReducers } from 'redux'

import workspaces from './workspaces'; 
import projects from './projects'; 
import sections from './sections'; 
import cards from './cards'; 

const entities = combineReducers({
  workspaces,
  projects,
  sections,
  cards
});

export default entities;
