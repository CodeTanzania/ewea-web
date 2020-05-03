import React from 'react';
import PropTypes from 'prop-types';

import rolesIcon from '../assets/icons/settings/roles.svg';
import administrativeAreasIcon from '../assets/icons/administrativeareas.svg';
import criticalFacilitiesIcon from '../assets/icons/criticalfacilities.svg';
import eventTypesIcon from '../assets/icons/settings/eventtypes.svg';
import eventGroupsIcon from '../assets/icons/settings/eventgroups.svg';
import notificationTemplateIcon from '../assets/icons/settings/notificationtemplate.svg';
import eventActionsIcon from '../assets/icons/eventactions.svg';
import eventCertaintyIcon from '../assets/icons/settings/eventcertainty.svg';
import eventSeverityIcon from '../assets/icons/settings/eventseverity.svg';
import eventIndicatorIcon from '../assets/icons/settings/eventindicators.svg';
import eventQuestionsIcon from '../assets/icons/settings/eventquestions.svg';
import eventLevelsIcon from '../assets/icons/settings/eventlevels.svg';
import emergencyFunctionsIcon from '../assets/icons/emergencyfunctions.svg';
import NavigationMenu from '../components/NavigationMenu';
import unitsIcon from '../assets/icons/settings/units.svg';
import stakeholderGroupsIcon from '../assets/icons/settings/stakeholdergroups.svg';
import eventTopicsIcon from '../assets/icons/settings/eventtopics.svg';
import eventStatusesIcon from '../assets/icons/settings/eventstatuses.svg';
import eventResponsesIcon from '../assets/icons/settings/eventresponses.svg';
import eventUrgenciesIcon from '../assets/icons/settings/eventurgencies.svg';
import administrativeLevelsIcon from '../assets/icons/settings/administrativelevels.svg';
import featureTypesIcon from '../assets/icons/settings/featuretypes.svg';
import modules from '../modules.json';

/* constants */
const routes = [
  {
    name: 'Event Actions',
    path: '/eventactions',
    icon: eventActionsIcon,
    description: modules.eventActions,
  },
  {
    name: 'Emergency Functions',
    path: '/functions',
    icon: emergencyFunctionsIcon,
  },
  {
    name: 'Critical Infrastructures',
    path: '/features',
    icon: criticalFacilitiesIcon,
    description: modules.criticalFacilities,
  },
  {
    name: 'Administrative Areas',
    path: '/administrativeareas',
    icon: administrativeAreasIcon,
    description: modules.administrativeareas,
  },
  {
    name: 'Event Types',
    path: '/eventtypes',
    icon: eventTypesIcon,
    description: modules.alerts,
  },
  {
    name: 'Event Groups',
    path: '/eventgroups',
    icon: eventGroupsIcon,
    description: modules.alerts,
  },
  {
    name: 'Stakeholder Roles',
    path: '/roles',
    icon: rolesIcon,
    description: modules.stakeholdersRoles,
  },
  {
    name: 'Stakeholder Groups',
    path: '/stakeholdergroups',
    icon: stakeholderGroupsIcon,
    description: modules.stakeholderGroups,
  },
  {
    name: 'Agencies Ownerships',
    path: '/agenciesownerships',
    icon: stakeholderGroupsIcon,
    description: modules.stakeholderGroups,
  },
  {
    name: 'Event Questions',
    path: '/eventquestions',
    icon: eventQuestionsIcon,
    description: modules.eventQuestions,
  },
  {
    name: 'Event Topics',
    path: '/eventtopics',
    icon: eventTopicsIcon,
    description: modules.eventTopics,
  },
  {
    name: 'Event Indicators',
    path: '/eventindicator',
    icon: eventIndicatorIcon,
    description: modules.eventIndicator,
  },
  {
    name: 'Event Levels',
    path: '/eventlevels',
    icon: eventLevelsIcon,
    description: modules.eventLevels,
  },
  {
    name: 'Event Severities',
    path: '/eventseverity',
    icon: eventSeverityIcon,
    description: modules.eventSeverity,
  },
  {
    name: 'Event Certainties',
    path: '/eventcertainty',
    icon: eventCertaintyIcon,
    description: modules.eventCertainty,
  },
  {
    name: 'Event Statuses',
    path: '/eventstatuses',
    icon: eventStatusesIcon,
    description: modules.eventStatuses,
  },
  {
    name: 'Event Urgencies',
    path: '/eventurgencies',
    icon: eventUrgenciesIcon,
    description: modules.eventUrgencies,
  },
  {
    name: 'Event Responses',
    path: '/eventresponses',
    icon: eventResponsesIcon,
    description: modules.eventResponses,
  },
  {
    name: 'Administrative Levels',
    path: '/administrativelevels',
    icon: administrativeLevelsIcon,
    description: modules.eventResponses,
  },
  {
    name: 'Feature Types',
    path: '/featuretypes',
    icon: featureTypesIcon,
    description: modules.eventResponses,
  },
  {
    name: 'Units',
    path: '/units',
    icon: unitsIcon,
    description: modules.units,
  },
  {
    name: 'Vehicle Makes',
    path: '/vehiclemakes',
    icon: unitsIcon,
    description: modules.units,
  },
  {
    name: 'Vehicle Models',
    path: '/vehiclemodels',
    icon: unitsIcon,
    description: modules.units,
  },
  {
    name: 'Vehicle Types',
    path: '/vehicletypes',
    icon: unitsIcon,
    description: modules.units,
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
