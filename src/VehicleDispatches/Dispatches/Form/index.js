import React, { useState } from 'react';
import { Button, Form, Input, Row, Col, Steps, Typography } from 'antd';

const { Text } = Typography;
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
const { Step } = Steps;

const VehicleDispatchForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const onStepChange = (step) => setCurrentStep(step);
  const onFinish = () => {};
  return (
    <>
      <Steps type="navigation" current={currentStep} onChange={onStepChange}>
        <Step title="Request/Call Details" status="wait" />
        <Step title="Patient/Victim" status="wait" />
        <Step title="Locations" status="wait" />
        <Step title="Vehicle Details" status="wait" />
      </Steps>
      <Form
        onFinish={onFinish}
        {...formItemLayout} // eslint-disable-line
        style={{ marginTop: '30px' }}
      >
        {currentStep === 0 && (
          <>
            <Row justify="space-between">
              <Col span={11}>
                <Form.Item name="number" label="Dispatch Number">
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item name="reportedAt" label="Call Time">
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>

            <Row justify="space-between">
              <Col span={11}>
                <Form.Item name={['requester', 'name']} label="Name">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item name={['requester', 'mobile']} label="Phone">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row justify="space-between">
              <Col span={11}>
                <Form.Item name="number" label="Facility">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item name={['requester', 'area', '_id']} label="Area">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name={['requester', 'address']} label="Address">
              <Input />
            </Form.Item>

            <Form.Item name="description" label="Description/Notes">
              <Input />
            </Form.Item>
          </>
        )}

        {currentStep === 1 && (
          <>
            <Row justify="space-between">
              <Col span={11}>
                <Form.Item name={['victim', 'name']} label="Name">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item
                  name={['victim', 'diagnosis']}
                  label="Event/Diagnosis"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row justify="space-between">
              <Col span={11}>
                <Form.Item name={['victim', 'mobile']} label="Phone">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item name={['victim', 'gender', '_id']} label="Gender">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row justify="space-between">
              <Col span={11}>
                <Form.Item name={['victim', 'age']} label="Age">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item name={['victim', 'weight']} label="Weight">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row justify="space-between">
              <Col span={11}>
                <Form.Item name="number" label="PCR #">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item name="number" label="Referral #">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="number" label="Chief Complaint">
              <Input />
            </Form.Item>

            <Form.Item name={['victim', 'address']} label="Address">
              <Input />
            </Form.Item>
          </>
        )}

        {currentStep === 2 && (
          <>
            <Row justify="space-between">
              <Col span={11}>
                <Text strong>Pickup Location</Text>
              </Col>
              <Col span={11}>
                <Text strong>Drop Off Location</Text>
              </Col>
            </Row>

            <Row justify="space-between">
              <Col span={11}>
                <Form.Item name="number" label="Facility">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item name="number" label="Facility">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row justify="space-between">
              <Col span={11}>
                <Form.Item name="number" label="Area">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item name="number" label="Area">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row justify="space-between">
              <Col span={11}>
                <Form.Item name="number" label="Address">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item name="number" label="Address">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row justify="space-between">
              <Col span={11}>
                <Form.Item name="number" label="Arrived Time">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item name="number" label="Arrived Time">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row justify="space-between">
              <Col span={11}>
                <Form.Item name="number" label="Dispatched Time">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item name="number" label="Dispatched Time">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row justify="space-between">
              <Col span={11}>
                <Form.Item name="number" label="Correspondent">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item name="number" label="Correspondent">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row justify="space-between">
              <Col span={11}>
                <Form.Item name="number" label="Remarks">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item name="number" label="Remarks">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}

        {currentStep === 3 && (
          <>
            <Row justify="space-between">
              <Col span={11}>
                <Form.Item name="number" label="Type">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item name="number" label="Number">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row justify="space-between">
              <Col span={11}>
                <Form.Item name="number" label="Owner">
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item name="number" label="Model/Make">
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="number" label="Remarks/Notes">
              <Input disabled />
            </Form.Item>
          </>
        )}

        {/* form actions */}
        <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'right' }}>
          <Button>Cancel</Button>
          <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
        {/* end form actions */}
      </Form>
    </>
  );
};

export default VehicleDispatchForm;
