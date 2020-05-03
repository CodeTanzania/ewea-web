import React, { useState } from 'react';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Input, Tooltip, Row, Col, Checkbox, Form } from 'antd';

import compact from 'lodash/compact';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import PropTypes from 'prop-types';
import SearchableSelectInput from '../SearchableSelectInput';
import { notifySuccess, notifyError } from '../../util';

/* constants */
const { TextArea } = Input;
const { postCampaign } = reduxActions;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 24 },
    xl: { span: 24 },
    xxl: { span: 24 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 24 },
    xl: { span: 24 },
    xxl: { span: 24 },
  },
};

/**
 * @function
 * @name NotificationForm
 * @description Notification Form component for notify parties based on areas,
 * roles, groups and e.t.c
 *
 * @returns {object} React component
 */
const NotificationForm = ({
  recipients = [],
  subject,
  body,
  onCancel,
  onSearchAgencies,
  onSearchRecipients,
  onSearchJurisdictions,
  onSearchGroups,
  onSearchRoles,
  posting,
}) => {
  /**
   * @function
   * @name onFinish
   * @description Function called when no validation errors
   * @param {object} values Form values
   * @version 0.2.0
   * @since 0.1.0
   */
  const onFinish = (values) => {
    const criteria = {};

    if (!isEmpty(values.agencies)) {
      // eslint-disable-next-line
      criteria._id = {
        $in: compact([].concat(values.agencies)),
      };
    }

    if (!isEmpty(values.groups)) {
      criteria.group = {
        $in: compact([].concat(values.groups)),
      };
    }

    if (!isEmpty(values.roles)) {
      criteria.role = {
        $in: compact([].concat(values.roles)),
      };
    }

    if (!isEmpty(values.area)) {
      criteria.area = {
        $in: compact([].concat(values.area)),
      };
    }

    if (!isEmpty(values.recipients)) {
      // eslint-disable-next-line
      const agencies = criteria._id ? criteria._id.$in : [];

      // eslint-disable-next-line
      criteria._id = {
        $in: compact([].concat(values.recipients).concat(agencies)), // eslint-disable-line
      };
    }

    const notification = {
      criteria: {
        ...criteria,
      },
      subject: values.subject,
      message: values.body,
      channels: values.channels,
    };

    postCampaign(
      notification,
      () => {
        notifySuccess('Notification Sent Successfully');
        onCancel();
      },
      () => {
        notifyError(
          'An Error occurred when sending notification, please contact System Administrator'
        );
      }
    );
  };
  const [moreFilters, setMoreFilters] = useState(false);
  return (
    <Form
      {...formItemLayout} // eslint-disable-line
      autoComplete="off"
      initialValues={{
        subject,
        body,
        recipients: map(recipients, (contact) => contact._id), // eslint-disable-line
        channels: ['SMS', 'EMAIL'],
      }}
      onFinish={onFinish}
    >
      {/* notify recipients per jurisdictions */}
      {onSearchJurisdictions && moreFilters && (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <Form.Item name="area" label="Areas">
          <SearchableSelectInput
            onSearch={onSearchJurisdictions}
            optionLabel={(area) => `${area.strings.name.en}`}
            optionValue="_id"
            mode="multiple"
          />
        </Form.Item>
      )}
      {/* end notification jurisdictions */}

      {/* notify recipients per group */}
      {onSearchGroups && moreFilters && (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <Form.Item name="groups" label="Group(s)">
          <SearchableSelectInput
            onSearch={onSearchGroups}
            optionLabel={(group) => group.strings.name.en}
            optionValue="_id"
            mode="multiple"
          />
        </Form.Item>
      )}
      {/* notify recipients per group */}

      {/* notify recipients per role */}
      {onSearchRoles && moreFilters && (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <Form.Item name="roles" label="Role(s)">
          <SearchableSelectInput
            onSearch={onSearchRoles}
            optionLabel={(role) => role.strings.name.en}
            optionValue="_id"
            mode="multiple"
          />
        </Form.Item>
      )}
      {/* notify recipients per role */}

      {/* notify recipients per agency */}
      {onSearchAgencies && moreFilters && (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <Form.Item name="agencies" label="Agencies">
          <SearchableSelectInput
            onSearch={onSearchAgencies}
            optionLabel="name"
            optionValue="_id"
            mode="multiple"
          />
        </Form.Item>
      )}
      {/* notify recipients per agency */}

      {/* notification recipients */}
      {onSearchRecipients && (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <Form.Item name="recipients" label="Recipients">
          <SearchableSelectInput
            onSearch={onSearchRecipients}
            optionLabel="name"
            optionValue="_id"
            mode="multiple"
            initialValue={recipients}
          />
        </Form.Item>
      )}
      {/* end notification recipients */}

      {/* notification subject */}
      <Form.Item
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...formItemLayout}
        name="subject"
        label={
          <span>
            Subject&nbsp;
            <Tooltip title="Applicable for Email notification only">
              <QuestionCircleOutlined />
            </Tooltip>
          </span>
        }
      >
        <Input />
      </Form.Item>
      {/* notification subject */}

      {/* notification body */}
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Form.Item
        label="Message"
        name="body"
        rules={[
          {
            required: true,
            message: 'Please provide notification message',
          },
        ]}
      >
        <TextArea autoSize={{ minRows: 6, maxRows: 10 }} />
      </Form.Item>
      {/* end notification body */}

      {/* Channels */}
      <Form.Item name="channels" label="Notification Channels">
        <Checkbox.Group style={{ width: '100%' }}>
          <Row>
            <Col span={6}>
              <Checkbox value="SMS">SMS</Checkbox>
            </Col>
            <Col span={6}>
              <Checkbox value="EMAIL">Email</Checkbox>
            </Col>
            <Col span={6}>
              <Checkbox value="PUSH">Push Notification</Checkbox>
            </Col>
          </Row>
        </Checkbox.Group>
      </Form.Item>
      {/* Channels */}

      {/* form actions */}
      <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'right' }}>
        <Button type="link" onClick={() => setMoreFilters(!moreFilters)}>
          {moreFilters ? 'Less Filters' : 'More Filters'}
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={onCancel}>
          Cancel
        </Button>
        <Button
          style={{ marginLeft: 8 }}
          type="primary"
          htmlType="submit"
          loading={posting}
        >
          Send
        </Button>
      </Form.Item>
      {/* end form actions */}
    </Form>
  );
};

NotificationForm.propTypes = {
  recipients: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      title: PropTypes.string,
      abbreviation: PropTypes.string,
      mobile: PropTypes.string,
      email: PropTypes.string,
    })
  ),
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func,
    validateFieldsAndScroll: PropTypes.func,
  }).isRequired,
  body: PropTypes.string,
  subject: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onSearchRecipients: PropTypes.func.isRequired,
  onSearchJurisdictions: PropTypes.func.isRequired,
  onSearchGroups: PropTypes.func.isRequired,
  onSearchRoles: PropTypes.func.isRequired,
  onSearchAgencies: PropTypes.func.isRequired,
  posting: PropTypes.bool.isRequired,
};

NotificationForm.defaultProps = {
  subject: undefined,
  body: undefined,
  recipients: [],
};

export default Connect(NotificationForm, {
  posting: 'campaigns.posting',
});
