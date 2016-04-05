import { combineReducers } from 'redux'
import update from 'react/lib/update';

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
    default: {
      return state;
    }
  }
};

const conditions = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_CONDITION': {
      return {
        ...state,
        [action.payload.id]: action.payload.value
      }
    }
    default: {
      return state;
    }
  }
}

const workspaces = combineReducers({
  records,
  conditions
});

export default workspaces;
