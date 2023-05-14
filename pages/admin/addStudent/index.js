import React from 'react';
import {
  Button,
  Card,
  Col,
  Row,
  Typography,
  Divider,
  notification,
} from 'antd';

import { DragDrop } from '@/components';

import { useDispatch } from 'react-redux';
import { bulkAddStudent } from '@/store/actions';
import AddStudentForm from '@/components/form/AddStudentForm';

const { Text, Title } = Typography;

export default function AddStudent() {
  const dispatch = useDispatch();
  const [api, contextHolder] = notification.useNotification();

  const onDragDrop = async (data) => {
    if (data) {
      const { data: dataApi } = await dispatch(bulkAddStudent(data));
      if (dataApi) {
        api.success({
          description: dataApi.message,
          placement: 'topRight',
        });
      } else {
        api.error({
          description: 'Gagal menambahkan data. Coba lagi',
          placement: 'topRight',
        });
      }
    }
  };
  return (
    <>
      {contextHolder}
      <Title level={2}>Tambah Data Siswa</Title>
      <Text>
        Tambah Data Siswa dengan mengisi form di bawah ini atau dengan
        mendowload template yang sudah disediakan dan menguploadnya melalu form
        upload file.
      </Text>
      <Divider />
      <Row gutter={24}>
        <Col span={12}>
          <Card title="Tambah Siswa" bordered={false}>
            <AddStudentForm />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Upload File" bordered={false}>
            <DragDrop onDragDrop={onDragDrop} />
          </Card>
        </Col>
      </Row>
    </>
  );
}
