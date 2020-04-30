import React from 'react';

import eventsIcon from '../assets/icons/events.svg';
import stakeholdersIcon from '../assets/icons/dashboards/stakeholders.svg';
import indicatorDashboardIcon from '../assets/icons/dashboards/indicator-dashboard-disabled.svg';
import overviewDashboardIcon from '../assets/icons/dashboards/overview-dashboard.svg';
import caseManagementIcon from '../assets/icons/dashboards/case-management-disabled.svg';
import resourceManagementIcon from '../assets/icons/dashboards/resource-management-disabled.svg';
import vehicleDispatchIcon from '../assets/icons/dashboards/vehicle-dispatch-disabled.svg';
import criticalInfrastructuresIcon from '../assets/icons/dashboards/infrastructure-disabled.svg';
import NavigationMenu from '../components/NavigationMenu';
import modules from '../modules.json';

// TODO update module descriptions to point to right descriptions

/* constants */
const routes = [
  {
    name: 'Overview',
    path: '/app/dashboards/overview',
    icon: overviewDashboardIcon,
    description: modules.alertsIssued,
  },
  {
    name: 'Events',
    path: '/app/dashboards/events',
    icon: eventsIcon,
    description: modules.alertsIssued,
  },
  {
    name: 'Indicators',
    path: '/app/dashboards/indicators',
    icon: indicatorDashboardIcon,
    description: modules.alertsIssued,
    disabled: true,
  },
  {
    name: 'Stakeholders',
    path: '/app/dashboards/stakeholders',
    icon: stakeholdersIcon,
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
    name: 'Resources',
    path: '/app/dashboards/resourcemanagement',
    icon: resourceManagementIcon,
    description: modules.alertsIssued,
    disabled: true,
  },
  {
    name: 'Vehicle Dispatches',
    path: '/app/dashboards/vehicledispatch',
    icon: vehicleDispatchIcon,
    description: modules.alertsIssued,
    disabled: true,
  },
  {
    name: 'Critical Infrastructures',
    path: '/app/dashboards/features',
    icon: criticalInfrastructuresIcon,
    description: modules.alertsIssued,
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
const DashboardNavMenu = () => <NavigationMenu routes={routes} />;

export default DashboardNavMenu;
