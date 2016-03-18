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

const addWorkspace = (state, { id, name }) => {
  // Check if the workspace already exists
  const exists = state.workspaces.filter((workspace) => {
    return workspace.id == id;
  }).length;

  if (!exists) {
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
  let workspaceIndex = null;

  const workspaceExists = state.workspaces.filter((workspace, index) => {
    workspaceIndex = index;
    return workspace.id == workspaceId;
  }).length;

  if (workspaceExists) {
    // Here we're going to blindly overwrite the current projects
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
  const workspaces = state.workspaces;

  let projectIndex = null;
  let workspaceIndex = null;
  let exists = false;

  // Loop through each workspace until we find the one passed in
  for(let i = 0; i < workspaces.length; i++) {
    if (exists) {
      break;
    }

    workspaceIndex = i;
    if (workspaces[workspaceIndex].id == workspaceId) {

      // Loop through each project until we find the one passed in
      for(let j = 0; j < workspaces[workspaceIndex].projects.length; j++) {
        projectIndex = j;

        if (workspaces[workspaceIndex].projects[j].id == projectId) {
          exists = true;
          break;
        }
      }
    }
  }

  if (exists) {
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

  // Get the workspace
  const workspace = state.workspaces.filter((ws, index) => {
    if (ws.id == workspaceId) {
      coords.workspace = index;
      return ws;
    }
  })[0];

  // Get the project
  const project = workspace.projects.filter((p, index) => {
    if (p.id == projectId) {
      coords.project = index;
      return p;
    }
  })[0];

  for (let sectionIndex = 0; sectionIndex < project.sections.length; sectionIndex++) {
    let section = project.sections[sectionIndex];

    // Check if the id to move to is a section
    if (section.id === cardId) {
      coords.section = sectionIndex;
      coords.card = 0;
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

const getWorkspace = (workspaces, workspaceId) => {
  return workspaces.filter((ws) => {
    return ws.id == workspaceId;
  })[0];
};

const getProject = (projects, projectId) => {
  return projects.filter((p) => {
    return p.id == projectId;
  })[0];
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

      const toMoveCoords = findCardPosition(state, currentWorkspaceId, currentProjectId, idToMove);
      const toInsertAfterCoords = findCardPosition(state, currentWorkspaceId, currentProjectId, idToInsertAfter);

      const workspace = getWorkspace(state.workspaces, currentWorkspaceId);
      const project = getProject(workspace.projects, currentProjectId);
      const card = project.sections[toMoveCoords.section].cards[toMoveCoords.card];

      const newState = removeCard(state, toMoveCoords.workspace, toMoveCoords.project, toMoveCoords.section, toMoveCoords.card);
      return insertCard(newState, toInsertAfterCoords.workspace, toInsertAfterCoords.project, toInsertAfterCoords.section, toInsertAfterCoords.card, card);
    }
    case 'CREATING_TASK': {
      const { task, sectionId } = action.payload;
      const { currentWorkspaceId, currentProjectId } = state;

      const toInsertAfterCoords =  findCardPosition(state, currentWorkspaceId, currentProjectId, sectionId);

      return insertCard(state, toInsertAfterCoords.workspace, toInsertAfterCoords.project, toInsertAfterCoords.section, toInsertAfterCoords.card, task);
    }
    default: {
      return state;
    }
  }
}
