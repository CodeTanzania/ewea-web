import React from 'react';
import dashboardIcon from '../assets/icons/dashboards.svg';
import settingsIcon from '../assets/icons/alerts/servicerequest.svg';
import eventActionsIcon from '../assets/icons/emergencyplans/planner.svg';
import geographicalFeaturesIcon from '../assets/icons/geographicalfeatures.svg';
import agenciesIcon from '../assets/icons/stakeholders/agency.svg';
import contactsIcon from '../assets/icons/stakeholders/contacts.svg';
import NavigationMenu from '../components/NavigationMenu';
import functionIcon from '../assets/icons/emergencyplans.svg';
import modules from '../modules.json';
import issuedAlertsIcon from '../assets/icons/alerts/issuedalerts.svg';
import alertIcon from '../assets/icons/alerts.svg';
import actionsIcon from '../assets/icons/alerts/actions.svg';
import actionCatalogIcon from '../assets/icons/alerts/actioncatalog.svg';

/* constants */
const routes = [
  {
    name: 'Events',
    path: '/app/events',
    icon: issuedAlertsIcon,
    description: modules.alertsIssued,
  },
  {
    name: 'Events Actions',
    path: '/app/eventactions',
    icon: eventActionsIcon,
    description: modules.eventActions,
  },
  {
    name: 'Actions Taken',
    path: '/app/actions',
    icon: actionsIcon,
    description: modules.alertsActions,
  },
  {
    name: 'Emergency Functions',
    path: '/app/functions',
    icon: functionIcon,
  },
  {
    name: 'Action Catalog',
    path: '/app/actioncatalog',
    icon: actionCatalogIcon,
    description: modules.alertsActions,
  },
  {
    name: 'Focal People',
    path: '/app/focalpeople',
    icon: contactsIcon,
    description: modules.stakeholdersFocalPeople,
  },
  {
    name: 'Agencies',
    path: '/app/agencies',
    icon: agenciesIcon,
    description: modules.stakeholdersAgencies,
  },
  {
    name: 'Critical facilities',
    path: '/app/features',
    icon: geographicalFeaturesIcon,
    description: modules.geographicalFeaturesIcon,
  },
  {
    name: 'Geographical Features',
    path: '/app/geographicalfeatures',
    icon: alertIcon,
    description: modules.eventGroups,
  },
  {
    name: 'Administrative Areas',
    path: '/app/administrativeareas',
    icon: geographicalFeaturesIcon,
    description: modules.administrativeareas,
  },
  {
    name: 'Dashboards',
    path: '/app/overview',
    icon: dashboardIcon,
    description: modules.dashboards,
  },
  {
    name: 'Settings',
    path: '/app/settings',
    icon: settingsIcon,
    description: modules.notificationTemplate,
  },
];

/**
 * @function
 * @name Home
 * @description Home component which shows to base navigation menu
 *
 * @returns {object} Navigation Menu
 *
 * @version 0.1.0
 * @since 0.1.0
 */
const Home = () => <NavigationMenu routes={routes} />;

export default Home;
