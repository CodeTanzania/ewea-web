import React from 'react';

import dashboardIcon from '../assets/icons/dashboards.svg';
import indicatorDashboardIcon from '../assets/icons/dashboards/indicator-dashboard.svg';
import overviewDashboardIcon from '../assets/icons/dashboards/overview-dashboard.svg';
import NavigationMenu from '../components/NavigationMenu';
import modules from '../modules.json';

/* constants */
const routes = [
  {
    name: 'Overview Dashboard',
    path: '/app/dashboards/overview',
    icon: overviewDashboardIcon,
    description: modules.alertsIssued,
  },
  {
    name: 'Indicators Dashboard',
    path: '/app/dashboards/needs',
    icon: indicatorDashboardIcon,
    description: modules.alertsIssued,
  },

  {
    name: 'Effects Dashboard',
    path: '/app/dashboards/effects',
    icon: dashboardIcon,
    description: modules.alertsIssued,
  },

  {
    name: 'Needs Dashboard',
    path: '/app/dashboards/needs',
    icon: dashboardIcon,
    description: modules.alertsIssued,
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
const DashboardNavMenu = () => <NavigationMenu routes={routes} />;

export default DashboardNavMenu;
