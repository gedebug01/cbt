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
import { bulkAddTeacher } from '@/store/actions';
import AddTeacherForm from '@/components/form/AddTeacherForm';

const { Text, Title } = Typography;

export default function AddTeacher() {
  const dispatch = useDispatch();
  const [api, contextHolder] = notification.useNotification();

  const onDragDrop = async (data) => {
    if (data) {
      const { data: dataApi } = await dispatch(bulkAddTeacher(data));
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
      <Title level={2}>Tambah Data Guru</Title>
      <Text>
        Tambah Data Guru dengan mengisi form di bawah ini atau dengan mendowload
        template yang sudah disediakan dan menguploadnya melalu form upload
        file.
      </Text>
      <Divider />
      <Row gutter={24}>
        <Col span={12}>
          <Card title="Tambah Kelas" bordered={false}>
            <AddTeacherForm />
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
