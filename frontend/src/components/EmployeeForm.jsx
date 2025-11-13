import React, { useEffect } from 'react';
import { Form, Input, Button, Select, DatePicker, message } from 'antd';
import API from '../api/axios';
import dayjs from 'dayjs';

export default function EmployeeForm({ selectedEmployee = null, cafes = [], onSaved = () => {}, closeModal = () => {} }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (selectedEmployee) {
      form.setFieldsValue({
        id: selectedEmployee.id,
        name: selectedEmployee.name,
        email_address: selectedEmployee.email_address,
        phone_number: selectedEmployee.phone_number,
        gender: selectedEmployee.gender,
        start_date: selectedEmployee.start_date ? dayjs(selectedEmployee.start_date) : null,
        cafe_id: selectedEmployee.cafe_id || null
      });
    } else {
      form.resetFields();
    }
  }, [selectedEmployee, form]);

  const handleFinish = async (values) => {
    const payload = {
      ...values,
      start_date: values.start_date ? values.start_date.format('YYYY-MM-DD') : null
    };

    try {
      if (selectedEmployee && selectedEmployee.id) {
        await API.put(`/employees/${selectedEmployee.id}`, payload);
        message.success('Employee updated');
      } else {
        await API.post('/employees', payload);
        message.success('Employee created');
      }
      onSaved();
      closeModal();
    } catch (err) {
      console.error('EmployeeForm save', err);
      message.error(API.getErrorMessage(err) || 'Save failed');
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Form.Item name="id" label="ID" rules={[{ required: true, message: 'ID required' }]}>
        <Input disabled={!!selectedEmployee} />
      </Form.Item>

      <Form.Item name="name" label="Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="email_address" label="Email" rules={[{ type: 'email', required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="phone_number" label="Phone" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
        <Select>
          <Select.Option value="Male">Male</Select.Option>
          <Select.Option value="Female">Female</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item name="start_date" label="Start date" rules={[{ required: true }]}>
        <DatePicker />
      </Form.Item>

      <Form.Item name="cafe_id" label="Cafe" rules={[{ required: true }]}>
        <Select showSearch optionFilterProp="children" placeholder="Select cafe">
          {cafes.map(c => <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>)}
        </Select>
      </Form.Item>

      <Form.Item>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button onClick={closeModal}>Cancel</Button>
          <Button type="primary" htmlType="submit">Save</Button>
        </div>
      </Form.Item>
    </Form>
  );
}
