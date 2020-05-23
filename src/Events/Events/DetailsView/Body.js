import React, { useEffect, useCallback, useState, useRef } from 'react';
import { getBaseUrl, getJwtToken } from '@codetanzania/ewea-api-client';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import ReactToPrint from 'react-to-print';
import {
  ApartmentOutlined,
  DownloadOutlined,
  EditOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  FileImageOutlined,
  IssuesCloseOutlined,
  MessageOutlined,
  NotificationOutlined,
  PrinterOutlined,
  ReloadOutlined,
  ShareAltOutlined,
  SwapOutlined,
  UserOutlined,
  WechatOutlined,
  DashboardOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import {
  Tag,
  Timeline,
  Table,
  Row,
  Col,
  Button,
  Modal,
  Card,
  Empty,
  Spin,
  Drawer,
  Typography,
} from 'antd';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import map from 'lodash/map';
import concat from 'lodash/concat';
import flatten from 'lodash/flatten';

import { formatDate, notifySuccess, notifyError } from '../../../util';
import EventChangelogForm from '../ChangelogForm';
import './styles.css';
import IndicatorDashboard from '../../../Dashboards/Indicators';
import EventDetailsViewHeader from './Header';

const {
  openChangelogForm,
  closeChangelogForm,
  getEvent,
  filterChangelogs,
  loadMoreChangelogs,
  postChangelog,
} = reduxActions;
const { Paragraph, Text } = Typography;

/**
 * @function
 * @param {object} props props object
 * @param {object} props.event valid event objetc
 * @param {Function} props.openForm open callback
 * @param {Function} props.onEdit edit callback
 * @param {Function} props.onShare share callback
 * @param {Function} props.openIndicatorDashboard indicator callback
 * @param {Function} props.onContent content callback
 * @name EventToolbar
 * @description List of actions user can perform on a particular event
 * @returns {object} React component
 * @version 0.1.0
 * @since 0.1.0
 */
const EventToolbar = ({
  event,
  openForm,
  onEdit,
  onShare,
  openIndicatorDashboard,
  onContent,
}) => {
  return (
    <div className="EventToolbar not-printable">
      <Row>
        <Col span={1}>
          <Button
            shape="circle"
            size="large"
            icon={<ReloadOutlined />}
            title="Refresh Event"
            className="actionButton"
            onClick={() =>
              getEvent(
                // eslint-disable-next-line
                event._id,
                () => notifySuccess('Event was refreshed successfully'),
                () =>
                  notifyError(
                    'An error occurred while refreshing event, please contact your system administrator'
                  )
              )
            }
          />
        </Col>

        <Col span={1}>
          <Button
            shape="circle"
            size="large"
            icon={<EditOutlined />}
            title="Edit Event"
            className="actionButton"
            onClick={() => onEdit()}
          />
        </Col>

        <Col span={1}>
          <Button
            shape="circle"
            size="large"
            icon={<ShareAltOutlined />}
            title="Share Event"
            className="actionButton"
            onClick={() => onShare()}
          />
        </Col>

        <Col span={1}>
          <Button
            shape="circle"
            size="large"
            icon={<NotificationOutlined />}
            title="Disseminate Event"
            className="actionButton"
          />
        </Col>

        <Col span={1}>
          <Button
            shape="circle"
            size="large"
            icon={<FileImageOutlined />}
            title="Upload Image"
            className="actionButton"
            onClick={() => openForm({ key: 'file', label: 'Upload File' })}
          />
        </Col>

        <Col span={1}>
          <Button
            shape="circle"
            size="large"
            icon={<WechatOutlined />}
            title="Add Comment"
            className="actionButton"
            onClick={() => openForm({ key: 'comment', label: 'Add a Comment' })}
          />
        </Col>

        <Col span={1}>
          <Button
            shape="circle"
            size="large"
            icon={<SwapOutlined />}
            title="Request for actions"
            className="actionButton"
          />
        </Col>

        <Col span={1}>
          <Button
            shape="circle"
            size="large"
            icon={<DashboardOutlined />}
            title="View Indicator Dashboard"
            className="actionButton"
            onClick={() => openIndicatorDashboard()}
          />
        </Col>

        <Col span={1}>
          <Button
            shape="circle"
            size="large"
            icon={<IssuesCloseOutlined />}
            title="Mark Event as Ended"
            className="actionButton"
            onClick={() => {
              postChangelog(
                { event: event._id, endedAt: new Date() }, // eslint-disable-line
                () => notifySuccess('Event closed successfully'),
                () =>
                  notifyError(
                    'An Error occurred while closing event, please contact system administrator'
                  ),
                { filters: { event: event._id } } // eslint-disable-line
              );
            }}
          />
        </Col>

        <Col span={1}>
          <ReactToPrint
            trigger={() => (
              <Button
                shape="circle"
                size="large"
                icon={<PrinterOutlined />}
                title="Print Event Details"
                className="actionButton"
              />
            )}
            content={onContent}
            pageStyle={{ margin: '30px' }}
          />
        </Col>
      </Row>
    </div>
  );
};

/**
 * @function
 * @param {object} props props object
 * @param {string} props.cause event cause
 * @name EventCause
 * @description Display Event Cause
 * @returns {object} React component
 * @version 0.1.0
 * @since 0.1.0
 */
const EventCause = ({ cause }) => {
  return (
    <>
      <EventDetailsSectionHeader title="CAUSE" />
      {cause}
    </>
  );
};

/**
 * @function
 * @param {object} props props object
 * @param {string} props.title valid title
 * @param {*} props.actions valid actions
 * @name EventDetailsSectionHeader
 * @description Header section for event details drawer
 * @returns {object} React component
 * @version 0.1.0
 * @since 0.1.0
 */
export const EventDetailsSectionHeader = ({ title, actions }) => {
  return (
    <div className="EventDetailsSectionHeader">
      <span className="EventDetailsSectionHeaderText">{title}</span>
      {actions}
    </div>
  );
};

/**
 * @param {object} props props object
 * @param {object[]} props.areas list of areas
 * @param {Function} props.openForm open callback
 * @function
 * @name EventLocations
 * @description Section which show event location(s) in hierarchy
 * @returns {object} React component
 * @version 0.1.0
 * @since 0.1.0
 */
export const EventLocations = ({ areas = [], openForm }) => {
  const locations = areas.map((area) => area.strings.name.en).join(', ');
  return isEmpty(areas) ? null : (
    <div style={{ marginTop: '40px' }}>
      <EventDetailsSectionHeader
        title="AFFECT AREAS"
        actions={
          <Button
            shape="circle"
            icon={<PlusCircleOutlined />}
            title="Update Affected Areas"
            className="actionButton not-printable"
            onClick={() =>
              openForm({ key: 'areas', label: 'Add affected Areas' })
            }
          />
        }
      />
      {locations}
    </div>
  );
};

/**
 * @param {object} props props object
 * @param {*} props.places valid places
 * @function
 * @name EventPlaces
 * @description Section which show event affected place(s) in hierarchy
 * @returns {object} React component
 * @version 0.1.0
 * @since 0.1.0
 */
export const EventPlaces = ({ places = '' }) => {
  return isEmpty(places) ? null : (
    <div style={{ marginTop: '40px' }}>
      <EventDetailsSectionHeader title="AFFECT PLACES" />

      <span>{places}</span>
    </div>
  );
};

/**
 * @function
 * @param {object} props Event action taken props
 * @param {object[]} props.actions valid actions
 * @param {Function} props.openForm open callback
 * @name EventActionsTaken
 * @description Section which show actions taken per event
 * @returns {object} React component
 * @version 0.1.0
 * @since 0.1.0
 */
export const EventActionsTaken = ({ actions = [], openForm }) => {
  return isEmpty(actions) ? null : (
    <div style={{ marginTop: '40px' }}>
      <EventDetailsSectionHeader
        title="ACTION TAKEN/ INTERVENTIONS"
        actions={
          <Button
            shape="circle"
            icon={<PlusCircleOutlined />}
            title="Update Actions Taken"
            className="actionButton not-printable"
            onClick={() =>
              openForm({
                key: 'interventions',
                label: 'Record Interventions/Actions Taken',
              })
            }
          />
        }
      />
      {actions.map((action, key) => (
        <p key={action} style={{ fontSize: '12px' }}>
          {key + 1}. {action}
        </p>
      ))}
    </div>
  );
};

/**
 * @param {object} props props object
 * @param {object[]} props.agencies list of agencies
 * @param {Function} props.openForm open callback
 * @function
 * @name EventRespondingAgencies
 * @description Section which show event responding agencies
 * @returns {object} React component
 * @version 0.1.0
 * @since 0.1.0
 */
export const EventRespondingAgencies = ({ agencies = [], openForm }) => {
  return (
    <div style={{ marginTop: '40px' }}>
      <EventDetailsSectionHeader
        title="AGENCIES RESPONDED"
        actions={
          <Button
            shape="circle"
            icon={<PlusCircleOutlined />}
            title="Add Agency"
            className="actionButton not-printable"
            onClick={() =>
              openForm({ key: 'agencies', label: 'Add participated Agencies' })
            }
          />
        }
      />
      {agencies.map((agency, key) => (
        // eslint-disable-next-line
        <p key={agency._id} style={{ fontSize: '12px' }}>
          {key + 1}. {`${agency.name} (${agency.abbreviation})`}
        </p>
      ))}
    </div>
  );
};

/**
 * @param {object} props props object
 * @param {object[]} props.focalPeople list of focal people
 * @param {Function} props.openForm open callback
 * @function
 * @name EventRespondingFocalPeople
 * @description Section which show event responding agencies
 * @returns {object} React component
 * @version 0.1.0
 * @since 0.1.0
 */
export const EventRespondingFocalPeople = ({ focalPeople = [], openForm }) => {
  return isEmpty(focalPeople) ? null : (
    <div style={{ marginTop: '40px' }}>
      <EventDetailsSectionHeader
        title="FOCAL PEOPLE RESPONDED"
        actions={
          <Button
            shape="circle"
            icon={<PlusCircleOutlined />}
            title="Add Focal Person"
            className="actionButton not-printable"
            onClick={() =>
              openForm({
                key: 'focalPeople',
                label: 'Add participated Focal People',
              })
            }
          />
        }
      />

      {focalPeople.map((focalPerson, key) => (
        // eslint-disable-next-line no-underscore-dangle
        <p key={focalPerson._id} style={{ fontSize: '12px' }}>
          {key + 1}. {`${focalPerson.name}`}
        </p>
      ))}
    </div>
  );
};

/**
 * @function
 * @param {object} props Component props
 * @param {object} props.initiator valid initiator
 * @param {Date} props.date valid date
 * @name EventFeedItemHeader
 * @description Render Event feed item header
 * @returns {object} EventFeedItemHeader component
 * @version 0.1.0
 * @since 0.1.0
 */
const EventFeedItemHeader = ({ initiator, date }) => {
  return (
    <div style={{ marginBottom: '10px' }}>
      <Tag color="orange">Update</Tag> by <Tag>{initiator.name}</Tag> on{' '}
      <Tag color="blue">{formatDate(date, 'YYYY-MM-DD HH:mm')}</Tag>
    </div>
  );
};

/**
 * @param {object} props props object
 * @param {Function} props.openForm open callback
 * @function
 * @name EventImpact
 * @description Display Event impact based on indicators
 * @returns {object} Event Impact Component
 * @version 0.1.0
 * @since 0.1.0
 */
const EventImpact = ({ openForm }) => {
  const columns = [
    { title: 'Damage and Losses', dataIndex: 'name', key: 'name' },
    { title: 'Number', dataIndex: 'value', key: 'value' },
  ];

  const data = [
    { name: 'Deaths', value: 10 },
    { name: 'Affected', value: 254 },
    { name: 'Recovered', value: 11 },
  ];

  return (
    <div style={{ marginTop: '40px' }}>
      <EventDetailsSectionHeader
        title="IMPACT"
        actions={
          <Button
            shape="circle"
            icon={<PlusCircleOutlined />}
            title="Record Effect & Need"
            className="actionButton not-printable"
            onClick={() =>
              openForm({ key: 'damage', label: 'Record Effect & Need' })
            }
          />
        }
      />
      <Table columns={columns} dataSource={data} pagination={false} />
    </div>
  );
};

/**
 * @function
 * @param {object} props React components props
 * @param {object[]} props.gaps list of gaps
 * @param {Function} props.openForm open callback
 * @name EventGaps
 * @description Event Gaps and Constraints
 * @returns {object} EventGaps
 * @version 0.1.0
 * @since 0.1.0
 */
const EventGaps = ({ gaps = [], openForm }) => {
  return (
    <div style={{ marginTop: '40px' }}>
      <EventDetailsSectionHeader
        title="GAPS & CONSTRAINTS"
        actions={
          <Button
            shape="circle"
            icon={<PlusCircleOutlined />}
            title="Record Effect & Need"
            className="actionButton not-printable"
            onClick={() =>
              openForm({
                key: 'constraints',
                label: 'Record Gaps or Constraints',
              })
            }
          />
        }
      />
      {gaps.map((gap, index) => (
        <Paragraph key={gap}>{`${index + 1}. ${gap}`}</Paragraph>
      ))}
    </div>
  );
};

/**
 * @function
 * @param {object} props React components props
 * @param {object[]} props.recommendations list of recommendations
 * @param {Function} props.openForm open callback
 * @name EventRecommendations
 * @description Event Recommendations and Remarks
 * @returns {object} EventRecommendations
 * @version 0.1.0
 * @since 0.1.0
 */
const EventRecommendations = ({ recommendations = [], openForm }) => {
  return (
    <div style={{ marginTop: '40px' }}>
      <EventDetailsSectionHeader
        title="COMMENTS AND RECOMMENDATIONS"
        actions={
          <Button
            shape="circle"
            icon={<PlusCircleOutlined />}
            title="Record Effect & Need"
            className="actionButton not-printable"
            onClick={() =>
              openForm({
                key: 'remarks',
                label: 'Record Remarks or Recommendations',
              })
            }
          />
        }
      />
      {recommendations.map((recommendation, index) => (
        <Paragraph key={recommendation}>{`${
          index + 1
        }. ${recommendation}`}</Paragraph>
      ))}
    </div>
  );
};

/**
 * @function
 * @name renderComment
 * @description Render added comment in an event changelog entry
 * @param {object} feed A single changelog entry
 * @returns {object} React component
 * @version 0.1.0
 * @since 0.1.0
 * @private
 */
const renderComment = (feed) => (
  // eslint-disable-next-line no-underscore-dangle
  <Timeline.Item key={feed._id} dot={<MessageOutlined />}>
    <EventFeedItemHeader initiator={feed.initiator} date={feed.createdAt} />
    <p>commented: {feed.comment}</p>
  </Timeline.Item>
);

/**
 * @function
 * @name renderImage
 * @description Render added image file in an event changelog entry
 * @param {object} feed A single changelog entry
 * @returns {object} React component
 * @version 0.1.0
 * @since 0.1.0
 * @private
 */
const renderImage = (feed) => (
  <Timeline.Item
    key={`${feed._id}-${feed.filename}`} // eslint-disable-line no-underscore-dangle
    dot={<FileImageOutlined />}
  >
    <EventFeedItemHeader initiator={feed.initiator} date={feed.createdAt} />
    <Card
      hoverable
      style={{ width: 300 }}
      bodyStyle={{ display: 'none' }}
      actions={[
        <a
          // eslint-disable-next-line no-underscore-dangle
          key={`view-${feed._id}`}
          href={`${getBaseUrl()}${feed.image.stream}?token=${getJwtToken()}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <EyeOutlined key="eye" />
        </a>,
        <a
          // eslint-disable-next-line no-underscore-dangle
          key={`download-${feed._id}`}
          href={`${getBaseUrl()}${feed.image.download}?token=${getJwtToken()}`}
        >
          <DownloadOutlined key="download" />
        </a>,
      ]}
      cover={
        <img
          alt="example"
          src={`${getBaseUrl()}${feed.image.stream}?token=${getJwtToken()}`}
        />
      }
    />
  </Timeline.Item>
);

/**
 * @function
 * @name renderFocals
 * @description Render added focal people in an event changelog entry
 * @param {object} feed A single changelog entry
 * @returns {object} React component
 * @version 0.1.0
 * @since 0.1.0
 * @private
 */
const renderFocals = (feed) => {
  return map(feed.focals, (focal) => (
    // eslint-disable-next-line no-underscore-dangle
    <Timeline.Item key={feed._id} dot={<UserOutlined />}>
      <EventFeedItemHeader initiator={feed.initiator} date={feed.createdAt} />
      added: <Tag color="cyan">{focal.name}</Tag>
    </Timeline.Item>
  ));
};

/**
 * @function
 * @name renderAreas
 * @description Render added agencies in an event changelog entry
 * @param {object} feed A single changelog entry
 * @returns {object} React component
 * @version 0.1.0
 * @since 0.1.0
 * @private
 */
const renderAgencies = (feed) => {
  return map(feed.agencies, (agency) => (
    // eslint-disable-next-line no-underscore-dangle
    <Timeline.Item key={feed._id} dot={<ApartmentOutlined />}>
      <EventFeedItemHeader initiator={feed.initiator} date={feed.createdAt} />
      added Agency: <Tag color="magenta">{agency.name}</Tag>
    </Timeline.Item>
  ));
};

/**
 * @function
 * @name renderAreas
 * @description Render added areas in an event changelog entry
 * @param {object} feed A single changelog entry
 * @returns {object} React component
 * @version 0.1.0
 * @since 0.1.0
 * @private
 */
const renderAreas = (feed) => {
  return map(feed.areas, (area) => (
    // eslint-disable-next-line no-underscore-dangle
    <Timeline.Item key={area._id} dot={<EnvironmentOutlined />}>
      <EventFeedItemHeader initiator={feed.initiator} date={feed.createdAt} />
      added affected area: <Tag color="geekblue">
        {area.strings.name.en}
      </Tag>{' '}
    </Timeline.Item>
  ));
};

/**
 * @function
 * @name renderFeed
 * @description Render a single event changelog
 * @param {object} feed A single changelog entry
 * @returns {object} React component
 * @version 0.1.0
 * @since 0.1.0
 * @private
 */
const renderFeed = (feed) => {
  let feedItems = [];

  if (feed.comment) {
    feedItems = concat(feedItems, renderComment(feed));
  }

  if (feed.image) {
    feedItems = concat(feedItems, renderImage(feed));
  }

  if (feed.focals) {
    feedItems = concat(feedItems, ...renderFocals(feed));
  }

  if (feed.agencies) {
    feedItems = concat(feedItems, ...renderAgencies(feed));
  }

  if (feed.areas) {
    feedItems = concat(feedItems, ...renderAreas(feed));
  }

  return feedItems;
};

/**
 * @function
 * @param {object} props React props
 * @param {object[]} props.feeds list of feeds
 * @param {boolean} props.loading loading flag
 * @param {boolean} props.hasMore more flag
 * @name EventFeed
 * @description A list of activities(feeds) happening on a particular event
 * @returns {object} React component
 * @version 0.1.0
 * @since 0.1.0
 */
export const EventFeed = ({ feeds = [], loading, hasMore }) => {
  const feedComponents = flatten(
    map(feeds, (feed) => {
      return renderFeed(feed);
    })
  );

  return (
    <div className="not-printable">
      <EventDetailsSectionHeader title="EVENT FEED" />

      <Spin spinning={loading}>
        {isEmpty(feeds) ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <>
            {!loading && <Timeline>{feedComponents}</Timeline>}

            {hasMore && (
              <Button
                loading={loading}
                onClick={() => loadMoreChangelogs()}
                className="LoadMoreButton"
              >
                Load More ...
              </Button>
            )}
          </>
        )}
      </Spin>
    </div>
  );
};

/**
 * @function
 * @param {object} props PrintEventDetails Props
 * @param {string} props.type event type
 * @param {string} props.description event description
 * @param {string} props.number event number
 * @param {Date} props.reportedDate event report date
 * @name PrintedEventDetails
 * @description This is event details section which will be visible on printed
 * report only
 * @returns {object} PrintedEventDetails Component
 * @version 0.1.0
 * @since 0.1.0
 */
const PrintedEventDetails = ({ type, description, number, reportedDate }) => {
  return (
    <>
      <p>
        <Text strong>Event: </Text> {type}
      </p>
      <p>
        <Text strong>Event Number: </Text> {number} <br />
      </p>
      <p>
        <Text strong>Event Description:</Text>: {description} <br />
      </p>
      <p>
        <Text strong>Reported Date: </Text> {reportedDate} <br />
      </p>
    </>
  );
};

/**
 * @function
 * @param {object} props React props
 * @param {object} props.event valid event
 * @param {boolean} props.showForm show flag
 * @param {boolean} props.posting posting flag
 * @param {object[]} props.changelogs list of changelogs
 * @param {boolean} props.loading loading flag
 * @param {boolean} props.hasMore more flag
 * @param {Function} props.onEdit edit callback
 * @param {Function} props.onShare share callback
 * @param {boolean} props.eventPosting event posting flag
 * @name EventDetailsViewBody
 * @description Event Details body view
 * @returns {object} React component
 * @version 0.1.0
 * @since 0.1.0
 */
const EventDetailsViewBody = ({
  event,
  showForm,
  posting,
  changelogs,
  loading,
  hasMore,
  onEdit,
  onShare,
  eventPosting,
}) => {
  const [action, setAction] = useState({ key: '', label: '' });
  const [showIndicatorDashboard, setShowIndicatorDashboard] = useState(false);
  const componentRef = useRef();

  useEffect(() => {
    filterChangelogs({ event: event._id }); // eslint-disable-line
  }, [event]); // eslint-disable-line

  const openForm = useCallback((type) => {
    setAction(type);
    openChangelogForm();
  }, []);

  return (
    <div className="EventBody">
      <EventToolbar
        event={event}
        openForm={openForm}
        onEdit={onEdit}
        onShare={onShare}
        onContent={() => componentRef.current}
        openIndicatorDashboard={() => setShowIndicatorDashboard(true)}
      />
      <div className="EventBodyContent">
        <Row ref={componentRef}>
          <Col span={16} className="print-only">
            <PrintedEventDetails
              number={get(event, 'number', 'N/A')}
              type={get(event, 'type.strings.name.en', 'N/A')}
              description={get(event, 'description', 'N/A')}
              reportedDate={formatDate(event.createdAt, 'DD/MM/YYYY')}
            />
          </Col>
          <Col span={16}>
            <EventCause cause={get(event, 'causes', 'N/A')} />
            <EventLocations areas={event.areas} openForm={openForm} />
            {event.places && <EventPlaces places={event.places} />}
            <EventRespondingAgencies
              agencies={event.agencies}
              openForm={openForm}
            />
            <EventRespondingFocalPeople
              focalPeople={event.focals}
              openForm={openForm}
            />
            <EventActionsTaken
              actions={event.interventions}
              openForm={openForm}
            />
            <EventImpact openForm={openForm} />
            <EventGaps gaps={event.constraints} openForm={openForm} />
            <EventRecommendations
              recommendations={event.remarks}
              openForm={openForm}
            />
          </Col>
          <Col span={8}>
            <EventFeed
              feeds={changelogs}
              loading={loading}
              hasMore={hasMore}
              className="not-printable"
            />
          </Col>
        </Row>
      </div>

      <Modal
        title={action.label}
        visible={showForm}
        className="FormModal"
        footer={null}
        onCancel={() => closeChangelogForm()}
        destroyOnClose
        maskClosable={false}
      >
        <EventChangelogForm
          action={action.key}
          event={event}
          posting={posting || eventPosting}
          onCancel={() => closeChangelogForm()}
        />
      </Modal>

      <Drawer
        title={
          <EventDetailsViewHeader
            number={event ? event.number : 'N/A'}
            description="INDICATORS DASHBOARD"
            type={event ? event.type.strings.name.en : 'N/A'}
            stage={event ? event.stage : 'N/A'}
          />
        }
        placement="right"
        width="100%"
        onClose={() => setShowIndicatorDashboard(false)}
        visible={showIndicatorDashboard}
        drawerStyle={{ overflow: 'hidden' }}
        bodyStyle={{
          overflow: 'hidden',
          height: '100%',
          padding: '15px',
        }}
        destroyOnClose
      >
        <IndicatorDashboard />
      </Drawer>
    </div>
  );
};

EventRespondingFocalPeople.propTypes = {
  focalPeople: PropTypes.arrayOf(PropTypes.object).isRequired,
  openForm: PropTypes.func.isRequired,
};

EventRespondingAgencies.propTypes = {
  agencies: PropTypes.arrayOf(PropTypes.object).isRequired,
  openForm: PropTypes.func.isRequired,
};

EventDetailsSectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  actions: PropTypes.node,
};

EventLocations.propTypes = {
  areas: PropTypes.arrayOf(PropTypes.object).isRequired,
  openForm: PropTypes.func.isRequired,
};

EventImpact.propTypes = { openForm: PropTypes.func.isRequired };

EventPlaces.propTypes = {
  places: PropTypes.string.isRequired,
};

EventDetailsSectionHeader.defaultProps = {
  actions: null,
};

EventToolbar.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.string,
  }).isRequired,
  openForm: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
  onContent: PropTypes.func.isRequired,
  openIndicatorDashboard: PropTypes.func.isRequired,
};

EventActionsTaken.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.string).isRequired,
  openForm: PropTypes.func.isRequired,
};

EventFeedItemHeader.propTypes = {
  initiator: PropTypes.shape({ name: PropTypes.string }).isRequired,
  date: PropTypes.string.isRequired,
};

EventGaps.propTypes = {
  gaps: PropTypes.arrayOf(PropTypes.string).isRequired,
  openForm: PropTypes.func.isRequired,
};

EventRecommendations.propTypes = {
  recommendations: PropTypes.arrayOf(PropTypes.string).isRequired,
  openForm: PropTypes.func.isRequired,
};

EventFeed.propTypes = {
  feeds: PropTypes.arrayOf(
    PropTypes.shape({ _id: PropTypes.string, comment: PropTypes.string })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  hasMore: PropTypes.bool.isRequired,
};

EventCause.propTypes = {
  cause: PropTypes.string.isRequired,
};

PrintedEventDetails.propTypes = {
  type: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  number: PropTypes.string.isRequired,
  reportedDate: PropTypes.string.isRequired,
};

EventDetailsViewBody.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.string,
    number: PropTypes.string,
    type: PropTypes.shape({
      strings: {
        name: { en: PropTypes.string },
      },
    }),
    stage: PropTypes.string,
    focals: PropTypes.arrayOf(PropTypes.object),
    agencies: PropTypes.arrayOf(PropTypes.object),
    areas: PropTypes.arrayOf(PropTypes.object),
    gaps: PropTypes.arrayOf(PropTypes.string),
    constraints: PropTypes.arrayOf(PropTypes.string),
    interventions: PropTypes.arrayOf(PropTypes.string),
    remarks: PropTypes.arrayOf(PropTypes.string),
    places: PropTypes.string,
    createdAt: PropTypes.string,
  }).isRequired,
  changelogs: PropTypes.arrayOf(PropTypes.shape({ _id: PropTypes.string }))
    .isRequired,
  showForm: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  hasMore: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
  eventPosting: PropTypes.bool.isRequired,
};

export default Connect(EventDetailsViewBody, {
  changelogs: 'changelogs.list',
  showForm: 'changelogs.showForm',
  posting: 'changelogs.posting',
  loading: 'changelogs.loading',
  hasMore: 'changelogs.hasMore',
  eventPosting: 'events.posting',
});
