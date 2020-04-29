import React from 'react';

import dashboardIcon from '../assets/icons/dashboards.svg';
import indicatorDashboardIcon from '../assets/icons/dashboards/indicator-dashboard.svg';
import overviewDashboardIcon from '../assets/icons/dashboards/overview-dashboard.svg';
import caseManagementIcon from '../assets/icons/dashboards/case-management-disabled.svg';
import resourceManagementIcon from '../assets/icons/dashboards/resource-management-disabled.svg';
import vehicleDispatchIcon from '../assets/icons/dashboards/vehicle-dispatch-disabled.svg';
import NavigationMenu from '../components/NavigationMenu';
import modules from '../modules.json';

// TODO update module descriptions to point to right descriptions

/* constants */
const routes = [
  {
    name: 'Overview Dashboard',
    path: '/app/dashboards/overview',
    icon: overviewDashboardIcon,
    description: modules.alertsIssued,
  },
  {
    name: 'Events Dashboard',
    path: '/app/dashboards/events',
    icon: dashboardIcon,
    description: modules.alertsIssued,
  },
  {
    name: 'Indicators Dashboard',
    path: '/app/dashboards/indicators',
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
  {
    name: 'Stakeholders Dashboard',
    path: '/app/dashboards/stakeholders',
    icon: dashboardIcon,
    description: modules.alertsIssued,
  },
  {
    name: 'Case Management',
    path: '/app/dashboards/casemanagement',
    icon: caseManagementIcon,
    description: modules.alertsIssued,
  },
  {
    name: 'Resource Management',
    path: '/app/dashboards/resourcemanagement',
    icon: resourceManagementIcon,
    description: modules.alertsIssued,
  },
  {
    name: 'Vehicle Dispatch',
    path: '/app/dashboards/vehicledispatch',
    icon: vehicleDispatchIcon,
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
