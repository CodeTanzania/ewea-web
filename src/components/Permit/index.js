import PropTypes from 'prop-types';
import { Connect } from '@codetanzania/ewea-api-states';

/**
 * @function
 * @name Permit
 * @description Component which controls visibility of child components based on
 * user permissions
 * @param {object} props Component object properties
 * @param {string} props.withPermission Permission wildcard which controls
 * visibility of children components
 * @param {string[]} props.userPermissions List of active user permissions
 * @param {object|object[]} props.children Wrapped Components (React Nodes)
 * @returns {object|undefined} React nodes
 * @version 0.1.0
 * @since 0.1.0
 * @example
 *
 * <Permit withPermission="events:list">
 *   {...children}
 * </Permit>
 */
const Permit = ({ withPermission, userPermissions, children }) => {
  return userPermissions.includes(withPermission) && children;
};

Permit.propTypes = {
  withPermission: PropTypes.string.isRequired,
  userPermissions: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.oneOf([PropTypes.node, PropTypes.element]),
};

Permit.defaultProps = {
  userPermissions: [],
};

export default Connect(Permit, {
  userPermissions: 'app.permissions',
});
