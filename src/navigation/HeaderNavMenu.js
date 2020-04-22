import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import dashboardIcon from '../assets/icons/dashboards.svg';
import settingsIcon from '../assets/icons/settings.svg';
import agenciesIcon from '../assets/icons/agencies.svg';
import focalPeopleIcon from '../assets/icons/focalpeople.svg';
import eventsIcon from '../assets/icons/events.svg';
// import actionsTakenIcon from '../assets/icons/actionstaken.svg';
import actionCatalogueIcon from '../assets/icons/actioncatalog.svg';
import './styles.css';

/* constants */
const routes = [
  {
    name: 'Events',
    path: '/app/events',
    icon: eventsIcon,
  },
  // {
  //   name: 'Actions Taken',
  //   path: '/app/actions',
  //   icon: actionsTakenIcon,
  // },
  {
    name: 'Action Catalogue',
    path: '/app/actioncatalogue',
    icon: actionCatalogueIcon,
  },
  {
    name: 'Focal People',
    path: '/app/focalpeople',
    icon: focalPeopleIcon,
  },
  {
    name: 'Agencies',
    path: '/app/agencies',
    icon: agenciesIcon,
  },
  {
    name: 'Dashboards',
    path: '/app/overview',
    icon: dashboardIcon,
  },
  {
    name: 'Settings',
    path: '/app/settings',
    icon: settingsIcon,
  },
];

/**
 * @function
 * @name NavItem
 * @description Navigation menu item that have icon(image) and name for the
 * module to navigate to
 *
 * @param {object} props props object
 * @param {string} props.name  name/description/label for nav item
 * @param {string} props.icon  path to svg image used as nav icon
 * @param {string} props.path  path to navigate to when clicked
 * @param {boolean} props.disabled flag to mark navigation item if is disabled
 *
 * @returns {object} Navigation item
 * @version 0.1.0
 * @since 0.1.0
 */
const NavItem = ({ name, icon, path, disabled }) => (
  <Link to={path}>
    <div className="NavItem">
      <img
        src={icon}
        alt={`${name} icon not available`}
        width={50}
        height={50}
        className="image"
      />
      <span className={`text ${disabled ? 'text-disabled' : ''}`}>{name}</span>
    </div>
  </Link>
);

/**
 * @function
 * @name Home
 * @description Home route which shows to navigation icon
 *
 * @returns {object} Module Navigation Menu
 *
 * @version 0.1.0
 * @since 0.1.0
 */
const ModuleNavMenu = () => (
  <div className="ModuleNavMenu">
    <Row type="flex" align="middle">
      {routes.map((route) => (
        <Col key={route.path} span={12}>
          <NavItem
            name={route.name}
            icon={route.icon}
            path={route.disabled ? '#' : route.path}
            disabled={route.disabled}
          />
        </Col>
      ))}
    </Row>
  </div>
);

/* props validation */
NavItem.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  disabled: PropTypes.string.isRequired,
};

export default ModuleNavMenu;
