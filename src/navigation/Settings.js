import React from 'react';
import PropTypes from 'prop-types';

import rolesIcon from '../assets/icons/settings/roles.svg';
import eventTypesIcon from '../assets/icons/settings/eventtypes.svg';
import eventGroupsIcon from '../assets/icons/settings/eventgroups.svg';
import notificationTemplateIcon from '../assets/icons/settings/notificationtemplate.svg';
import eventCertaintyIcon from '../assets/icons/settings/eventcertainty.svg';
import eventSeverityIcon from '../assets/icons/settings/eventseverity.svg';
import eventIndicatorIcon from '../assets/icons/settings/eventindicators.svg';
import eventQuestionsIcon from '../assets/icons/settings/eventquestions.svg';
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
    icon: eventTypesIcon,
    description: modules.alerts,
  },
  {
    name: 'Event Group',
    path: '/eventgroups',
    icon: eventGroupsIcon,
    description: modules.alerts,
  },
  {
    name: 'Event Certainty',
    path: '/eventcertainty',
    icon: eventCertaintyIcon,
    description: modules.eventCertainty,
  },
  {
    name: 'Event Questions',
    path: '/eventquestions',
    icon: eventQuestionsIcon,
    description: modules.eventQuestions,
  },
  {
    name: 'Event Severity',
    path: '/eventseverity',
    icon: eventSeverityIcon,
    description: modules.eventSeverity,
  },
  {
    name: 'Event Indicator',
    path: '/eventindicator',
    icon: eventIndicatorIcon,
    description: modules.eventIndicator,
  },
  {
    name: 'Notification Templates',
    path: '/notificationtemplates',
    icon: notificationTemplateIcon,
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
