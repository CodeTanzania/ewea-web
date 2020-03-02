import React from 'react';
import modules from '../modules.json';
import dashboardIcon from '../assets/icons/dashboards.svg';
import settingsIcon from '../assets/icons/settings.svg';
import eventActionsIcon from '../assets/icons/eventactions.svg';
import administrativeAreasIcon from '../assets/icons/administrativeareas.svg';
import agenciesIcon from '../assets/icons/agencies.svg';
import criticalFacilitiesIcon from '../assets/icons/criticalfacilities.svg';
import focalPeopleIcon from '../assets/icons/focalpeople.svg';
import NavigationMenu from '../components/NavigationMenu';
import emergencyFunctionsIcon from '../assets/icons/emergencyfunctions.svg';
import eventsIcon from '../assets/icons/events.svg';
import actionsTakenIcon from '../assets/icons/actionstaken.svg';
import actionCatalogueIcon from '../assets/icons/actioncatalog.svg';

/* constants */
const routes = [
  {
    name: 'Events',
    path: '/app/events',
    icon: eventsIcon,
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
    icon: actionsTakenIcon,
    description: modules.alertsActions,
  },
  {
    name: 'Emergency Functions',
    path: '/app/functions',
    icon: emergencyFunctionsIcon,
  },
  {
    name: 'Action Catalogue',
    path: '/app/actioncatalogue',
    icon: actionCatalogueIcon,
    description: modules.alertsActions,
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
    name: 'Critical facilities',
    path: '/app/features',
    icon: criticalFacilitiesIcon,
    description: modules.criticalFacilities,
  },
  {
    name: 'Administrative Areas',
    path: '/app/administrativeareas',
    icon: administrativeAreasIcon,
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
