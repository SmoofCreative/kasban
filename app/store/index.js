import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';

import reducers from '../reducers';

const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: true
});

export default function configureStore() {
  const createStoreWithMiddleware = applyMiddleware(loggerMiddleware)(createStore);
  return createStoreWithMiddleware(reducers);
}
