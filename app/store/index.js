import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import _debounce from 'lodash/debounce';

import reducers from '../reducers';
// import AsanaClient from '../utils/AsanaClient';
import AsanaEventPoller from './AsanaEventPoller';
// import Actions from '../actions';

const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: true
});

export default function configureStore() {
  const createStoreWithMiddleware = applyMiddleware(loggerMiddleware, thunk)(createStore);
  const store = createStoreWithMiddleware(reducers)

  store.subscribe(() => {
    /**
     * Persist state.
     * There are fancy ways to store, like https://www.npmjs.com/package/redux-storage
     * but tbh, just a store listener on one end, and an initialState lookup
     * is all we need :)
     *
     * This can get pretty thrashy here as we're subscribing to every state
     * update, hence we use _debounce.
     */
    function persistBoardsState (currentState) {
      console.log('localstore save')
      localStorage.setItem('boards', JSON.stringify(currentState.boards));
    }

    let currentState = store.getState();
    if (currentState.auth.isAsanaAuthed) {
      _debounce(persistBoardsState, 300);
      persistBoardsState(currentState);
    }

  })

  /**
   * Asana Events Polling
   */
  // Reference copy of state before we update it.
  let stateTracker = store.getState();

  const poller = AsanaEventPoller(store);
  poller.init(stateTracker.boards.currentWorkspaceId, stateTracker.boards.currentProjectId);
  poller.start();

  store.subscribe(() => {
    // Any time there's a state update, we want to see if the projectId has changed.
    // So refer check against reference state.
    let currentState = store.getState();
    if (currentState.boards.currentProjectId !== stateTracker.boards.currentProjectId ) {
      poller.changeProject(currentState.boards.currentWorkspaceId, currentState.boards.currentProjectId);
      // Update the reference state for next time!
      stateTracker = currentState;
    }
  })

  return store;
}
