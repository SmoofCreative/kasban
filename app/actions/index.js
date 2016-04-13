import querystringify from 'querystringify';
import uuid from 'uuid';
import Promise from 'bluebird';

import { oneHourFromNow } from '../utils';
import AsanaClient from '../utils/AsanaClient';

import Task from './task';
import Project from './project';
import Workspace from './workspace';

const Actions = {};

const storeWorkspace = (dispatch, workspace) => {
  dispatch({
    type: 'ADD_WORKSPACE',
    payload: {
      id: workspace.id,
      workspace: workspace
    }
  });
};

const formatProjects = (projects) => {
  let formattedProjects = {}

  for (let i = 0; i < projects.length; i++) {
    let project = projects[i];
    formattedProjects = {
      ...formattedProjects,
      [project.id]: {
        ...project,
        sections: []
      }
    };
  }
  return formattedProjects;
};

const storeProjects = (dispatch, workspaceId, projects) => {
  if (projects.length) {
    const formattedProjects = formatProjects(projects);
    dispatch({
      type: 'ADD_PROJECTS',
      payload: {
        projects: formattedProjects,
        workspaceId: workspaceId
      }
    });
  }
};

const formatSections = (sections) => {
  let formattedSections = {}

  for (let i = 0; i < sections.length; i++) {
    let section = sections[i];
    formattedSections = {
      ...formattedSections,
      [section.id]: {
        ...section,
        cards: []
      }
    };
  }
  return formattedSections;
};

const storeSections = (dispatch, projectId, sections) => {
  if (sections.length) {
    const formattedSections = formatSections(sections);
    dispatch({
      type: 'ADD_SECTIONS',
      payload: {
        sections: formattedSections,
        projectId: projectId
      }
    });
  }
};

const storeCard = (dispatch, parentId, card) => {
  // Cloning so we can remove the none normalised subtasks
  // They are populated elsewhere
  const clonedCard = { ...card, subtasks: [] };

  dispatch({
    type: 'ADD_CARD',
    payload: {
      id: clonedCard.id,
      card: clonedCard,
      parentId: parentId
    }
  });
};

const formatSubTasks = (subtasks) => {
  let formattedSubTasks = {}

  for (let i = 0; i < subtasks.length; i++) {
    let subtask = subtasks[i];
    formattedSubTasks = {
      ...formattedSubTasks,
      [subtask.id]: {
        ...subtask,
        subtasks: [],
        comments: []
      }
    };
  }
  return formattedSubTasks;
};

const storeSubtasks = (dispatch, cardId, subtasks, addToTop = false) => {
  if (subtasks.length) {
    const formattedSubTasks = formatSubTasks(subtasks);
    dispatch({
      type: 'ADD_SUBTASKS',
      payload: {
        subtasks: formattedSubTasks,
        cardId: cardId,
        addToTop: addToTop
      }
    });
  }
};

const formatCards = (cards) => {
  let formattedCards = {}

  for (let i = 0; i < cards.length; i++) {
    let card = cards[i];
    formattedCards = {
      ...formattedCards,
      [card.id]: {
        ...card,
        subtasks: [],
        comments: []
      }
    };
  }
  return formattedCards;
};

const storeCards = (dispatch, sectionId, cards) => {
  if (cards.length) {
    const formattedCards = formatCards(cards);
    dispatch({
      type: 'ADD_CARDS',
      payload: {
        cards: formattedCards,
        sectionId: sectionId
      }
    });
  }
};

const formatComments = (comments) => {
  let formattedComments = {}

  for (let i = 0; i < comments.length; i++) {
    let comment = comments[i];
    formattedComments = {
      ...formattedComments,
      [comment.id]: {
        ...comment
      }
    };
  }
  return formattedComments;
};

const storeComments = (dispatch, cardId, comments) => {
  if (comments.length) {
    const formattedComments = formatComments(comments);

    dispatch({
      type: 'ADD_COMMENTS',
      payload: {
        comments: { ...formattedComments },
        cardId: cardId
      }
    });
  }
};

const getTasksForProject = (dispatch, id) => {
  const project = Project(id);
  project.getTasks(AsanaClient)
  .then((tasks) => {
    addSectionsAndCards(dispatch, id, tasks);
  })
  .then(() => {
    dispatch({ type: 'RECEIVED_SECTIONS_AND_TASKS' })
  });
};

