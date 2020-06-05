import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import pick from 'lodash/pick';
import { Button, Checkbox, Input, Radio, Form, Row, Col } from 'antd';
import { reduxActions } from '@codetanzania/ewea-api-states';
import { notifyError, notifySuccess } from '../../../util';

/* state actions */
const { putCase } = reduxActions;

/* ui */
const labelCol = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 24 },
  xl: { span: 24 },
  xxl: { span: 24 },
};
const wrapperCol = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 24 },
  xl: { span: 24 },
  xxl: { span: 24 },
};

/* messages */
const MESSAGE_PUT_SUCCESS = 'Case was updated successfully';
const MESSAGE_PUT_ERROR =
  'Something occurred while updating Case, Please try again!';

/**
 * @function CaseFollowupForm
 * @name CaseFollowupForm
 * @description Form for case followups
 * @param {object} props Valid form properties
 * @param {object} props.caze Valid case object
 * @param {boolean} props.posting Flag whether form is posting data
 * @param {Function} props.onCancel Form cancel callback
 * @returns {object} CaseFollowupForm component
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * <CaseFollowupForm
 *   caze={case}
 *   isEditForm={isEditForm}
 *   posting={posting}
 *   onCancel={this.handleFollowupFormClose}
 * />
 *
 */
const CaseFollowupForm = ({ caze, posting, onCancel }) => {
  // const [cached, setCache] = useState({}); // for caching lazy component values

  // form finish(submit) handler
  const onFinish = (values) => {
    // TODO: merge defaults
    const formData = { ...values, ...pick(caze, '_id') };

    putCase(
      formData,
      () => {
        onCancel();
        notifySuccess(MESSAGE_PUT_SUCCESS);
      },
      () => notifyError(MESSAGE_PUT_ERROR)
    );
  };

  return (
    <Form
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      onFinish={onFinish}
      initialValues={{
        ...caze,
        victim: {
          ...get(caze, 'victim', null),
          area: get(caze, 'victim.area._id'),
          gender: get(caze, 'victim.gender._id'),
          occupation: get(caze, 'victim.occupation._id'),
        },
      }}
      autoComplete="off"
    >
      {/* start: line one */}
      <Row justify="space-between">
        <Col xs={24} sm={24} md={7}>
          <Form.Item title="Fever" name={['followup', 'symptoms', 'fever']}>
            <Checkbox value={3}>Fever</Checkbox>
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={8}>
          <Form.Item
            title="Shortness of Breath"
            name={['followup', 'symptoms', 'shortnessOfBreath']}
          >
            <Checkbox value={5}>Shortness of Breath</Checkbox>
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={7}>
          <Form.Item
            title="Muscle Pain"
            name={['followup', 'symptoms', 'musclePain']}
          >
            <Checkbox value={1}>Muscle Pain</Checkbox>
          </Form.Item>
        </Col>
      </Row>
      {/* end: line one */}

      {/* start: line two */}
      <Row justify="space-between">
        <Col xs={24} sm={24} md={7}>
          <Form.Item title="Cough" name={['followup', 'symptoms', 'cough']}>
            <Checkbox value={1}>Cough</Checkbox>
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={8}>
          <Form.Item
            title="Vomiting Everything(>= 3 times a day)"
            name={['followup', 'symptoms', 'vomiting']}
          >
            <Checkbox value={3}>
              Vomiting Everything(3 times a day or more)
            </Checkbox>
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={7}>
          <Form.Item
            title="Chest Tightness"
            name={['followup', 'symptoms', 'chestTightness']}
          >
            <Checkbox value={5}>Chest Tightness</Checkbox>
          </Form.Item>
        </Col>
      </Row>
      {/* end: line two */}

      {/* start: line three */}
      <Row justify="space-between">
        <Col xs={24} sm={24} md={7}>
          <Form.Item
            title="Sore Throat"
            name={['followup', 'symptoms', 'soreThroat']}
          >
            <Checkbox value={1}>Sore Throat</Checkbox>
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={8}>
          <Form.Item
            title="Diarrhea(>= 3 time a day)"
            name={['followup', 'symptoms', 'diarrhea']}
          >
            <Checkbox value={3}>Diarrhea(3 times a day or more)</Checkbox>
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={7}>
          <Form.Item
            title="Abdominal Pain"
            name={['followup', 'symptoms', 'abdominalPain']}
          >
            <Checkbox value={3}>Abdominal Pain</Checkbox>
          </Form.Item>
        </Col>
      </Row>
      {/* end: line three */}

      {/* start: line four */}
      <Row justify="space-between">
        <Col xs={24} sm={24} md={7}>
          <Form.Item
            title="Loss of Taste"
            name={['followup', 'symptoms', 'lossOfTaste']}
          >
            <Checkbox value={1}>Loss of Taste</Checkbox>
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={8}>
          <Form.Item
            title="Loss of Smell"
            name={['followup', 'symptoms', 'lossOfSmell']}
          >
            <Checkbox value={1}>Loss of Smell</Checkbox>
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={7}>
          <Form.Item
            title="Joint Pain"
            name={['followup', 'symptoms', 'jointPain']}
          >
            <Checkbox value={1}>Joint Pain</Checkbox>
          </Form.Item>
        </Col>
      </Row>
      {/* end: line four */}

      {/* start: line five */}
      <Row justify="space-between">
        <Col xs={24} sm={24} md={7}>
          <Form.Item
            title="Headache"
            name={['followup', 'symptoms', 'headache']}
          >
            <Checkbox value={3}>Headache</Checkbox>
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={8} />

        <Col xs={24} sm={24} md={7} />
      </Row>
      {/* end: line five */}

      {/* start: outcome */}
      <Form.Item
        label="Outcome"
        title="Victim/Patient Followup Outcome"
        name={['followup', 'outcome']}
      >
        <Radio.Group>
          <Radio value="home">Home</Radio>
          <Radio value="hospital">Hospital</Radio>
        </Radio.Group>
      </Form.Item>
      {/* end: outcome */}

      {/* start: remarks */}
      <Form.Item
        label="Remarks"
        title="Victim/Patient Followup Remarks"
        name={['followup', 'remarks']}
      >
        <Input.TextArea autoSize={{ minRows: 2, maxRows: 10 }} />
      </Form.Item>
      {/* end: remarks */}

      {/* start:form actions */}
      <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'right' }}>
        <Button style={{ marginLeft: 8 }} onClick={onCancel}>
          Cancel
        </Button>
        <Button
          style={{ marginLeft: 8 }}
          type="primary"
          htmlType="submit"
          loading={posting}
        >
          Save
        </Button>
      </Form.Item>
      {/* end:form actions */}
    </Form>
  );
};

CaseFollowupForm.defaultProps = {
  caze: {},
};

CaseFollowupForm.propTypes = {
  caze: PropTypes.shape({
    _id: PropTypes.string,
    number: PropTypes.string,
  }),
  posting: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default CaseFollowupForm;
