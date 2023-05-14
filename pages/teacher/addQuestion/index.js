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
import AddQuestionForm from '@/components/form/AddQuestionForm';

import { useDispatch } from 'react-redux';
import { bulkAddQuestion } from '@/store/actions';
import { Timer } from '@/components/Timer';
import moment from 'moment/moment';

const { Text, Title } = Typography;

export default function AddQuestion() {
  const dispatch = useDispatch();
  const [api, contextHolder] = notification.useNotification();

  const onDragDrop = async (data) => {
    if (data) {
      const { data: dataApi } = await dispatch(bulkAddQuestion(data));
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
      <Title level={2}>Tambah Data Ujian</Title>
      <Text>
        Tambah Data Ujian dengan mengisi form di bawah ini atau dengan
        mendowload template yang sudah disediakan dan menguploadnya melalu form
        upload file.
      </Text>
      <Divider />
      <Row gutter={24}>
        <Col span={12}>
          <Card title="Tambah Kelas" bordered={false}>
            <AddQuestionForm />
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