const moveSection = (dispatch, sectionId, projectId, index) => {
  dispatch({
    type: 'MOVE_SECTION',
    payload: {
      sectionId: sectionId,
      projectId: projectId,
      index: index
    }
  });
};

const isSection = (item) => {
  return item.name.slice(-1) === ':';
};

const updateCard = (dispatch, card) => {

  let clonedCard = { ...card };

  // Remove all subtasks which arent ids
  if (typeof card.subtasks !== 'undefined' && card.subtasks.length) {
    const subtasks = card.subtasks.filter((subtask) => {
      typeof subtask === 'number';
    });

    clonedCard = { ...card, subtasks: subtasks };
  }

  dispatch({
    type: 'UPDATE_CARD',
    payload: {
      id: card.id,
      card: clonedCard
    }
  });
};

const updateSection = (dispatch, section) => {
  dispatch({
    type: 'UPDATE_SECTION',
    payload: {
      id: section.id,
      section: section
    }
  });
};

const removeCard = (dispatch, cardId, sectionId) => {
  dispatch({
    type: 'REMOVE_CARD',
    payload: {
      sectionId: sectionId,
      id: cardId
    }
  });
};

const removeSubtask = (dispatch, cardId, parentId) => {
  dispatch({
    type: 'REMOVE_SUBTASK',
    payload: {
      parentId: parentId,
      id: cardId
    }
  });
}

const completeCard = (dispatch, taskId) => {
  dispatch({ type: 'COMPLETING_CARD', payload: { id: taskId } });

  const task = Task(AsanaClient, taskId);
  task.complete()
    .then(() => { dispatch({ type: 'COMPLETED_CARD_SUCCESS' }); })
    .catch(() => { dispatch({ type: 'COMPLETED_CARD_FAILED' }); });
};


/*
 We want to format the sections and cards in the action rather than passing each one
 to the reducer as this was blocking the UI.

 The function works on the assumtion that each card in a section has a section membership (from asana).
 If the card has no section membership then we know it's either uncategorised or completed. To determine this
 we check for the `completed` property.

 - Go through each task in the list
 - Determine if it is a section; add it to the relevant array
 - Push the sections
 - Push the tasks
 - Push the subtasks (base tasks need to be in place first)
*/
const addSectionsAndCards = (dispatch, projectId, tasks) => {
  let sections = [];
  let sectionCards = {};

  sections.unshift({ id: 'completed', name: 'Completed', completed: true, cards: [] });
  sectionCards = { ...sectionCards, 'completed': [] };

  sections.unshift({ id: 'uncategorised', name: 'Uncategorised:', completed: false, cards: [] });
  sectionCards = { ...sectionCards, 'uncategorised': [] };

  if (tasks.length) {
    for (let item of tasks) {
      if (isSection(item)) {
        sections.unshift({ ...item, cards: [] });
        sectionCards = { ...sectionCards, [item.id]: [] };
        continue;
      }

      if (item.completed) {
        sectionCards['completed'].push(item);
        continue;
      }

      if (item.memberships.length) {
        if (item.memberships[0].section !== null) {
          let sectionId = item.memberships[0].section.id;
          sectionCards[sectionId].push(item);
          continue;
        }
      }

      // If here, the task is not completed nor in a section
      sectionCards['uncategorised'].push(item);
    }
  }

  // Store our sections
  storeSections(dispatch, projectId, sections);

  // Iterate over each section and add its cards
  for(let key in sectionCards) {
   if (sectionCards.hasOwnProperty(key)) {
      storeCards(dispatch, key, sectionCards[key]);
   }
  }

  // Move the uncategorised column to the front
  moveSection(dispatch, 'uncategorised', projectId, 0)
};

const getCommentsForTask = (dispatch, id) => {
  const task = Task(AsanaClient, id);
  task.getComments()
  .then((comments) => {
    storeComments(dispatch, id, comments);
    dispatch({ type: 'FETCHING_STORIES_FOR_TASK_SUCCESS' });
  })
  .catch((err) => { console.log(err); dispatch({ type: 'FETCHING_STORIES_FOR_TASK_FAILED' }); });
};

