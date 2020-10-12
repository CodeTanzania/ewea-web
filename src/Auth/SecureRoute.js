import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isTokenValid } from '@codetanzania/ewea-api-client';
import PropTypes from 'prop-types';

/**
 * @function
 * @name SecureRoute
 * @description Route which check authentication status and route to appropriate
 *  component
 * @param {object} properties props object
 * @returns {object} React Element
 * @version 0.1.0
 * @since 0.1.0
 */
const SecureRoute = (properties) => {
  const { component: Component, ...rest } = properties;
  const isAuthenticated = isTokenValid();

  return (
    <Route
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: '/signin', state: { from: props.location } }} // eslint-disable-line
          />
        )
      }
    />
  );
};

/* props validation */
SecureRoute.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.element,
    PropTypes.node,
  ]).isRequired,
};

export default SecureRoute;
