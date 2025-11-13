import React, { useEffect, useState } from 'react';
import { Button, Modal, Table, message } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import API from '../api/axios';
import EmployeeForm from '../components/EmployeeForm';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [cafes, setCafes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eRes, cRes] = await Promise.all([
        API.get('/employees'),
        API.get('/cafes')
      ]);
      setEmployees(eRes.data || []);
      setCafes(cRes.data || []);
    } catch (err) {
      console.error('fetch employees', err);
      message.error(API.getErrorMessage(err) || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAdd = () => { setSelectedEmployee(null); setModalOpen(true); };
  const openEdit = (employee) => { setSelectedEmployee(employee); setModalOpen(true); };

  const handleDelete = async (id) => {
    if (!confirm('Delete employee?')) return;
    try {
      await API.delete(`/employees/${id}`);
      message.success('Deleted employee');
      setEmployees(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error('delete employee', err);
      message.error(API.getErrorMessage(err) || 'Delete failed');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email_address', key: 'email' },
    { title: 'Phone', dataIndex: 'phone_number', key: 'phone' },
    { title: 'Cafe', dataIndex: 'cafe_name', key: 'cafe' },
    {
      title: 'Actions', key: 'actions', render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button icon={<EditOutlined />} onClick={() => openEdit(record)}>Edit</Button>
          <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>Delete</Button>
        </div>
      )
    }
  ];

  const onSaved = async () => {
    await fetchData();
    setModalOpen(false);
    setSelectedEmployee(null);
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>Employees</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>Add Employee</Button>
      </div>

      <Table dataSource={employees} columns={columns} loading={loading} rowKey="id" />

      <Modal
        open={modalOpen}
        visible={modalOpen}
        footer={null}
        onCancel={() => { setModalOpen(false); setSelectedEmployee(null); }}
        width={700}
      >
        <EmployeeForm
          selectedEmployee={selectedEmployee}
          cafes={cafes}
          onSaved={onSaved}
          closeModal={() => { setModalOpen(false); setSelectedEmployee(null); }}
        />
      </Modal>
    </div>
  );
}