const getTaskInformation = (dispatch, id, projectId) => {
  const task = Task(AsanaClient, id);

  dispatch({ type: 'FETCHING_UPDATED_TASK_INFORMATION '});

  Promise.all([task.getInformation(), task.getComments(), task.getSubTasks()])
  .spread((taskInformation, taskComments, taskSubTasks) => {
    updateCard(dispatch, taskInformation);

    if (taskInformation.completed) {
      // Move the card to the completed section

      const cardToMove = {
        id: taskInformation.id,
        sectionId: taskInformation.memberships[0].section.id
      };

      const cardToInsertAfter = {
        id: null,
        sectionId: 'completed'
      };

      dispatch({
        type: 'MOVE_CARD',
        payload: {
          cardToMove: cardToMove,
          cardToInsertAfter: cardToInsertAfter
        }
      });
    }

    storeSubtasks(dispatch, taskSubTasks.id, taskSubTasks.subtasks, false);
    storeComments(dispatch, id, taskComments);

    dispatch({ type: 'FETCHING_UPDATED_TASK_INFORMATION_SUCCESS'});
  })
  .catch(() => {
    // If we fail, reload the project
    getTasksForProject(dispatch, projectId);
    dispatch({ type: 'FETCHING_UPDATED_TASK_INFORMATION_FAILED '});
  });
};

Actions.getWorkspaces = () => {
  return (dispatch) => {
    dispatch({ type: 'REQUEST_WORKSPACES_AND_PROJECTS' });
    const workspace = Workspace();

    workspace.getWorkspaces(AsanaClient)
    .then((workspaces) => {
      workspaces.map((ws) => {
        storeWorkspace(dispatch, ws);
        workspace.getProjects(ws.id, AsanaClient)
        .then((projects) => {
          storeProjects(dispatch, ws.id, projects);
        });
      });

      // Return null as otherwise we get a warning about not returning promises
      return null;
    })
    .then(() => {
      dispatch({ type: 'RECEIVED_WORKSPACES_AND_PROJECTS' });
    });
  };
};

Actions.createTask = (params) => {
  return (dispatch) => {
    // Generate a temporary id to use for adding to store
    const cardId = uuid.v4();

    let { taskDetails, sectionId, projectId } = params;

    // Store this so we can differentiate between asana and our own stores
    let asanaSectionId = sectionId;

    taskDetails.id = cardId;

    // Store the card locally
    storeCard(dispatch, sectionId, taskDetails);

    if (sectionId == 'completed') {
      taskDetails.completed = true;
    }

    if (sectionId == 'uncategorised' || sectionId == 'completed') {
      asanaSectionId = null
    }

    taskDetails.projects = [projectId];

    taskDetails.memberships = [{
      section: asanaSectionId,
      project: projectId
    }];

    const task = Task(AsanaClient);
    task.create(taskDetails)
      .then((data) => {
        storeCard(dispatch, sectionId, data);
        removeCard(dispatch, cardId, sectionId);
      })
      .catch(() => { dispatch({ type: 'ADD_CARD_FAILED' }); });
  };
};

Actions.createSubTask = (params) => {
  return (dispatch) => {
    // Generate a temporary id to use for adding to store
    const cardId = uuid.v4();

    let { taskDetails, parentId } = params;

    taskDetails.id = cardId;

    // Store the card locally
    storeSubtasks(dispatch, parentId, [taskDetails], true);

    const task = Task(AsanaClient, parentId);
    task.createSubTask(taskDetails)
      .then((data) => {
        storeSubtasks(dispatch, parentId, [data], true);
        removeSubtask(dispatch, cardId, parentId);
      })
      .catch(() => { removeSubtask(dispatch, cardId, parentId); });
  };
};

Actions.updateTask = (params) => {
  return (dispatch) => {
    let { taskDetails, updateAsana } = params;
    updateCard(dispatch, taskDetails);

    if (updateAsana) {
      const task = Task(AsanaClient, taskDetails.id);
      task.update(taskDetails)
        .then(() => { dispatch({ type: 'UPDATING_CARD_SUCCESS' }); })
        .catch(() => { dispatch({ type: 'UPDATING_CARD_FAILED' }); });
    }
  };
};

