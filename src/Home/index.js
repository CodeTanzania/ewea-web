import React from 'react';
import dashboardIcon from '../assets/icons/dashboards-disabled.svg';
import geographicalFeaturesIcon from '../assets/icons/geographicalfeatures-disabled.svg';
import agenciesIcon from '../assets/icons/stakeholders/agency.svg';
import contactsIcon from '../assets/icons/stakeholders/contacts.svg';
import rolesIcon from '../assets/icons/stakeholders/roles.svg';
import NavigationMenu from '../components/NavigationMenu';
import modules from '../modules.json';
import issuedAlertsIcon from '../assets/icons/alerts/issuedalerts.svg';

/* constants */
const routes = [
  {
    name: 'Issued Alerts',
    path: '/app/alerts/issuedalerts',
    icon: issuedAlertsIcon,
    description: modules.alertsIssued,
  },
  {
    name: 'Geographical Features',
    path: '/app/geographicalfeatures',
    icon: geographicalFeaturesIcon,
    description: modules.geographicalfeatures,
    disabled: true,
  },
  {
    name: 'Focal People',
    path: '/app/stakeholders/focalpeople',
    icon: contactsIcon,
    description: modules.stakeholdersFocalPeople,
  },
  {
    name: 'Agencies',
    path: '/app/stakeholders/agencies',
    icon: agenciesIcon,
    description: modules.stakeholdersAgencies,
  },
  {
    name: 'Roles',
    path: '/app/stakeholders/roles',
    icon: rolesIcon,
    description: modules.stakeholdersRoles,
  },

  {
    name: 'Dashboards',
    path: '/app/dashboards',
    icon: dashboardIcon,
    description: modules.dashboards,
    disabled: true,
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
