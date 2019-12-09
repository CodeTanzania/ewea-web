import React from 'react';
import dashboardIcon from '../assets/icons/dashboards.svg';
import geographicalFeaturesIcon from '../assets/icons/geographicalfeatures.svg';
import agenciesIcon from '../assets/icons/stakeholders/agency.svg';
import contactsIcon from '../assets/icons/stakeholders/contacts.svg';
import rolesIcon from '../assets/icons/stakeholders/roles.svg';
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
    name: 'Issued Alerts',
    path: '/app/issuedalerts',
    icon: issuedAlertsIcon,
    description: modules.alertsIssued,
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
    name: 'Roles',
    path: '/app/roles',
    icon: rolesIcon,
    description: modules.stakeholdersRoles,
  },
  {
    name: 'Event Types',
    path: '/app/eventtypes',
    icon: alertIcon,
    description: modules.alerts,
  },
  {
    name: 'Geographical Features',
    path: '/app/geographicalfeatures',
    icon: geographicalFeaturesIcon,
    description: modules.geographicalfeatures,
  },
  {
    name: 'Dashboards',
    path: '/app/overview',
    icon: dashboardIcon,
    description: modules.dashboards,
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
