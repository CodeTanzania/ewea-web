import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';
import sum from 'lodash/sum';
import pickBy from 'lodash/pickBy';
import intersection from 'lodash/intersection';
import keys from 'lodash/keys';
import values from 'lodash/values';
import { Button, Input, Radio, Form, Row, Col } from 'antd';
import { reduxActions } from '@codetanzania/ewea-api-states';
import { notifyError, notifySuccess } from '../../../util';
import WrappedCheckbox from '../../../components/WrappedCheckbox';

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

/* helpers */
// TODO: refactor to case-descriptions
const scoreFor = ({ followup }) => {
  const symptoms = {
    fever: 3,
    shortnessOfBreath: 5,
    musclePain: 1,
    cough: 1,
    vomiting: 3,
    chestTightness: 5,
    soreThroat: 1,
    diarrhea: 3,
    abdominalPain: 3,
    lossOfTaste: 1,
    lossOfSmell: 1,
    jointPain: 1,
    headache: 3,
    chestPain: 5,
  };

  // calculate average weight for 5-point scale
  // TODO: asymptomatic, score === 0 (default?)
  const overall = sum(values(symptoms));
  const given = sum(values(followup.symptoms));
  const score = 5 * (given / overall); // 5 point scale

  // compute outcome
  const criticalSymptoms = [
    'headache',
    'fever',
    'shortnessOfBreath',
    'chestTightness',
    'vomiting',
    'diarrhea',
    'chestPain',
    'abdominalPain',
  ];
  const givenCriticalSymptoms = pickBy({ ...followup.symptoms }, (val) => {
    return !!val;
  });
  const hasCriticalSymptoms = !isEmpty(
    intersection(criticalSymptoms, keys(givenCriticalSymptoms))
  );
  const outcome = hasCriticalSymptoms || score >= 3 ? 'hospital' : 'home';

  // TODO: if verify use verified score

  return { followup: { ...followup, score, outcome } };
};

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
 *   onScore={this.handleCaseScore}
 *   onCancel={this.handleFollowupFormClose}
 * />
 *
 */
const CaseFollowupForm = ({ caze, posting, onCancel }) => {
  // form finish(submit) handler
  const onFinish = (updates) => {
    const scored = scoreFor(updates);
    const formData = { ...scored, ...pick(caze, '_id') };

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
            <WrappedCheckbox
              checkedValue={3}
              unCheckedValue={0}
              label="Fever"
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={8}>
          <Form.Item
            title="Shortness of Breath"
            name={['followup', 'symptoms', 'shortnessOfBreath']}
          >
            <WrappedCheckbox
              checkedValue={5}
              unCheckedValue={0}
              label="Shortness of Breath"
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={7}>
          <Form.Item
            title="Muscle Pain"
            name={['followup', 'symptoms', 'musclePain']}
          >
            <WrappedCheckbox
              checkedValue={1}
              unCheckedValue={0}
              label="Muscle Pain"
            />
          </Form.Item>
        </Col>
      </Row>
      {/* end: line one */}

      {/* start: line two */}
      <Row justify="space-between">
        <Col xs={24} sm={24} md={7}>
          <Form.Item title="Cough" name={['followup', 'symptoms', 'cough']}>
            <WrappedCheckbox
              checkedValue={1}
              unCheckedValue={0}
              label="Cough"
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={8}>
          <Form.Item
            title="Vomiting Everything(>= 3 times a day)"
            name={['followup', 'symptoms', 'vomiting']}
          >
            <WrappedCheckbox
              checkedValue={3}
              unCheckedValue={0}
              label="Vomiting Everything(3 times a day or more)"
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={7}>
          <Form.Item
            title="Chest Tightness"
            name={['followup', 'symptoms', 'chestTightness']}
          >
            <WrappedCheckbox
              checkedValue={5}
              unCheckedValue={0}
              label="Chest Tightness"
            />
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
            <WrappedCheckbox
              checkedValue={1}
              unCheckedValue={0}
              label="Sore Throat"
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={8}>
          <Form.Item
            title="Diarrhea(>= 3 time a day)"
            name={['followup', 'symptoms', 'diarrhea']}
          >
            <WrappedCheckbox
              checkedValue={3}
              unCheckedValue={0}
              label="Diarrhea(3 times a day or more)"
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={7}>
          <Form.Item
            title="Abdominal Pain"
            name={['followup', 'symptoms', 'abdominalPain']}
          >
            <WrappedCheckbox
              checkedValue={3}
              unCheckedValue={0}
              label="Abdominal Pain"
            />
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
            <WrappedCheckbox
              checkedValue={1}
              unCheckedValue={0}
              label="Loss of Taste"
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={8}>
          <Form.Item
            title="Loss of Smell"
            name={['followup', 'symptoms', 'lossOfSmell']}
          >
            <WrappedCheckbox
              checkedValue={1}
              unCheckedValue={0}
              label="Loss of Smell"
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={7}>
          <Form.Item
            title="Joint Pain"
            name={['followup', 'symptoms', 'jointPain']}
          >
            <WrappedCheckbox
              checkedValue={1}
              unCheckedValue={0}
              label="Joint Pain"
            />
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
            <WrappedCheckbox
              checkedValue={3}
              unCheckedValue={0}
              label="Headache"
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={8}>
          <Form.Item
            title="Chest Pain"
            name={['followup', 'symptoms', 'chestPain']}
          >
            <WrappedCheckbox
              checkedValue={5}
              unCheckedValue={0}
              label="Chest Pain"
            />
          </Form.Item>
        </Col>

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
          <Radio value="unknown">Unknown</Radio>
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
