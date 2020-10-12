import React from 'react';
import { Button, Row, Col, Typography, Form, Input, Radio } from 'antd';

/* ui */
const { Title, Text } = Typography;
const { TextArea } = Input;
/* constants */
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

const EventFeedback = () => {
  const onFinish = () => {};
  return (
    <Row justify="center" style={{ marginTop: '20px' }}>
      <Col xs={22} sm={20} lg={8} xl={8} xxl={8}>
        <Title style={{ textAlign: 'center', color: '#1890FF' }}>
          Event feedback
        </Title>
        {/* eslint-disable-next-line */}
        <Form onFinish={onFinish} {...formItemLayout} autoComplete="off">
          <p>
            <Text strong>Emergency Function : </Text>Evacuation
          </p>
          <p>
            <Text strong>Action : </Text>Arrange Transportation for evacuated
            families{' '}
          </p>

          <Form.Item
            name="radio-group"
            label="Action Feedback"
            rules={[
              {
                required: true,
                message: 'Action Feedback Status is required',
              },
            ]}
          >
            <Radio.Group>
              <Radio value="a">Taken</Radio>
              <Radio value="b">Not Taken</Radio>
              <Radio value="c">Help Needed</Radio>
            </Radio.Group>
          </Form.Item>

          {/* remarks */}
          <Form.Item name="remarks" label="Remarks">
            <TextArea autoSize={{ minRows: 3, maxRows: 10 }} />
          </Form.Item>
          {/* end remarks */}

          {/* form actions */}
          <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'center' }}>
            <Button>Cancel</Button>
            <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
          {/* end form actions */}
        </Form>
      </Col>
    </Row>
  );
};

export default EventFeedback;
