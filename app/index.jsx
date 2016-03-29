import React    from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'font-awesome-webpack';

import configureStore from './store';

import './style';
import Main from './layouts/Main';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <Main />
  </Provider>,
  document.getElementById('app')
);
