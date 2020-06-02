import React from 'react';
import PropTypes from 'prop-types';
import dashboardIcon from '../assets/icons/dashboards.svg';
import settingsIcon from '../assets/icons/settings.svg';
import agenciesIcon from '../assets/icons/agencies.svg';
import focalPeopleIcon from '../assets/icons/focalpeople.svg';
import NavigationMenu from '../components/NavigationMenu';
import eventsIcon from '../assets/icons/events.svg';
// import actionsTakenIcon from '../assets/icons/actionstaken.svg';
import actionCatalogueIcon from '../assets/icons/actioncatalog.svg';
import caseManagementIcon from '../assets/icons/dashboards/case-management.svg';
import resourceManagementIcon from '../assets/icons/dashboards/resource-management.svg';
import vehicleDispatchIcon from '../assets/icons/dashboards/vehicle-dispatch.svg';
import modules from '../modules.json';

/* constants */
const routes = [
  {
    name: 'Emergencies',
    path: '/events',
    icon: eventsIcon,
    description: modules.alertsIssued,
  },
  {
    name: 'Cases',
    path: '/cases',
    icon: caseManagementIcon,
    description: modules.alertsIssued,
  },
  {
    name: 'Vehicle Dispatches',
    path: '/dispatches',
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
    path: '/actioncatalogue',
    icon: actionCatalogueIcon,
    description: modules.alertsActions,
  },
  {
    name: 'Resources',
    path: '/resources',
    icon: resourceManagementIcon,
    description: modules.alertsIssued,
  },
  {
    name: 'Focal People',
    path: '/focalpeople',
    icon: focalPeopleIcon,
    description: modules.stakeholdersFocalPeople,
  },
  {
    name: 'Agencies',
    path: '/agencies',
    icon: agenciesIcon,
    description: modules.stakeholdersAgencies,
  },
  {
    name: 'Dashboards',
    path: '/dashboards',
    icon: dashboardIcon,
    description: modules.dashboards,
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: settingsIcon,
    description: modules.notificationTemplate,
  },
];

/**
 * @function
 * @name HomeNavMenu
 * @description Home component which shows to base navigation menu
 * @param {object} props Component Props
 * @param {object} props.match Match prop from react router
 * @returns {object} Navigation Menu
 *
 * @version 0.1.0
 * @since 0.1.0
 */
const HomeNavMenu = ({ match }) => (
  <NavigationMenu routes={routes} match={match} />
);

HomeNavMenu.propTypes = {
  match: PropTypes.shape({ url: PropTypes.string }).isRequired,
};
export default HomeNavMenu;
