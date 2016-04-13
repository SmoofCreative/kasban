import { combineReducers } from 'redux'
import update from 'react/lib/update';

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
    case 'ADD_PROJECTS': {
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
      const { projectId, id } = action.payload;

      // If the id already exists return what we already have
      if (state[projectId].sections.indexOf(id) !== -1) {
        return state;
      }

      return update(state, {
        [action.payload.projectId]: {
          sections: {
            $set: [action.payload.id, ...state[action.payload.projectId].sections]
          }
        }
      });
    }
    case 'ADD_SECTIONS': {
      const { sections, projectId } = action.payload;

      let sectionIds = [];

      // Go through each comment and check if it doesnt already exists
      for(let key in sections) {
        if(sections.hasOwnProperty(key)) {
          key = isNaN(parseInt(key)) ? key : parseInt(key);
          if (state[projectId].sections.indexOf(key) === -1) {
            sectionIds.push(key);
          }
        }
      }

      return update(state, {
        [projectId]: {
          sections: {
            $push: [...sectionIds]
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
