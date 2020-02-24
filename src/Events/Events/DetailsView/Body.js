import React, { useEffect, useCallback, useState } from 'react';
import { getBaseUrl } from '@codetanzania/ewea-api-client';
import {
  openChangelogForm,
  closeChangelogForm,
  getEvent,
  Connect,
  filterChangelogs,
  loadMoreChangelogs,
} from '@codetanzania/ewea-api-states';
import {
  Typography,
  Tag,
  Timeline,
  Row,
  Col,
  Button,
  Modal,
  Icon,
  Card,
  Empty,
  Spin,
} from 'antd';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';

import { formatDate, notifySuccess, notifyError } from '../../../util';
import EventChangelogForm from '../ChangelogForm';
import './styles.css';

const { Text } = Typography;
const ButtonGroup = Button.Group;

const respondingAgencies = [
  'District Authority',
  'TANROADS & TARURA',
  'DMDP',
  'Hospitals',
];

const actionsTaken = [
  'Cleanup drains',
  'Ensure evacuation centers are in good condition',
  'Ensure clean water is available',
  'Ensure all important information have been disseminated to responsible personnel',
];

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
 * @name EventLocation
 * @description Section which show event location(s) in hierarchy
 *
 * @returns {object} React component
 * @version 0.1.0
 * @since 0.1.0
 */
