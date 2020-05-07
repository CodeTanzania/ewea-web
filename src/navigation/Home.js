import React from 'react';

import dashboardIcon from '../assets/icons/dashboards.svg';
import settingsIcon from '../assets/icons/settings.svg';
import agenciesIcon from '../assets/icons/agencies.svg';
import focalPeopleIcon from '../assets/icons/focalpeople.svg';
import NavigationMenu from '../components/NavigationMenu';
import eventsIcon from '../assets/icons/events.svg';
// import actionsTakenIcon from '../assets/icons/actionstaken.svg';
import actionCatalogueIcon from '../assets/icons/actioncatalog.svg';
import caseManagementIcon from '../assets/icons/dashboards/case-management-disabled.svg';
import resourceManagementIcon from '../assets/icons/dashboards/resource-management-disabled.svg';
import vehicleDispatchIcon from '../assets/icons/dashboards/vehicle-dispatch.svg';
import modules from '../modules.json';

/* constants */
const routes = [
  {
    name: 'Events',
    path: '/app/events',
    icon: eventsIcon,
    description: modules.alertsIssued,
  },
  {
    name: 'Cases',
    path: '/app/dashboards/casemanagement',
    icon: caseManagementIcon,
    description: modules.alertsIssued,
    disabled: true,
  },
  {
    name: 'Vehicle Dispatches',
    path: '/app/dispatches',
    icon: vehicleDispatchIcon,
    description: modules.alertsIssued,
  },
  // {
  //   name: 'Actions Taken',
  //   path: '/app/actions',
  //   icon: actionsTakenIcon,
  //   description: modules.alertsActions,
  // },
  {
    name: 'Action Catalogue',
    path: '/app/actioncatalogue',
    icon: actionCatalogueIcon,
    description: modules.alertsActions,
  },
  {
    name: 'Resources',
    path: '/app/dashboards/resourcemanagement',
    icon: resourceManagementIcon,
    description: modules.alertsIssued,
    disabled: true,
  },
  {
    name: 'Focal People',
    path: '/app/focalpeople',
    icon: focalPeopleIcon,
    description: modules.stakeholdersFocalPeople,
  },
  {
    name: 'Agencies',
    path: '/app/agencies',
    icon: agenciesIcon,
    description: modules.stakeholdersAgencies,
  },
  {
    name: 'Dashboards',
    path: '/app/dashboards',
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
