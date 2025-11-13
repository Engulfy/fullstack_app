import React, { useEffect, useState } from 'react';
import { Button, Modal, Input, Card, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import API from '../api/axios';
import CafeForm from '../components/CafeForm';

const { Meta } = Card;

export default function Cafes() {
  const [cafes, setCafes] = useState([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCafes = async (filter = '') => {
    setLoading(true);
    try {
      const res = await API.get('/cafes', { params: filter ? { location: filter } : {} });
      setCafes(res.data || []);
    } catch (err) {
      console.error('fetchCafes error', err);
      message.error(API.getErrorMessage(err) || 'Failed to load cafes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCafes();
  }, []);

  const openAdd = () => { setSelectedCafe(null); setModalOpen(true); };
  const openEdit = (cafe) => { setSelectedCafe(cafe); setModalOpen(true); };

  const handleDelete = async (id) => {
    if (!confirm('Delete this cafe?')) return;
    try {
      await API.delete(`/cafes/${id}`);
      message.success('Cafe deleted');
      setCafes(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('delete cafe', err);
      message.error(API.getErrorMessage(err) || 'Delete failed');
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedCafe(null);
  };

  const refreshAfterChange = async () => {
    await fetchCafes(search);
  };

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Input
              placeholder="Filter by location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onPressEnter={() => fetchCafes(search)}
              style={{ width: 280 }}
              suffix={<SearchOutlined />}
            />
            <Button onClick={() => fetchCafes(search)}>Search</Button>
          </div>

          <div>
            <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>Add Cafe</Button>
          </div>
        </Space>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {cafes.map(c => (
          <Card key={c.id} hoverable>
            <Meta
              title={c.name}
              description={
                <div>
                  <div>{c.description}</div>
                  <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                    {c.location} • {c.employees ?? 0} employees
                  </div>
                </div>
              }
            />
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <Button icon={<EditOutlined />} onClick={() => openEdit(c)}>Edit</Button>
              <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(c.id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        open={modalOpen}
        visible={modalOpen}
        title={selectedCafe ? 'Edit Cafe' : 'Add Cafe'}
        onCancel={handleModalClose}
        footer={null}
        width={600}
      >
        <CafeForm
          selectedCafe={selectedCafe}
          closeModal={handleModalClose}
          onSaved={refreshAfterChange}
        />
      </Modal>
    </div>
  );
}
