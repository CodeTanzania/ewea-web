import React from 'react';
import PropTypes from 'prop-types';

import rolesIcon from '../assets/icons/stakeholders/roles.svg';
import alertIcon from '../assets/icons/alerts.svg';
import notificationIcon from '../assets/icons/stakeholders/notifications.svg';
import NavigationMenu from '../components/NavigationMenu';
import modules from '../modules.json';

/* constants */
const routes = [
  {
    name: 'Roles',
    path: '/roles',
    icon: rolesIcon,
    description: modules.stakeholdersRoles,
  },
  {
    name: 'Event Types',
    path: '/eventtypes',
    icon: alertIcon,
    description: modules.alerts,
  },
  {
    name: 'Event Group',
    path: '/eventgroups',
    icon: alertIcon,
    description: modules.alerts,
  },
  {
    name: 'Event Certainty',
    path: '/eventcertainty',
    icon: alertIcon,
    description: modules.eventCertainty,
  },
  {
    name: 'Event Severity',
    path: '/eventseverity',
    icon: alertIcon,
    description: modules.eventSeverity,
  },
  {
    name: 'Notification Templates',
    path: '/notificationtemplates',
    icon: notificationIcon,
    description: modules.notificationTemplate,
  },
];

/**
 * @function
 * @name Settings
 * @description Settings module to bundle all configs UIs
 *
 * @returns {object} React component
 * @version 0.1.0
 * @since 0.1.0
 */
const Settings = ({ match }) => (
  <NavigationMenu routes={routes} match={match} />
);

Settings.propTypes = {
  match: PropTypes.shape({ url: PropTypes.string }).isRequired,
};

export default Settings;
