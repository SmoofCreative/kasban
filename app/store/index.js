import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import _debounce from 'lodash/debounce';

import reducers from '../reducers';
import AsanaClient from '../utils/AsanaClient';
import Actions from '../actions'

const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: true
});

export default function configureStore() {
  const createStoreWithMiddleware = applyMiddleware(loggerMiddleware, thunk)(createStore);
  const store = createStoreWithMiddleware(reducers)

  store.subscribe(() => {
    let currentState = store.getState();

    /**
     * Persist state.
     * There are fancy ways to store, like https://www.npmjs.com/package/redux-storage
     * but tbh, just a store listener on one end, and an initialState lookup
     * is all we need :)
     *
     * This can get pretty thrashy here as we're subscribing to every state
     * update, hence we use _debounce.
     */
    if (currentState.auth.isAsanaAuthed) {
      _debounce(()=>{
        console.log('save')
        localStorage.setItem('boards', JSON.stringify(currentState.boards));
      }, 300)
    }
  })


  store.subscribe(() => {
    let currentState = store.getState();

    if (currentState.boards.currentProjectId) {
      _debounce(()=>{
        const cid = currentState.boards.currentProjectId

        AsanaClient.events.stream(cid, {
          periodSeconds: 3,
          continueOnError: true
        })
        .on('data', (event) => {
          console.log('asana event', event)

          // one could figure out the diff... or just re-poll the project
          store.dispatch({
            type: 'RECEIVE_EVENT'
          });

          store.dispatch(Actions.getTasks(cid));
        })
      }, 1000)
    }
  })

  return store;
}
