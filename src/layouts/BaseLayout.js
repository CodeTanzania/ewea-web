import React from 'react';
import PropTypes from 'prop-types';
import { AppstoreOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Col, Layout, Popover, Row } from 'antd';
import { Link, Switch } from 'react-router-dom';
import UserMenu from '../navigation/UserMenu';

import EventActions from '../Events/EventActions';
import PageNotFound from '../components/UIState/PageNotFound';
import Home from '../navigation/Home';
import AdministrativeAreas from '../GeographicalFeatures/AdministrativeAreas';
import AdministrativeLevels from '../GeographicalFeatures/AdministrativeLevels';
import StakeholdersAgencies from '../Stakeholders/Agencies';
import StakeholdersFocalPeople from '../Stakeholders/FocalPeople';
import AgenciesOwnerships from '../Stakeholders/AgenciesOwnerships';
import NotificationTemplates from '../Stakeholders/NotificationTemplates';
import Events from '../Events/Events';
import EventFunctions from '../Events/EventFunctions';
import EventTypes from '../Events/EventTypes';
import EventSeverity from '../Events/EventSeverity';
import EventCertainty from '../Events/EventCertainty';
import EventResponses from '../Events/EventResponses';
import EventUrgencies from '../Events/EventUrgencies';
import EventQuestions from '../Events/EventQuestions';
import EventTopics from '../Events/EventTopics';
import EventGroups from '../Events/EventGroups';
import StakeholderGroups from '../Stakeholders/StakeholderGroups';
import EventLevels from '../Events/EventLevels';
import EventIndicator from '../Events/EventIndicator';
import Features from '../GeographicalFeatures/CriticalFacilities';
import ActionCatalogue from '../Events/ActionCatalogues';
import EventStatuses from '../Events/EventStatuses';
import FeatureTypes from '../GeographicalFeatures/FeatureTypes';
import Units from '../Units';
// import StakeholdersNotifications from '../Stakeholders/Notifications';
import StakeholdersRoles from '../Stakeholders/Roles';
import Vehicles from '../VehicleDispatches/Vehicles';
import VehicleDispatches from '../VehicleDispatches/Dispatches';
import VehicleMakes from '../VehicleDispatches/VehicleMakes';
import VehicleModels from '../VehicleDispatches/VehicleModels';
import VehicleTypes from '../VehicleDispatches/VehicleTypes';
import VehicleStatuses from '../VehicleDispatches/VehicleStatuses';
import Settings from '../navigation/Settings';
import ActionsTaken from '../Dashboards/ActionsTaken';
import SecureRoute from '../Auth/SecureRoute';
import HeaderNavMenu from '../navigation/HeaderNavMenu';
// Dashboards
import Dashboards from '../navigation/Dashboards';
import OverviewDashboard from '../Dashboards/Overview';
import EventsOverviewDashboard from '../Dashboards/EventsOverview';
import StakeholdersDashboard from '../Dashboards/Stakeholders';
import VehicleDispatchesDashboard from '../Dashboards/VehicleDispatches';
// Resources
import Resources from '../navigation/Resources';

import './styles.css';

