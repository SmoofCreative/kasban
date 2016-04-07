import { combineReducers } from 'redux'
import update from 'react/lib/update';

const getCardIndex = (state, cardId, sectionId) => {
  return state[sectionId].cards.indexOf(cardId);
};

const addCard = (state, cardId, sectionId) => {
  return update(state, {
    [sectionId]: {
      cards: {
        $push: [cardId]
      }
    }
  });
};

const insertCard = (state, cardId, sectionId, index) => {
  return update(state, {
    [sectionId]: {
      cards: {
        $splice: [[index, 0, cardId]]
      }
    }
  });
};

const removeCard = (state, cardId, sectionId) => {
  const index = getCardIndex(state, cardId, sectionId)

  return update(state, {
    [sectionId]: {
      cards: {
        $splice: [[index, 1]]
      }
    }
  });
};

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
      return addCard(state, action.payload.id, action.payload.parentId);
    }
    case 'REMOVE_CARD': {
      const { id, sectionId } = action.payload;
      return removeCard(state, id, sectionId);
    }
    case 'MOVE_CARD': {
      const { cardToMove, cardToInsertAfter } = action.payload;

      // First remove the card to move
      const removedCardState = removeCard(state, cardToMove.id, cardToMove.sectionId);

      // Find the index of the card to insert after
      const index = getCardIndex(removedCardState, cardToInsertAfter.id, cardToInsertAfter.sectionId);

      // Insert the card in the new position
      return insertCard(removedCardState, cardToMove.id, cardToInsertAfter.sectionId, index + 1);
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

const sections = combineReducers({
  records,
  conditions
});

export default sections;
