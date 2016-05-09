import { combineReducers } from 'redux'
import update from 'react/lib/update';

import { isNumeric } from '../../utils';

const getSectionIndex = (state, sectionId, projectId) => {
  let index = state[projectId].sections.indexOf(sectionId);
  index = index == -1 ? 0 : index;
  return index;
};

const addSection = (state, projectId, sectionId, index) => {
  // If the id already exists return what we already have
  if (state[projectId].sections.indexOf(sectionId) !== -1) {
    return state;
  }

  return update(state, {
    [projectId]: {
      sections: {
        $splice: [[index, 0, sectionId]]
      }
    }
  });
};

const removeSection = (state, projectId, index) => {
  return update(state, {
    [projectId]: {
      sections: {
        $splice: [[index, 1]]
      }
    }
  });
};

const records = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_PROJECT': {
      return {
        ...state,
        [action.payload.id]: {
          ...action.payload.project,
          sections: []
        }
      };
    }
    case 'ADD_PROJECTS':
    case 'OVERWRITE_PROJECTS': {
      return {
        ...state,
        ...action.payload.projects
      };
    }
    case 'UPDATE_PROJECT': {
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload.project
        }
      };
    }
    case 'ADD_SECTION': {
      // Default index of 1 as uncategorised should be first
      const { projectId, id, index = 1 } = action.payload;
      return addSection(state, projectId, id, index);
    }
    case 'ADD_SECTIONS': {
      const { sections, projectId } = action.payload;

      let sectionIds = [];

      // Go through each comment and check if it doesnt already exists
      for(let key in sections) {
        if(sections.hasOwnProperty(key)) {
          key = isNumeric(key) ? parseInt(key) : key;
          sectionIds.push(key);
        }
      }

      return update(state, {
        [projectId]: {
          sections: {
            $set: [...sectionIds]
          }
        }
      });
    }
    case 'MOVE_SECTION': {
      const { sectionId, projectId, index } = action.payload;

      // Find the index of the section currently
      const currentSectionIndex = state[projectId].sections.indexOf(sectionId);

      // If it doesn't exist end here
      if (currentSectionIndex === -1) {
        return state;
      }

      // Splice out the section
      const splicedState = update(state, {
        [projectId]: {
          sections: {
            $splice: [[currentSectionIndex, 1]]
          }
        }
      });

      // Now insert it back in the new place
      return update(splicedState, {
        [projectId]: {
          sections: {
            $splice: [[index, 0, sectionId]]
          }
        }
      });
    }
    case 'REMOVE_SECTION': {
      const { id, projectId } = action.payload;
      const index = getSectionIndex(state, id, projectId);
      return removeSection(state, projectId, index);
    }
    case 'CONVERT_SECTION_TO_CARD': {
      const { id, projectId } = action.payload;
      const index = getSectionIndex(state, id, projectId);
      return removeSection(state, projectId, index);
    }
    case 'CONVERT_CARD_TO_SECTION': {
      const { newSection, containerSectionId, projectId } = action.payload;
      let index = getSectionIndex(state, containerSectionId, projectId);

      // Check if the task was originally in the uncategorised section
      if (index === 0) {
        // If so find the completed section index
        index = getSectionIndex(state, 'completed', projectId);
      }

      return addSection(state, projectId, newSection.id, index);
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
    case 'REQUEST_SECTIONS_AND_TASKS': {
      return {
        ...state,
        currentId: action.payload.id
      }
    }
    default: {
      return state;
    }
  }
}

const projects = combineReducers({
  records,
  conditions
});

export default projects;
