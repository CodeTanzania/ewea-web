import React from 'react';
import PropTypes from 'prop-types';

import eventsIcon from '../assets/icons/events.svg';
import stakeholdersIcon from '../assets/icons/dashboards/stakeholders.svg';
import indicatorDashboardIcon from '../assets/icons/dashboards/indicator-dashboard.svg';
import overviewDashboardIcon from '../assets/icons/dashboards/overview-dashboard.svg';
import caseManagementIcon from '../assets/icons/dashboards/case-management.svg';
import resourceManagementIcon from '../assets/icons/dashboards/resource-management-disabled.svg';
import vehicleDispatchIcon from '../assets/icons/dashboards/vehicle-dispatch.svg';
import criticalInfrastructuresIcon from '../assets/icons/dashboards/infrastructure-disabled.svg';
import NavigationMenu from '../components/NavigationMenu';
import modules from '../modules.json';

// TODO update module descriptions to point to right descriptions

/* constants */
const routes = [
  {
    name: 'Overview',
    path: '/overview',
    icon: overviewDashboardIcon,
    description: modules.alertsIssued,
  },
  {
    name: 'Emergencies',
    path: '/events',
    icon: eventsIcon,
    description: modules.alertsIssued,
  },
  {
    name: 'Emergency Preparedness',
    path: '/emergencypreparedness',
    icon: indicatorDashboardIcon,
    description: modules.alertsIssued,
  },
  {
    name: 'Stakeholders',
    path: '/stakeholders',
    icon: stakeholdersIcon,
    description: modules.alertsIssued,
  },
  {
    name: 'Cases',
    path: '/cases',
    icon: caseManagementIcon,
    description: modules.alertsIssued,
  },
  {
    name: 'Resources',
    path: '/resourcemanagement',
    icon: resourceManagementIcon,
    description: modules.alertsIssued,
    disabled: true,
  },
  {
    name: 'Vehicle Dispatches',
    path: '/dispatches',
    icon: vehicleDispatchIcon,
    description: modules.alertsIssued,
  },
  {
    name: 'Critical Infrastructures',
    path: '/features',
    icon: criticalInfrastructuresIcon,
    description: modules.alertsIssued,
    disabled: true,
  },
];

/**
 * @function
 * @name Home
 * @description Home component which shows to base navigation menu
 * @param {object} props Component Props
 * @param {object} props.match Match prop from react router
 * @returns {object} Navigation Menu
 * @version 0.1.0
 * @since 0.1.0
 */
const DashboardNavMenu = ({ match }) => (
  <NavigationMenu routes={routes} match={match} />
);

DashboardNavMenu.propTypes = {
  match: PropTypes.shape({ url: PropTypes.string }).isRequired,
};

export default DashboardNavMenu;
