import React, { useEffect, useCallback, useState } from 'react';
import { getBaseUrl, getJwtToken } from '@codetanzania/ewea-api-client';
import {
  openChangelogForm,
  closeChangelogForm,
  getEvent,
  Connect,
  filterChangelogs,
  loadMoreChangelogs,
} from '@codetanzania/ewea-api-states';

import {
  ApartmentOutlined,
  AuditOutlined,
  DownloadOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  FileDoneOutlined,
  FileImageOutlined,
  MessageOutlined,
  NotificationOutlined,
  PrinterOutlined,
  ReloadOutlined,
  ShareAltOutlined,
  SwapOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  WechatOutlined,
} from '@ant-design/icons';

import {
  Tag,
  Timeline,
  Row,
  Col,
  Button,
  Modal,
  Card,
  Empty,
  Spin,
} from 'antd';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';

import get from 'lodash/get';
import { formatDate, notifySuccess, notifyError } from '../../../util';
import EventChangelogForm from '../ChangelogForm';
import './styles.css';

const actionsTaken = ['Test Action 1', 'Test Action 2'];

/**
 * @function
 * @name EventDetailsSectionHeader
 * @description Header section for event details drawer
 *
 * @param {object} props React props
 * @returns {object} React component
 *
 * @version 0.1.0
 * @since 0.1.0
 */
export const EventDetailsSectionHeader = ({ title, actions }) => {
  return (
    <div className="EventDetailsSectionHeader">
      <Row>
        <Col span={16}>
          <h4>{title}</h4>
        </Col>
        <Col span={8}>{actions}</Col>
      </Row>
    </div>
  );
};

/**
 * @function
 * @name EventLocations
 * @description Section which show event location(s) in hierarchy
 *
 * @returns {object} React component
 * @version 0.1.0
 * @since 0.1.0
 */
export const EventLocations = ({ areas = [] }) => {
  const locations = areas.map((area) => area.strings.name.en).join(', ');
  return isEmpty(areas) ? null : (
    <div style={{ marginTop: '40px' }}>
      <EventDetailsSectionHeader title="AFFECT AREAS" />

      {locations}
    </div>
  );
};

/**
 * @function
 * @name EventPlaces
 * @description Section which show event affected place(s) in hierarchy
 *
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
 * @name EventActionsTaken
 * @description Section which show actions taken per event
 *
 * @returns {object} React component
 * @version 0.1.0
 * @since 0.1.0
 */
export const EventActionsTaken = () => {
  return isEmpty(actionsTaken) ? null : (
    <div style={{ marginTop: '40px' }}>
      <EventDetailsSectionHeader title="ACTION TAKEN/ INTERVENTIONS" />
      {actionsTaken.map((action, key) => (
        <p key={action} style={{ fontSize: '12px' }}>
          {key + 1}. {action}
        </p>
      ))}
    </div>
  );
};

/**
 * @function
 * @name EventRespondingAgencies
 * @description Section which show event responding agencies
 *
 * @returns {object} React component
 * @version 0.1.0
 * @since 0.1.0
 */
