import { combineReducers } from 'redux'
import update from 'react/lib/update';

import { isNumeric } from '../../utils';

const addSection = (state, id, section) => {
  return {
    ...state,
    [id]: {
      ...section,
      cards: []
    }
  };
};

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
      const { id, section } = action.payload;
      return addSection(state, id, section);
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
    case 'CONVERT_CARD_TO_SECTION': {
      const { newSection, containerSectionId } = action.payload;

      // Create a new section
      const addedSectionState = addSection(state, newSection.id, newSection);

      // Find the index of the card we've converting and get the cards we want to move
      const currentContainerCards = addedSectionState[containerSectionId].cards;
      const convertedCardIndex = currentContainerCards.indexOf(newSection.id);

      // Get the list of cards we want to move to our new section, exlcuding the new section id
      const newSectionCards = currentContainerCards.splice(convertedCardIndex + 1, currentContainerCards.length);

      // Get the list of cards we want to keep in the container section
      const containerCards = currentContainerCards.splice(0, convertedCardIndex);

      // Set the cards to their respective section
      return update(addedSectionState, {
        [newSection.id]: {
          cards: {
            $set: newSectionCards
          }
        },
        [containerSectionId]: {
          cards: {
            $set: containerCards
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
