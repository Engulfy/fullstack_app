import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import API from '../api/axios';

export default function CafeForm({ selectedCafe = null, closeModal = () => {}, onSaved = () => {} }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedCafe) {
      form.setFieldsValue({
        name: selectedCafe.name,
        description: selectedCafe.description,
        location: selectedCafe.location,
        logo: selectedCafe.logo || ''
      });
    } else {
      form.resetFields();
    }
  }, [selectedCafe, form]);

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      if (selectedCafe && selectedCafe.id) {
        const res = await API.put(`/cafes/${selectedCafe.id}`, values);
        message.success('Cafe updated');
      } else {
        const res = await API.post('/cafes', values);
        message.success('Cafe created');
      }
      onSaved();
      closeModal();
    } catch (err) {
      console.error('CafeForm submit error', err);
      message.error(API.getErrorMessage(err) || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Name required' }]}>
        <Input />
      </Form.Item>

      <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Description required' }]}>
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item name="location" label="Location" rules={[{ required: true, message: 'Location required' }]}>
        <Input />
      </Form.Item>

      <Form.Item name="logo" label="Logo URL (optional)">
        <Input placeholder="https://..." />
      </Form.Item>

      <Form.Item>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button onClick={closeModal}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {selectedCafe ? 'Save changes' : 'Create cafe'}
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
}
