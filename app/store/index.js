import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import _debounce from 'lodash/debounce';

import reducers from '../reducers';

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

  return store;
}
