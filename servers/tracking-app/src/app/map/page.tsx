'use client';

import { useState } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { Layout, Select, Form } from 'antd';

const { Sider, Content } = Layout;
const { Option } = Select;

const trackers = ['Tracker 1', 'Tracker 2', 'Tracker 3']; // Replace with your actual tracker data

export default function MapPage() {
  const [selectedTrackers, setSelectedTrackers] = useState<string[]>([]);

  const mapContainerStyle = {
    width: '100%',
    height: '100vh'
  };

  const center = {
    lat: 55.6760968,
    lng: 12.5683371
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={300} theme="light">
        <Form layout="vertical" style={{ padding: '24px' }}>
          <Form.Item label="Select a trackers" name="trackers">
            <Select
              mode="multiple"
              placeholder="Choose trackers"
              onChange={(values) => setSelectedTrackers(values)}
              style={{ width: '100%' }}
            >
              {trackers.map((tracker) => (
                <Option key={tracker} value={tracker}>
                  {tracker}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Sider>
      <Content>
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
          <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={10}>
            {/* Add markers or other map components here */}
          </GoogleMap>
        </LoadScript>
      </Content>
    </Layout>
  );
}