/* constants */
const { Header, Content } = Layout;
const breadcrumbNameMap = {
  '/app': {
    name: 'Home',
    title: 'Early Warning, Early Action Menu',
  },
  /* event routes */
  '/app/actions': {
    name: 'Actions Taken',
    title: 'List of all performed actions',
  },
  '/app/actioncatalogue': {
    name: 'Action Catalogue',
    title: 'List of all actions to be performed',
  },
  '/app/events': {
    name: 'Events',
    title: 'List of all Events(Alerts and Incidents)',
  },

  /* stakeholders routes */
  '/app/focalpeople': {
    name: 'Focal People',
    title: 'List of all focal persons',
  },
  '/app/agencies': {
    name: 'Agencies',
    title: 'List of all agencies',
  },
  '/app/stakeholders': { name: 'Stakeholders', title: 'Stakeholders module' },

  /* vehicle dispatch routes */
  '/app/dispatches': {
    name: 'Vehicle Dispatches',
    title: 'Vehicle Dispatches Module',
  },

  /* dashboards routes */
  '/app/dashboards': {
    name: 'Dashboards',
    title: 'Dashboards',
  },
  '/app/dashboards/overview': {
    name: 'Overview Dashboard',
    title: 'Overview Dashboard',
  },
  '/app/dashboards/indicators': {
    name: 'Indicators Dashboard',
    title: 'Indicators Dashboard',
  },
  '/app/dashboards/needs': {
    name: 'Needs Dashboard',
    title: 'Needs Dashboard',
  },
  '/app/dashboards/effects': {
    name: 'Effects Dashboard',
    title: 'Effects Dashboard',
  },
  '/app/dashboards/stakeholders': {
    name: 'Stakeholders Dashboard',
    title: 'Stakeholders Dashboard',
  },
  '/app/dashboards/events': {
    name: 'Events Dashboard',
    title: 'Events Dashboard',
  },
  '/app/dashboards/dispatches': {
    name: 'Vehicle Dispatches',
    title: 'Vehicle Dispatches Dashboard',
  },

  /* Resources routes */
  '/app/resources': {
    name: 'Resources',
    title: 'Resources Module',
  },
  '/app/resources/vehicles': {
    name: 'Vehicles',
    title: 'Vehicles',
  },

  /* settings routes */
  '/app/settings': {
    name: 'Settings',
    title: 'System Wide Settings',
  },
  '/app/settings/administrativeareas': {
    name: 'Administrative Areas',
    title: 'List of administrative areas',
  },
  '/app/settings/administrativelevels': {
    name: 'Administrative Levels',
    title: 'List of administrative levels',
  },
  '/app/settings/features': {
    name: 'Critical Infrastructures',
    title: 'List of all critical infrastructures',
  },
  '/app/settings/featuretypes': {
    name: 'Feature Types',
    title: 'List of all feature types',
  },
  '/app/settings/eventactions': {
    name: 'Event Actions',
    title: 'Event Actions Module',
  },
  '/app/settings/functions': {
    name: 'Emergency Functions',
    title: 'Emergency functions module',
  },
  '/app/settings/roles': {
    name: 'Roles',
    title: 'Roles of Stakeholders',
  },
  '/app/settings/eventtypes': {
    name: 'Event Types',
    title: 'Event Types module',
  },
  '/app/settings/eventcertainty': {
    name: 'Event Certainties',
    title: 'Event Certainty module',
  },
  '/app/settings/eventquestions': {
    name: 'Event Questions',
    title: 'Event Questions module',
  },
  '/app/settings/eventseverity': {
    name: 'Event Severities',
    title: 'Event Severity module',
  },
  '/app/settings/notificationtemplates': {
    name: 'Notification Templates',
    title: 'Notification template module',
  },
  '/app/settings/eventtopics': {
    name: 'Event Topics',
    title: 'Event Topics module',
  },
  '/app/settings/eventgroups': {
    name: 'Event Groups',
    title: 'Event Groups module',
  },

  '/app/settings/stakeholdergroups': {
    name: 'Stakeholders Groups',
    title: 'Stakeholders Groups module',
  },
  '/app/settings/agenciesownerships': {
    name: 'Agencies Ownerships',
    title: 'List of Agencies Ownerships',
  },
  '/app/settings/eventindicator': {
    name: 'Event Indicators',
    title: 'Event Indicator module',
  },
  '/app/settings/eventlevels': {
    name: 'Event Levels',
    title: 'Event Level module',
  },
  '/app/settings/eventurgencies': {
    name: 'Event Urgencies',
    title: 'Event Urgencies Module',
  },
  '/app/settings/eventresponses': {
    name: 'Event Responses',
    title: 'Event Responses Module',
  },
  '/app/settings/eventstatuses': {
    name: 'Event Statuses',
    title: 'Event Statuses Module',
  },
  '/app/settings/units': {
    name: 'Units',
    title: 'Units module',
  },
  '/app/settings/vehicles': {
    name: 'Vehicles',
    title: 'Vehicles Module',
  },
  '/app/settings/vehiclemakes': {
    name: 'Vehicle Makes',
    title: 'Vehicle Makes Module',
  },
  '/app/settings/vehiclemodels': {
    name: 'Vehicle Models',
    title: 'Vehicle Models Module',
  },
  '/app/settings/vehiclestatuses': {
    name: 'Vehicle Statuses',
    title: 'Vehicle Statuses Module',
  },
  '/app/settings/vehicletypes': {
    name: 'Vehicle Types',
    title: 'Vehicle Types Module',
  },
};

