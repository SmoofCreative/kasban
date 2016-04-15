import { combineReducers } from 'redux'
import update from 'react/lib/update';

import { isNumeric } from '../../utils';

const getCardIndex = (state, cardId, sectionId) => {
  let index = state[sectionId].cards.indexOf(cardId);
  index = index == -1 ? 0 : index;
  return index;
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
    case 'ADD_SECTIONS': {
      return {
        ...state,
        ...action.payload.sections
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
    case 'ADD_CARDS': {
      const { cards, sectionId } = action.payload;
      let cardIds = [];

      // Go through each comment and check if it doesnt already exists
      for(let key in cards) {
        if(cards.hasOwnProperty(key)) {
          key = isNumeric(key) ? parseInt(key) : key;
          if (state[sectionId].cards.indexOf(key) === -1) {
            cardIds.push(key);
          }
        }
      }

      return update(state, {
        [sectionId]: {
          cards: {
            $push: [...cardIds]
          }
        }
      });
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
      let index = getCardIndex(removedCardState, cardToInsertAfter.id, cardToInsertAfter.sectionId);

      // Insert the card in the new position
      return insertCard(removedCardState, cardToMove.id, cardToInsertAfter.sectionId, index + 1);
    }
    case 'CONVERT_SECTION_TO_CARD': {
      const { id, nextSectionId } = action.payload;
      // Move the cards from the current section into the next section
      return update(state, {
        [nextSectionId]: {
          cards: {
            $push: state[id].cards
          }
        },
        [id]: {
          cards: {
            $set: []
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

const sections = combineReducers({
  records,
  conditions
});

export default sections;