Actions.updateSection = (params) => {
  return (dispatch) => {
    let { details, updateAsana } = params;
    updateSection(dispatch, details);

    if (updateAsana) {
      const task = Task(AsanaClient, details.id);
      task.update(details)
        .then(() => { dispatch({ type: 'UPDATING_CARD_SUCCESS' }); })
        .catch(() => { dispatch({ type: 'UPDATING_CARD_FAILED' }); });
    }
  };
};

Actions.moveCard = (cardToMove, cardToInsertAfter, projectId) => {
  return (dispatch) => {
    if (cardToInsertAfter.completed) {
      completeCard(dispatch, cardToMove.id);
    }

    if (cardToMove.id === cardToInsertAfter.id) {
      dispatch({ type: 'MOVED_CARD_SELF' });
    } else {
      dispatch({
        type: 'MOVE_CARD',
        payload: {
          cardToMove: cardToMove,
          cardToInsertAfter: cardToInsertAfter
        }
      });

      let data = {
        projectId: projectId,
        insertAfter: null
      };

      if (cardToInsertAfter) {
        if (!cardToInsertAfter.completed && cardToInsertAfter.id !== 'uncategorised') {
          data.insertAfter = cardToInsertAfter.id
        }
      }

      const task = Task(AsanaClient, cardToMove.id);
      task.move(data)
      .then(() => { dispatch({ type: 'MOVED_CARD_SUCCESS' }); })
      .catch(() => { dispatch({ type: 'MOVED_CARD_FAILED' }); })
    }
  };
};

Actions.getInitialTasksForProject = (id) => {
  return (dispatch) => {
    dispatch({
      type: 'REQUEST_SECTIONS_AND_TASKS',
      payload: { id: id }
    });

    getTasksForProject(dispatch, id);
  };
};

Actions.updateTasksForProject = (id) => {
  return (dispatch) => {
    dispatch({ type: 'UPDATE_SECTIONS_AND_TASKS' });
    getTasksForProject(dispatch, id);
  };
}

Actions.getComments = ({ id }) => {
  return (dispatch) => {
    dispatch({ type: 'FETCHING_STORIES_FOR_TASK' });
    getCommentsForTask(dispatch, id);
  }
}

Actions.getTask = (id, projectId) => {
  return (dispatch) => {
    dispatch({ type: 'FETCHING_TASK_INFORMATION' });
    getTaskInformation(dispatch, id, projectId);
  }
}

Actions.checkAuth = () => {
  return (dispatch) => {

    dispatch({
      type: 'STARTING_ASANA_AUTH'
    });

    // The access_token is returned from Asana in a url hash --> /#access_token=XXXXXX
    // Lop off the # and parse the params
    let params = querystringify.parse(location.hash.slice(1))

    /**
     * Asana redirect_uri action - just set token to local storage and bail.
     */
    if (typeof params.access_token !== 'undefined') {
      localStorage.setItem('access_token', params.access_token);
      localStorage.setItem('token_death', oneHourFromNow());
      document.location = '/';
      return;
    }

    /**
     * Check token age
     * If the token isn't dead yet, we can try using it.
     */
    if ( localStorage.getItem('access_token') &&
         parseInt(localStorage.getItem('token_death')) > Date.now()
        ) {
          // we 'assume' they are authed
          dispatch({
            type: 'ASANA_AUTH_COMPLETE',
            payload: {
              isAsanaAuthed: true
            }
          });

          // FIXME: is there a way to try/catch a dispatch?
          dispatch(Actions.getWorkspaces());

          return;
    }

    /**
     * Update outdated stored token
     * If a token exists and we haven't already bailed, then we need to reauth
     */
    else if ( localStorage.getItem('access_token') ) {
      AsanaClient
        .authorize()
        .then(() => {

          localStorage.setItem('access_token', AsanaClient.dispatcher.authenticator.credentials.access_token);
          localStorage.setItem('token_death', oneHourFromNow());

          dispatch({
            type: 'ASANA_AUTH_COMPLETE',
            payload: {
              isAsanaAuthed: true
            }
          });

          dispatch(Actions.getWorkspaces());

        });

    /**
     * No token
     * Probably haven't clicked the Auth button
     */
    } else {
      dispatch({
        type: 'ASANA_AUTH_COMPLETE',
        payload: {
          isAsanaAuthed: false
        }
      });
    }
  };
};

Actions.doAuth = () => {
  return () => {
    AsanaClient.authorize();
  }
}

export default Actions;