export const EventLocation = () => {
  return (
    <>
      <EventDetailsSectionHeader title="EVENT LOCATION" />
      <h5>
        <Text strong>Region:</Text> Mwanza
      </h5>
      <h5>
        <Text strong>District:</Text> Mwanza
      </h5>
      <h5>
        <Text strong>Ward:</Text> Mwanza
      </h5>
      <h5>
        <Text strong>Village/Sub-ward:</Text> Mwanza
      </h5>
    </>
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
  return (
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
export const EventRespondingAgencies = () => {
  return (
    <div style={{ marginTop: '40px' }}>
      <EventDetailsSectionHeader title="AGENCIES RESPONDED" />
      {respondingAgencies.map((agency, key) => (
        <p key={agency} style={{ fontSize: '12px' }}>
          {key + 1}. {agency}
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
const EventToolbar = ({ event, openForm }) => {
  return (
    <div className="EventToolbar">
      <ButtonGroup>
        <Button
          type="link"
          size="large"
          icon="reload"
          title="Refresh Event"
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
        <Button
          type="link"
          size="large"
          icon="user-add"
          title="Add Focal Person"
          onClick={() =>
            openForm({
              key: 'focalPeople',
              label: 'Add participated Focal People',
            })
          }
        />
        <Button
          type="link"
          size="large"
          icon="usergroup-add"
          title="Add Agency"
          onClick={() =>
            openForm({ key: 'agencies', label: 'Add participated Agencies' })
          }
        />
        <Button
          type="link"
          size="large"
          icon="environment"
          title="Update Location"
        />
        <Button
          type="link"
          size="large"
          icon="file-image"
          title="Upload Image"
          onClick={() => openForm({ key: 'file', label: 'Upload File' })}
        />
        <Button
          type="link"
          size="large"
          icon="file-done"
          title="Update Actions Taken"
        />
        <Button
          type="link"
          size="large"
          icon="interaction"
          title="Update Event Feed"
        />
        <Button
          type="link"
          size="large"
          icon="audit"
          title="Record Damage & Losses"
          onClick={() =>
            openForm({ key: 'damage', label: 'Record Damage and Losses' })
          }
        />
        <Button
          type="link"
          size="large"
          icon="wechat"
          title="Add Comment"
          onClick={() => openForm({ key: 'comment', label: 'Add a Comment' })}
        />
        <Button
          type="link"
          size="large"
          icon="printer"
          title="Print Event Details"
        />
      </ButtonGroup>
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
  console.log('Feeds', feeds.length, feeds);
  return (
    <>
      <EventDetailsSectionHeader title="EVENT FEED" />

      <Spin spinning={loading}>
        {isEmpty(feeds) ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <>
            {!loading && (
              <Timeline>
                {/* eslint-disable no-underscore-dangle */}
                {feeds.map(feed => {
                  return (
                    <>
                      {/* comments */}
                      {feed.comment && (
                        <Timeline.Item
                          key={feed._id}
                          dot={<Icon type="message" />}
                        >
                          {feed.comment}{' '}
                          <Tag>
                            {formatDate(feed.createdAt, 'YYYY-MM-DD HH:mm')}
                          </Tag>{' '}
                        </Timeline.Item>
                      )}
                      {/* end comments */}

                      {/* images */}
                      {feed.image && (
                        <Timeline.Item
                          key={feed._id}
                          dot={<Icon type="file-image" />}
                        >
                          <Card
                            hoverable
                            style={{ width: 300 }}
                            bodyStyle={{ display: 'none' }}
                            actions={[
                              <a
                                key={`view-${feed._id}`}
                                href={`${getBaseUrl()}${feed.image.stream}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Icon type="eye" key="eye" />
                              </a>,
                              <a
                                key={`download-${feed._id}`}
                                href={`${getBaseUrl()}${feed.image.download}`}
                              >
                                <Icon type="download" key="download" />
                              </a>,
                            ]}
                            cover={
                              <img
                                alt="example"
                                src={`${getBaseUrl()}${feed.image.stream}`}
                              />
                            }
                          />
                          <div style={{ marginTop: '12px' }}>
                            <Tag>
                              {formatDate(feed.createdAt, 'YYYY-MM-DD HH:mm')}
                            </Tag>
                          </div>
                        </Timeline.Item>
                      )}
                      {/* end images */}

                      {/* focal people */}
                      {feed.focals &&
                        feed.focals.map(focal => (
                          <Timeline.Item
                            key={feed._id}
                            dot={<Icon type="user" />}
                          >
                            Focal: <Tag color="cyan">{focal.name}</Tag> was
                            added on{' '}
                            <Tag>
                              {formatDate(feed.createdAt, 'YYYY-MM-DD HH:mm')}
                            </Tag>
                          </Timeline.Item>
                        ))}
                      {/* end focal people */}

                      {/* agencies */}
                      {feed.agencies &&
                        feed.agencies.map(focal => (
                          <Timeline.Item
                            key={feed._id}
                            dot={<Icon type="apartment" />}
                          >
                            Agency: <Tag color="magenta">{focal.name}</Tag> was
                            added on{' '}
                            <Tag>
                              {formatDate(feed.createdAt, 'YYYY-MM-DD HH:mm')}
                            </Tag>
                          </Timeline.Item>
                        ))}
                      {/* end agencies */}
                    </>
                  );
                })}
                {/* eslint-enable no-underscore-dangle */}
              </Timeline>
            )}

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
}) => {
  const [action, setAction] = useState({ key: '', label: '' });

  useEffect(() => {
    filterChangelogs({ event: event._id }); // eslint-disable-line
  }, [event]);

  const openForm = useCallback(type => {
    setAction(type);
    openChangelogForm();
  }, []);

  return (
    <div className="EventBody">
      <EventToolbar event={event} openForm={openForm} />
      <div className="EventBodyContent">
        <Row>
          <Col span={16}>
            <EventLocation />
            <EventRespondingAgencies />
            <EventActionsTaken />
          </Col>
          <Col span={8}>
            <EventFeed feeds={changelogs} loading={loading} hasMore={hasMore} />
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

EventDetailsSectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  actions: PropTypes.node,
};

EventDetailsSectionHeader.defaultProps = {
  actions: null,
};

EventToolbar.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.string,
  }).isRequired,
  openForm: PropTypes.func.isRequired,
};

EventFeed.propTypes = {
  feeds: PropTypes.arrayOf(
    PropTypes.shape({ _id: PropTypes.string, comment: PropTypes.string })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  hasMore: PropTypes.bool.isRequired,
};

EventDetailsViewBody.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.string,
  }).isRequired,
  changelogs: PropTypes.arrayOf(PropTypes.shape({ _id: PropTypes.string }))
    .isRequired,
  showForm: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  hasMore: PropTypes.bool.isRequired,
};

export default Connect(EventDetailsViewBody, {
  changelogs: 'changelogs.list',
  showForm: 'changelogs.showForm',
  posting: 'changelogs.posting',
  loading: 'changelogs.loading',
  hasMore: 'changelogs.hasMore',
});
