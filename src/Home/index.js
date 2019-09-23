import React from 'react';
import alertIcon from '../assets/icons/alerts.svg';
import assessmentIcon from '../assets/icons/assessments-disabled.svg';
import dashboardIcon from '../assets/icons/dashboards-disabled.svg';
import planIcon from '../assets/icons/emergencyplans-disabled.svg';
import geographicalFeaturesIcon from '../assets/icons/geographicalfeatures-disabled.svg';
import incidentIcon from '../assets/icons/incidents-disabled.svg';
import resourceIcon from '../assets/icons/resources-disabled.svg';
import agenciesIcon from '../assets/icons/stakeholders/agency.svg';
import contactsIcon from '../assets/icons/stakeholders/contacts.svg';
import rolesIcon from '../assets/icons/stakeholders/roles.svg';
import NavigationMenu from '../components/NavigationMenu';
import modules from '../modules.json';

/* constants */
const routes = [
  {
    name: 'Alerts',
    path: '/app/alerts',
    icon: alertIcon,
    description: modules.alerts,
  },
  {
    name: 'Assessment',
    path: '/app/assessments',
    icon: assessmentIcon,
    description: modules.assessments,
    disabled: true,
  },
  { name: 'Emergency Plans', path: '/plans', icon: planIcon, disabled: true },
  {
    name: 'Geographical Features',
    path: '/app/geographicalfeatures',
    icon: geographicalFeaturesIcon,
    description: modules.geographicalfeatures,
    disabled: true,
  },
  {
    name: 'Incidents',
    path: '/app/incidents',
    icon: incidentIcon,
    description: modules.incidents,
    disabled: true,
  },
  {
    name: 'Resources',
    path: '/app/resources',
    icon: resourceIcon,
    description: modules.resources,
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
