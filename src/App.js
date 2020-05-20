import { StoreProvider, initializeApp } from '@codetanzania/ewea-api-states';
import { isTokenValid } from '@codetanzania/ewea-api-client';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin, Alert } from 'antd';
import React from 'react';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import ReactGA from 'react-ga';
import get from 'lodash/get';

import SignIn from './Auth/components/SignIn';
import EventFeedback from './Events/EventFeedback';
import BaseLayout from './layouts/BaseLayout';
import SecureRoute from './Auth/SecureRoute';

/* configure global spin indicator */
Spin.setDefaultIndicator(<LoadingOutlined style={{ fontSize: 24 }} spin />);

const history = createBrowserHistory();
const showBanner = JSON.parse(get(process.env, 'REACT_APP_SHOW_BANNER', false));

history.listen((location) => {
  ReactGA.pageview(location.hash);
});

/**
 * @function
 * @name App
 * @description Entry component for EMIS web application
 *
 * @returns {object} React Node
 *
 * @version 0.1.0
 * @since 0.1.0
 */
const App = () => {
  if (isTokenValid) {
    // on refresh browser tab reinitialize application(redux-store) again
    initializeApp();
  }

  return (
    <StoreProvider>
      {showBanner && (
        <Alert
          message="This is a depiction of the Emergency Management Information System for the sole purpose of development and training of users. The system itself is located exclusively on government servers at DarMAERT EOC, and collected data is not accessible to any external parties"
          type="error"
          banner
          showIcon={false}
        />
      )}
      <HashRouter hashType="hashbang" history={history}>
        <Switch>
          <SecureRoute path="/app" component={BaseLayout} />
          <Route path="/signin" component={SignIn} />
          <Route path="/feedback" component={EventFeedback} />
          <Redirect to="/app" />
        </Switch>
      </HashRouter>
    </StoreProvider>
  );
};

export default App;
