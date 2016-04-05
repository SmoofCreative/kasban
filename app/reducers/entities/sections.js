import { combineReducers } from 'redux'
import update from 'react/lib/update';

const records = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_SECTION': {
      return {
        ...state,
        [action.payload.id]: {
          ...action.payload.section,
          cards: []
        }
      };
    }
    case 'UPDATE_SECTION': {
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload.section
        }
      };
    }
    case 'ADD_CARD': {
      return update(state, {
        [action.payload.sectionId]: {
          cards: {
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

const sections = combineReducers({
  records,
  conditions
});

export default sections;
