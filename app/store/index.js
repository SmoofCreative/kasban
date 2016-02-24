import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';

import reducers from '../reducers';

const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: true
});

export default function configureStore() {
  const createStoreWithMiddleware = applyMiddleware(loggerMiddleware, thunk)(createStore);
  return createStoreWithMiddleware(reducers);
}
