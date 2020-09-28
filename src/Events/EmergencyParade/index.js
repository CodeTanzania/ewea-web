import React, { useState } from 'react';
import { Card, Typography, Drawer, Row, Col, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import Grid from '../../components/Grid';
import ParadeForm from './ParadeForm';

const { Text } = Typography;
// simple data structure for emergency parade
const DATA_STRUCTURE = [
  {
    name: 'SWILA 01',
    group: 'Dispatcher',
    instance: { responded: false, activeAmbulances: 0, nurses: 0 },
    form: {
      responded: {
        description: 'Is the call sign active?',
        type: 'boolean',
      },
      activeAmbulances: {
        description: 'How many working ambulances you have?',
        type: 'number',
      },
      nurses: {
        description: 'How many nurses do you have?',
        type: 'number',
      },
    },
  },
  {
    name: 'SWILA 02',
    group: 'Ambulance',
    instance: { responded: false, activeAmbulances: 0, nurses: 0 },
    form: {
      responded: {
        description: 'Is the call sign active?',
        type: 'boolean',
      },
      haveOxygen: {
        description: 'Do you have oxygen?',
        type: 'boolean',
      },
      radioFunctioning: {
        description: 'Is radio functioning well?',
        type: 'boolean',
      },
    },
  },
  {
    name: 'MKUNGA 02',
    group: 'Ambulance',
    instance: { responded: false, activeAmbulances: 0, nurses: 0 },
    form: {
      responded: {
        description: 'Is the call sign active?',
        type: 'boolean',
      },
      haveOxygen: {
        description: 'Do you have oxygen?',
        type: 'boolean',
      },
      radioFunctioning: {
        description: 'Is radio functioning well?',
        type: 'boolean',
      },
    },
  },
  {
    name: 'KOBOKO 02',
    group: 'Ambulance',
    instance: { responded: false, activeAmbulances: 0, nurses: 0 },
    form: {
      responded: {
        description: 'Is the call sign active?',
        type: 'boolean',
      },
      haveOxygen: {
        description: 'Do you have oxygen?',
        type: 'boolean',
      },
      radioFunctioning: {
        description: 'Is radio functioning well?',
        type: 'boolean',
      },
    },
  },
];

/**
 * @function
 * @name EmergencyParade
 * @description List of all items that needs to be checked daily
 * @returns {object} Emergency Parade Dashboard
 * @version 0.1.0
 * @since 0.1.0
 */
const EmergencyParade = () => {
  const [isModalOpen, openModal] = useState(false);
  const [selectedItem, handleSelectItem] = useState(null);
  return (
    <>
      <Row>
        <Col
          xxl={{ span: 3, offset: 21 }}
          xl={{ span: 3, offset: 21 }}
          lg={{ span: 6, offset: 18 }}
          md={{ span: 6, offset: 18 }}
          sm={{ span: 24 }}
          xs={{ span: 24 }}
        >
          <div style={{ padding: '40px 40px 0' }}>
            <Button type="primary" size="large" block icon={<PlusOutlined />}>
              New Parade
            </Button>
          </div>
        </Col>
      </Row>
      <div style={{ padding: '24px' }}>
        <Grid
          items={DATA_STRUCTURE}
          colPerRow={4}
          renderItem={(item) => {
            return (
              <Card
                style={{
                  margin: '5px',
                  boxShadow: '0 0 10px #e9e9e9',
                }}
                hoverable
                onClick={() => {
                  handleSelectItem(item.value);
                  openModal(true);
                }}
              >
                <Text strong>{item.value.name}</Text>
                <br />
                <Text>{item.value.group}</Text>
              </Card>
            );
          }}
        />
      </div>

      <Drawer
        title="Parade"
        placement="right"
        width="100%"
        destroyOnClose
        visible={isModalOpen}
        onClose={() => openModal(false)}
        maskClosable={false}
      >
        {selectedItem ? (
          <ParadeForm
            form={selectedItem.form}
            onCancel={() => openModal(false)}
          />
        ) : (
          'No item selected'
        )}
      </Drawer>
    </>
  );
};

export default EmergencyParade;
