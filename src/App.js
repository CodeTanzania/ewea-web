import { StoreProvider, initializeApp } from '@codetanzania/ewea-api-states';
import { isTokenValid } from '@codetanzania/ewea-api-client';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React from 'react';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import SignIn from './Auth/components/SignIn';
import BaseLayout from './layouts/BaseLayout';
import SecureRoute from './Auth/SecureRoute';

/* configure global spin indicator */
Spin.setDefaultIndicator(<LoadingOutlined style={{ fontSize: 24 }} spin />);

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
      <HashRouter hashType="hashbang">
        <Switch>
          <SecureRoute path="/app" component={BaseLayout} />
          <Route path="/signin" component={SignIn} />
          <Redirect to="/app" />
        </Switch>
      </HashRouter>
    </StoreProvider>
  );
};

export default App;
