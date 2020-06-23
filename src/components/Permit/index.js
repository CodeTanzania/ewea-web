import PropTypes from 'prop-types';
import { Connect } from '@codetanzania/ewea-api-states';

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