export const EventRespondingAgencies = ({ agencies = [] }) => {
  return isEmpty(agencies) ? null : (
    <div style={{ marginTop: '40px' }}>
      <EventDetailsSectionHeader title="AGENCIES RESPONDED" />
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
 * @function
 * @name EventRespondingFocalPeople
 * @description Section which show event responding agencies
 *
 * @returns {object} React component
 * @version 0.1.0
 * @since 0.1.0
 */
export const EventRespondingFocalPeople = ({ focalPeople = [] }) => {
  return isEmpty(focalPeople) ? null : (
    <div style={{ marginTop: '40px' }}>
      <EventDetailsSectionHeader title="FOCAL PEOPLE RESPONDED" />

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
 * @name EventToolbar
 * @description List of actions user can perform on a particular event
 *
 * @param {object} props React props
 * @returns {object} React component
 * @version 0.1.0
 * @since 0.1.0
 */
const EventToolbar = ({ event, openForm, onShare }) => {
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
            icon={<UserAddOutlined />}
            title="Add Focal Person"
            className="actionButton"
            onClick={() =>
              openForm({
                key: 'focalPeople',
                label: 'Add participated Focal People',
              })
            }
          />
        </Col>
        <Col span={1}>
          <Button
            shape="circle"
            size="large"
            icon={<UsergroupAddOutlined />}
            title="Add Agency"
            className="actionButton"
            onClick={() =>
              openForm({ key: 'agencies', label: 'Add participated Agencies' })
            }
          />
        </Col>
        <Col span={1}>
          <Button
            shape="circle"
            size="large"
            icon={<EnvironmentOutlined />}
            title="Update Affected Areas"
            className="actionButton"
            onClick={() =>
              openForm({ key: 'areas', label: 'Add affected Areas' })
            }
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
            icon={<FileDoneOutlined />}
            title="Update Actions Taken"
            className="actionButton"
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
            icon={<AuditOutlined />}
            title="Record Effect & Need"
            className="actionButton"
            onClick={() =>
              openForm({ key: 'damage', label: 'Record Effect & Need' })
            }
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
            icon={<PrinterOutlined />}
            title="Print Event Details"
            className="actionButton"
            onClick={() => {
              window.print(); // eslint-disable-line
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

/**
 * @function
 * @name EventFeed
 * @description A list of activities(feeds) happening on a particular event
 *
 * @param {object} props React props
 * @returns {object} React component
 * @version 0.1.0
 * @since 0.1.0
 */
export const EventFeed = ({ feeds = [], loading, hasMore }) => {
  const feedItems = feeds.map((feed) => {
    if (feed.comment && feed.image) {
      return (
        <>
          {/* comments */}
          {/* eslint-disable-next-line no-underscore-dangle */}
          <Timeline.Item key={feed._id} dot={<MessageOutlined />}>
            {feed.comment}{' '}
            <Tag>{formatDate(feed.createdAt, 'YYYY-MM-DD HH:mm')}</Tag>{' '}
          </Timeline.Item>
          {/* comments */}

          {/* image */}
          <Timeline.Item
            key={`${feed._id}-${feed.filename}`} // eslint-disable-line no-underscore-dangle
            dot={<FileImageOutlined />}
          >
            <Card
              hoverable
              style={{ width: 300 }}
              bodyStyle={{ display: 'none' }}
              actions={[
                <a
                  // eslint-disable-next-line no-underscore-dangle
                  key={`view-${feed._id}`}
                  href={`${getBaseUrl()}${
                    feed.image.stream
                  }?token=${getJwtToken()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <EyeOutlined key="eye" />
                </a>,
                <a
                  // eslint-disable-next-line no-underscore-dangle
                  key={`download-${feed._id}`}
                  href={`${getBaseUrl()}${
                    feed.image.download
                  }?token=${getJwtToken()}`}
                >
                  <DownloadOutlined key="download" />
                </a>,
              ]}
              cover={
                <img
                  alt="example"
                  src={`${getBaseUrl()}${
                    feed.image.stream
                  }?token=${getJwtToken()}`}
                />
              }
            />
            <div style={{ marginTop: '12px' }}>
              <Tag>{formatDate(feed.createdAt, 'YYYY-MM-DD HH:mm')}</Tag>
            </div>
          </Timeline.Item>
          {/* end image */}
        </>
      );
    }

    /* comments */
    if (feed.comment) {
      return (
        // eslint-disable-next-line no-underscore-dangle
        <Timeline.Item key={feed._id} dot={<MessageOutlined />}>
          <Tag>{feed.initiator.name}</Tag> commented: {feed.comment} on
          <Tag>{formatDate(feed.createdAt, 'YYYY-MM-DD HH:mm')}</Tag>{' '}
        </Timeline.Item>
      );
    }
    /* comments */

    if (feed.focals) {
      return feed.focals.map((focal) => (
        // eslint-disable-next-line no-underscore-dangle
        <Timeline.Item key={feed._id} dot={<UserOutlined />}>
          <Tag>{feed.initiator.name}</Tag> added focal:{' '}
          <Tag color="cyan">{focal.name}</Tag> on{' '}
          <Tag>{formatDate(feed.createdAt, 'YYYY-MM-DD HH:mm')}</Tag>
        </Timeline.Item>
      ));
    }

    if (feed.agencies) {
      return feed.agencies.map((agency) => (
        // eslint-disable-next-line no-underscore-dangle
        <Timeline.Item key={feed._id} dot={<ApartmentOutlined />}>
          <Tag>{feed.initiator.name}</Tag> added agency:{' '}
          <Tag color="magenta">{agency.name}</Tag> on{' '}
          <Tag>{formatDate(feed.createdAt, 'YYYY-MM-DD HH:mm')}</Tag>
        </Timeline.Item>
      ));
    }

    if (feed.areas) {
      return feed.areas.map((area) => (
        // eslint-disable-next-line no-underscore-dangle
        <Timeline.Item key={area._id} dot={<EnvironmentOutlined />}>
          <Tag>{feed.initiator.name}</Tag> added affected area:{' '}
          <Tag color="geekblue">{area.strings.name.en}</Tag> on{' '}
          <Tag>{formatDate(area.createdAt, 'YYYY-MM-DD HH:mm')}</Tag>
        </Timeline.Item>
      ));
    }

    return null;
  });

  console.log('Event Feed', feedItems);
  return (
    <div className="not-printable">
      <EventDetailsSectionHeader title="EVENT FEED" />

      <Spin spinning={loading}>
        {isEmpty(feeds) ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <>
            {!loading && <Timeline>{feedItems}</Timeline>}

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
 * @name EventCause
 * @description Display Event Cause
 * @param {object} props React props
 *
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
 * @name  EventDetailsViewBody
 * @description Event Details body view
 *
 * @param {object} props React props
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
  onShare,
}) => {
  const [action, setAction] = useState({ key: '', label: '' });

  useEffect(() => {
    filterChangelogs({ event: event._id }); // eslint-disable-line
  }, [event]);

  const openForm = useCallback((type) => {
    setAction(type);
    openChangelogForm();
  }, []);

  return (
    <div className="EventBody">
      <EventToolbar
        event={event}
        openForm={openForm}
        onShare={onShare}
        className="printable"
      />
      <div className="EventBodyContent">
        <Row>
          <Col span={16}>
            <EventCause cause={get(event, 'causes', 'N/A')} />
            <EventLocations areas={event.areas} />
            {event.places && <EventPlaces places={event.places} />}
            <EventRespondingAgencies agencies={event.agencies} />
            <EventRespondingFocalPeople focalPeople={event.focals} />
            <EventActionsTaken />
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
          posting={posting}
          onCancel={() => closeChangelogForm()}
        />
      </Modal>
    </div>
  );
};

EventRespondingFocalPeople.propTypes = {
  focalPeople: PropTypes.arrayOf(PropTypes.object).isRequired,
};

EventRespondingAgencies.propTypes = {
  agencies: PropTypes.arrayOf(PropTypes.object).isRequired,
};

EventDetailsSectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  actions: PropTypes.node,
};

EventLocations.propTypes = {
  areas: PropTypes.arrayOf(PropTypes.object).isRequired,
};

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
  onShare: PropTypes.func.isRequired,
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

EventDetailsViewBody.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.string,
    focals: PropTypes.arrayOf(PropTypes.object),
    agencies: PropTypes.arrayOf(PropTypes.object),
    areas: PropTypes.arrayOf(PropTypes.object),
    places: PropTypes.string,
  }).isRequired,
  changelogs: PropTypes.arrayOf(PropTypes.shape({ _id: PropTypes.string }))
    .isRequired,
  showForm: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  hasMore: PropTypes.bool.isRequired,
  onShare: PropTypes.func.isRequired,
};

export default Connect(EventDetailsViewBody, {
  changelogs: 'changelogs.list',
  showForm: 'changelogs.showForm',
  posting: 'changelogs.posting',
  loading: 'changelogs.loading',
  hasMore: 'changelogs.hasMore',
});
