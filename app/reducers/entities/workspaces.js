import { combineReducers } from 'redux'
import update from 'react/lib/update';

import { isNumeric } from '../../utils';

const records = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_WORKSPACE': {
      return {
        ...state,
        [action.payload.id]: {
          ...action.payload.workspace,
          projects: []
        }
      };
    }
    case 'UPDATE_WORKSPACE': {
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload.workspace
        }
      };
    }
    case 'ADD_PROJECT': {
      return update(state, {
        [action.payload.workspaceId]: {
          projects: {
            $push: [action.payload.id]
          }
        }
      });
    }
    case 'ADD_PROJECTS': {
      const { projects, workspaceId } = action.payload;

      let projectIds = [];

      // Go through each comment and check if it doesnt already exists
      for(let key in projects) {
        if(projects.hasOwnProperty(key)) {
          key = isNumeric(key) ? parseInt(key) : key;
          if (state[workspaceId].projects.indexOf(key) === -1) {
            projectIds.push(key);
          }
        }
      }

      return update(state, {
        [workspaceId]: {
          projects: {
            $push: [...projectIds]
          }
        }
      });
    }
    default: {
      return state;
    }
  }
};

const conditions = (state = {}, action) => {
  switch (action.type) {
    default: {
      return state;
    }
  }
};

const workspaces = combineReducers({
  records,
  conditions
});

export default workspaces;
