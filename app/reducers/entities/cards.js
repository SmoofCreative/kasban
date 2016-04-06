import { combineReducers } from 'redux'

const records = (state = {}, action) => {
  switch (action.type) {    
    case 'ADD_CARD':
    case 'ADD_CARD_SUCCESS': {
      return {
        ...state,
        [action.payload.id]: {
          ...action.payload.card
        }
      };
    }
    case 'UPDATE_CARD': {
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload.card
        }
      };
    }
    default: {
      return state;
    }
  }
};

const conditions = (state = {}, action) => {
  switch (action.type) {
    case 'CARD_SELECTED': {
      return {
        ...state,
        currentId: action.payload.id
      }
    }
    default: {
      return state;
    }
  }
};

const cards = combineReducers({
  records,
  conditions
});

export default cards;