/**
 * @function
 * @name BaseLayout
 * @description Render base layout for EWEA app
 * @param {object} props Properties inject by router
 * @param {object} props.location Location object from react router
 * @param {object} props.match Match prop from react router
 * @param {string} props.match.url Current Url
 * @returns {object} BaseLayout component
 * @version 0.1.0
 * @since 0.1.0
 */
const BaseLayout = ({ location, match: { url: baseUrl } }) => {
  const pathSnippets = location.pathname.split('/').filter((i) => i);
  const lastPath = pathSnippets[pathSnippets.length - 1];

  // generate dynamic breadcrumb items
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;

    if (breadcrumbNameMap[url]) {
      return (
        <Breadcrumb.Item key={url}>
          <Link to={url} title={breadcrumbNameMap[url].title}>
            {breadcrumbNameMap[url].name}
          </Link>
        </Breadcrumb.Item>
      );
    }

    return (
      <Breadcrumb.Item key={url}>
        <span title={lastPath}>{lastPath}</span>
      </Breadcrumb.Item>
    );
  });

  // TODO clean this up
  const breadcrumbItems = [].concat(extraBreadcrumbItems);

  return (
    <Layout className="BaseLayout">
      <Header className="BaseLayoutHeader">
        <Row type="flex" align="middle">
          {/* breadcrumb section start */}
          <Col xxl={22} xl={22} lg={22} md={22} sm={20} xs={20}>
            <Breadcrumb className="Breadcrumb" separator=">">
              {breadcrumbItems}
            </Breadcrumb>
          </Col>
          {/* breadcrumb section end */}

          <Col xxl={2} xl={2} lg={2} md={2} sm={4} xs={4}>
            <Row type="flex" justify="end">
              {/* control showing module navigation menu */}
              {location.pathname !== '/' && (
                <Col span={12}>
                  <Popover
                    placement="bottom"
                    content={<HeaderNavMenu />}
                    trigger="click"
                  >
                    <Button icon={<AppstoreOutlined />} />
                  </Popover>
                </Col>
              )}
              <Col span={12}>
                <UserMenu />
              </Col>
            </Row>
          </Col>
        </Row>
      </Header>
      <Content className="BaseLayoutContent">
        <Switch>
          <SecureRoute exact path={`${baseUrl}/`} component={Home} />
          <SecureRoute path={`${baseUrl}/events`} component={Events} />

          <SecureRoute
            path={`${baseUrl}/focalpeople`}
            component={StakeholdersFocalPeople}
          />
          <SecureRoute
            path={`${baseUrl}/agencies`}
            component={StakeholdersAgencies}
          />
          <SecureRoute
            path={`${baseUrl}/actioncatalogue`}
            component={ActionCatalogue}
          />
          <SecureRoute
            exact
            path={`${baseUrl}/dispatches`}
            component={VehicleDispatches}
          />

          {/* Dashboard routes */}
          <SecureRoute
            exact
            path={`${baseUrl}/dashboards`}
            component={Dashboards}
          />
          <SecureRoute
            path={`${baseUrl}/dashboards/overview`}
            component={OverviewDashboard}
          />
          <SecureRoute
            path={`${baseUrl}/dashboards/stakeholders`}
            component={StakeholdersDashboard}
          />
          <SecureRoute
            path={`${baseUrl}/dashboards/events`}
            component={EventsOverviewDashboard}
          />

          <SecureRoute
            path={`${baseUrl}/dashboards/dispatches`}
            component={VehicleDispatchesDashboard}
          />
          {/* end dashboard routes */}

          {/* Resources routes */}

          <SecureRoute
            exact
            path={`${baseUrl}/resources`}
            component={Resources}
          />
          <SecureRoute
            path={`${baseUrl}/resources/vehicles`}
            component={Vehicles}
          />
          {/* end Resources routes */}

          <SecureRoute path={`${baseUrl}/actions`} component={ActionsTaken} />
          <SecureRoute
            exact
            path={`${baseUrl}/settings`}
            component={Settings}
          />
          <SecureRoute
            path={`${baseUrl}/settings/functions`}
            component={EventFunctions}
          />
          <SecureRoute
            path={`${baseUrl}/settings/eventactions`}
            component={EventActions}
          />
          <SecureRoute
            path={`${baseUrl}/settings/administrativeareas`}
            component={AdministrativeAreas}
          />
          <SecureRoute
            path={`${baseUrl}/settings/administrativelevels`}
            component={AdministrativeLevels}
          />
          <SecureRoute
            path={`${baseUrl}/settings/features`}
            component={Features}
          />
          <SecureRoute
            path={`${baseUrl}/settings/featuretypes`}
            component={FeatureTypes}
          />
          <SecureRoute
            path={`${baseUrl}/settings/roles`}
            component={StakeholdersRoles}
          />
          <SecureRoute
            path={`${baseUrl}/settings/notificationtemplates`}
            component={NotificationTemplates}
          />
          <SecureRoute
            path={`${baseUrl}/settings/eventtopics`}
            component={EventTopics}
          />
          <SecureRoute
            path={`${baseUrl}/settings/eventgroups`}
            component={EventGroups}
          />

          <SecureRoute
            path={`${baseUrl}/settings/stakeholdergroups`}
            component={StakeholderGroups}
          />
          <SecureRoute
            path={`${baseUrl}/settings/agenciesownerships`}
            component={AgenciesOwnerships}
          />
          <SecureRoute
            path={`${baseUrl}/settings/eventtypes`}
            component={EventTypes}
          />
          <SecureRoute
            path={`${baseUrl}/settings/eventcertainty`}
            component={EventCertainty}
          />
          <SecureRoute
            path={`${baseUrl}/settings/eventquestions`}
            component={EventQuestions}
          />
          <SecureRoute
            path={`${baseUrl}/settings/eventseverity`}
            component={EventSeverity}
          />
          <SecureRoute
            path={`${baseUrl}/settings/eventindicator`}
            component={EventIndicator}
          />
          <SecureRoute
            path={`${baseUrl}/settings/eventlevels`}
            component={EventLevels}
          />
          <SecureRoute
            path={`${baseUrl}/settings/eventstatuses`}
            component={EventStatuses}
          />

          <SecureRoute
            path={`${baseUrl}/settings/eventurgencies`}
            component={EventUrgencies}
          />
          <SecureRoute
            path={`${baseUrl}/settings/eventresponses`}
            component={EventResponses}
          />

          <SecureRoute path={`${baseUrl}/settings/units`} component={Units} />

          <SecureRoute
            path={`${baseUrl}/settings/vehiclemakes`}
            component={VehicleMakes}
          />
          <SecureRoute
            path={`${baseUrl}/settings/vehiclemodels`}
            component={VehicleModels}
          />
          <SecureRoute
            path={`${baseUrl}/settings/vehiclestatuses`}
            component={VehicleStatuses}
          />
          <SecureRoute
            path={`${baseUrl}/settings/vehicletypes`}
            component={VehicleTypes}
          />

          <SecureRoute component={PageNotFound} />
        </Switch>
      </Content>
    </Layout>
  );
};

BaseLayout.propTypes = {
  location: PropTypes.shape({ pathname: PropTypes.string }).isRequired,
  match: PropTypes.shape({ url: PropTypes.string, path: PropTypes.string })
    .isRequired,
};

export default BaseLayout;
