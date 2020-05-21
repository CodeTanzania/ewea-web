import React from 'react';
import PropTypes from 'prop-types';
import vehiclesIcon from '../assets/icons/settings/vehicles.svg';
import stockIcon from '../assets/icons/resources/stock-disabled.svg';
import itemsIcon from '../assets/icons/resources/item-disabled.svg';
import adjustmentsIcon from '../assets/icons/resources/adjustment-disabled.svg';
import NavigationMenu from '../components/NavigationMenu';
import modules from '../modules.json';

// TODO update module descriptions to point to right descriptions

/* constants */
const routes = [
  {
    name: 'Needs',
    path: '/needs',
    icon: itemsIcon,
    description: modules.vehicles,
    disabled: true,
  },
  {
    name: 'Adjustments',
    path: '/adjustments',
    icon: adjustmentsIcon,
    description: modules.vehicles,
    disabled: true,
  },
  {
    name: 'Stocks',
    path: '/stocks',
    icon: stockIcon,
    description: modules.vehicles,
    disabled: true,
  },
  {
    name: 'Vehicles',
    path: '/vehicles',
    icon: vehiclesIcon,
    description: modules.vehicles,
  },
  {
    name: 'Equipments',
    path: '/equipments',
    icon: itemsIcon,
    description: modules.vehicles,
    disabled: true,
  },
];

/**
 * @function
 * @name Home
 * @description Home component which shows to base navigation menu
 * @param {object} props Component props
 * @param {object} props.match Match object from react router
 * @returns {object} Navigation Menu
 *
 * @version 0.1.0
 * @since 0.1.0
 */
const ResourceNavMenu = ({ match }) => (
  <NavigationMenu routes={routes} match={match} />
);

ResourceNavMenu.propTypes = {
  match: PropTypes.shape({ url: PropTypes.string }).isRequired,
};

export default ResourceNavMenu;
