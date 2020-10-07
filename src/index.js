import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import get from 'lodash/get';
import App from './App';
import './index.css';
import * as serviceWorker from './serviceWorker';

/* for google analytics */
const TRACKING_ID = get(process.env, 'REACT_APP_GA_ID');
if (TRACKING_ID) {
  ReactGA.initialize(TRACKING_ID);
}

const render = (Component) => {
  ReactDOM.render(<Component />, document.getElementById('root')); // eslint-disable-line
};

render(App);

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default; // eslint-disable-line  global-require
    render(NextApp);
  });
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
