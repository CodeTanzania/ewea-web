import React from 'react';
import { Typography, Timeline, Icon, Row, Col, Button } from 'antd';
import PropTypes from 'prop-types';

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
  'Ensure evacutation centers are in good condition',
  'Ensure clean water is available',
  'Ensure all important information have been disseminated to responsible personnel',
];

export const EventDetailsSectionHeader = ({ title }) => {
  return (
    <div className="EventDetailsSectionHeader">
      <h4>{title}</h4>
    </div>
  );
};

EventDetailsSectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
};

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

export const EventActionTaken = () => {
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

export const EventRespondingFocals = () => {};

const EventToolbar = () => {
  return (
    <div className="EventToolbar">
      <ButtonGroup>
        <Button type="link" size="large" icon="reload" title="Refresh Event" />
        <Button
          type="link"
          size="large"
          icon="user-add"
          title="Add Focal Person"
        />
        <Button
          type="link"
          size="large"
          icon="usergroup-add"
          title="Add Agency"
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
          icon="printer"
          title="Print Event Details"
        />
      </ButtonGroup>
    </div>
  );
};

export const EventFeed = () => {
  return (
    <>
      <EventDetailsSectionHeader title="EVENT FEED" />
      <Timeline>
        <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
        <Timeline.Item color="green">
          Solve initial network problems 2015-09-01
        </Timeline.Item>
        <Timeline.Item
          dot={<Icon type="clock-circle-o" style={{ fontSize: '16px' }} />}
        >
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae
          ab illo inventore veritatis et quasi architecto beatae vitae dicta
          sunt explicabo.
        </Timeline.Item>
        <Timeline.Item color="red">
          Network problems being solved 2015-09-01
        </Timeline.Item>
        <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
        <Timeline.Item
          dot={<Icon type="clock-circle-o" style={{ fontSize: '16px' }} />}
        >
          Technical testing 2015-09-01
        </Timeline.Item>
        <Timeline.Item
          dot={<Icon type="clock-circle-o" style={{ fontSize: '16px' }} />}
        >
          Technical testing 2015-09-01
        </Timeline.Item>
        <Timeline.Item
          dot={<Icon type="clock-circle-o" style={{ fontSize: '16px' }} />}
        >
          Technical testing 2015-09-01
        </Timeline.Item>
        <Timeline.Item
          dot={<Icon type="clock-circle-o" style={{ fontSize: '16px' }} />}
        >
          Technical testing 2015-09-01
        </Timeline.Item>
        <Timeline.Item
          dot={<Icon type="clock-circle-o" style={{ fontSize: '16px' }} />}
        >
          Technical testing 2015-09-01
        </Timeline.Item>
        <Timeline.Item
          dot={<Icon type="clock-circle-o" style={{ fontSize: '16px' }} />}
        >
          Technical testing 2015-09-01
        </Timeline.Item>
        <Timeline.Item
          dot={<Icon type="clock-circle-o" style={{ fontSize: '16px' }} />}
        >
          Technical testing 2015-09-01
        </Timeline.Item>
      </Timeline>
    </>
  );
};

const EventDetailsViewBody = () => {
  return (
    <>
      <EventToolbar />
      <Row>
        <Col span={16}>
          <EventLocation />
          <EventRespondingAgencies />
          <EventActionTaken />
        </Col>
        <Col span={8}>
          <EventFeed />
        </Col>
      </Row>
    </>
  );
};

export default EventDetailsViewBody;
