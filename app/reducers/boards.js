import update from 'react/lib/update';

let initialState = {}

const persistedState = false; //localStorage.getItem('boards');

if (persistedState) {
  initialState = JSON.parse(persistedState)
} else {
  initialState = {
    workspaces: [],
    currentProjectId: null,
    currentWorkspaceId: null
  }
}

const removeCard = (state, workspaceIndex, projectIndex, sectionIndex, listIndex) => {
  return update(state, {
    workspaces: {
      [workspaceIndex]: {
        projects: {
          [projectIndex]: {
            sections: {
              [sectionIndex]: {
                cards: {
                  $splice: [[listIndex, 1]]
                }
              }
            }
          }
        }
      }
    }
  });
};

const insertCard = (state, workspaceIndex, projectIndex, sectionIndex, listIndex, card) => {
  return update(state, {
    workspaces: {
      [workspaceIndex]: {
        projects: {
          [projectIndex]: {
            sections: {
              [sectionIndex]: {
                cards: {
                  $splice: [[listIndex, 0, card]]
                }
              }
            }
          }
        }
      }
    }
  });
};

const getWorkspace = (workspaces, workspaceId) => {
  let result = {};

  result.data = workspaces.filter((ws, index) => {
    if (ws.id == workspaceId) {
      result.index = index;
      return ws;
    }
  })[0];

  return result;
};

const getProject = (projects, projectId) => {
  let result = {};

  result.data = projects.filter((p, index) => {
    if (p.id == projectId) {
      result.index = index;
      return p;
    }
  })[0];

  return result;
};

const getSection = (sections, sectionId) => {
  let result = {};

  result.data = sections.filter((s, index) => {
    if (s.id == sectionId) {
      result.index = index;
      return s;
    }
  })[0];

  return result;
};

const addWorkspace = (state, { id, name }) => {
  // Get the workspace
  const workspace = getWorkspace(state.workspaces, id);
  let workspaceIndex = workspace.index;

  if (typeof workspaceIndex === 'undefined') {
    // Add the new workspace
    return update(state, {
      workspaces: {
        $push: [{
          id: id,
          name: name,
          projects: []
        }]
      }
    });

  } else {
    // Already exists so return what we initially had
    return state;
  }
};

const addProjects = (state, workspaceId, projects) => {
  // Get the workspace
  const workspace = getWorkspace(state.workspaces, workspaceId);
  let workspaceIndex = workspace.index;

  if (typeof workspaceIndex !== 'undefined') {
    // Here we're going to overwrite the current projects
    return update(state, {
      workspaces: {
        [workspaceIndex]: {
          projects: {
            $set: projects
          }
        }
      }
    });
  } else {
    // If it doesn't exist return the state we were given
    return state;
  }
};

const setCurrentProject = (state, workspaceId, projectId) => {
  return update(state, {
    currentProjectId: {
      $set: projectId
    },
    currentWorkspaceId: {
      $set: workspaceId
    }
  });
}

const addSections = (state, workspaceId, projectId, sections) => {

  // Get the workspace
  const workspace = getWorkspace(state.workspaces, workspaceId);
  let workspaceIndex = workspace.index;

  // Get the project
  const project = getProject(workspace.data.projects, projectId);
  let projectIndex = project.index;

  if (typeof workspaceIndex !== 'undefined' && typeof projectIndex !== 'undefined') {
    return update(state, {
      workspaces: {
        [workspaceIndex]: {
          projects: {
            [projectIndex]: {
              sections: {
                $set: sections
              }
            }
          }
        }
      }
    })
  } else {
    return state;
  }
}

/*
  Returns the XY position of a card in a project
  X: Section Index
  Y: Card Index
*/
const findCardPosition = (state, workspaceId, projectId, cardId) => {
  /*
    1. Find the workspace
    2. Find the project
    3. Find and store the section index
    4. Find and store the card index
    5. Return the cards index
  */

  let coords = {};

  coords.isSection = false;

  // Get the workspace
  const workspace = getWorkspace(state.workspaces, workspaceId);
  coords.workspace = workspace.index;

  // Get the project
  const project = getProject(workspace.data.projects, projectId);
  coords.project = project.index;

  for (let sectionIndex = 0; sectionIndex < project.data.sections.length; sectionIndex++) {
    let section = project.data.sections[sectionIndex];

    // Check if the id to move to is a section
    if (section.id === cardId) {
      coords.section = sectionIndex;
      coords.card = 0;
      coords.isSection = true;
    }

    for (let listIndex = 0; listIndex < section.cards.length; listIndex++) {
      let card = section.cards[listIndex];

      if (card.id === cardId) {
        coords.section = sectionIndex;
        coords.card = listIndex;
      }
    }
  }

  return coords;
};


export default function boards(state = initialState, action) {

  switch (action.type) {
    case 'RECEIVED_WORKSPACES_AND_PROJECTS': {
      const { workspace, projects } = action.payload;

      // First add the workspace if it doesn't already exist
      const addedWorkspaceState = addWorkspace(state, workspace);

      // Now add the projects to the workspace
      const addedProjectState = addProjects(addedWorkspaceState, workspace.id, projects);

      return addedProjectState;
    }
    case 'REQUEST_SECTIONS_AND_TASKS': {
      const { workspaceId, projectId } = action.payload;
      return setCurrentProject(state, workspaceId, projectId);
    }
    case 'RECEIVED_SECTIONS_AND_TASKS': {
      const { workspaceId, projectId, sections } = action.payload;
      return addSections(state, workspaceId, projectId, sections);
    }
    case 'MOVING_TASK': {
      const { idToMove, idToInsertAfter } = action.payload;
      const { currentWorkspaceId, currentProjectId } = state;

      // First find the exisitng card, store a version of it and remove it from the list
      const toMoveCoords = findCardPosition(state, currentWorkspaceId, currentProjectId, idToMove);

      const workspace = getWorkspace(state.workspaces, currentWorkspaceId).data;
      const project = getProject(workspace.projects, currentProjectId).data;
      const card = project.sections[toMoveCoords.section].cards[toMoveCoords.card];
      const newState = removeCard(state, toMoveCoords.workspace, toMoveCoords.project, toMoveCoords.section, toMoveCoords.card);

      // Now find the card to insert it after and insert our stored version
      const toInsertAfterCoords = findCardPosition(newState, currentWorkspaceId, currentProjectId, idToInsertAfter);

      toInsertAfterCoords.card = toInsertAfterCoords.isSection === true ? 0 : toInsertAfterCoords.card + 1;

      return insertCard(newState, toInsertAfterCoords.workspace, toInsertAfterCoords.project, toInsertAfterCoords.section, toInsertAfterCoords.card, card);
    }
    case 'CREATING_TASK': {
      const { task, sectionId } = action.payload;
      const { currentWorkspaceId, currentProjectId } = state;

      const toInsertAfterCoords = findCardPosition(state, currentWorkspaceId, currentProjectId, sectionId);

      const workspace = getWorkspace(state.workspaces, currentWorkspaceId).data;
      const project = getProject(workspace.projects, currentProjectId).data;
      const section = getSection(project.sections, sectionId).data;

      return insertCard(state, toInsertAfterCoords.workspace, toInsertAfterCoords.project, toInsertAfterCoords.section, section.cards.length, task);
    }
    default: {
      return state;
    }
  }
}
