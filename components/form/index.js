import React, { useEffect } from 'react';
import { Button, Form, Input, Select, InputNumber, notification } from 'antd';

import { useDispatch } from 'react-redux';

import { addClass } from '@/store/actions';

export default function AddClassForm({ onEditForm, editData }) {
  const [form] = Form.useForm();
  const { Option } = Select;
  const dispatch = useDispatch();

  const [api, contextHolder] = notification.useNotification();

  const onFinish = async (values) => {
    if (onEditForm) {
      onEditForm(values);
      return;
    }
    const { data: dataApi } = await dispatch(addClass(values));
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
  };

  useEffect(() => {
    if (editData && onEditForm) {
      form.setFieldsValue(editData);
    }
  }, [onEditForm, editData]);

  return (
    <>
      {contextHolder}
      <Form onFinish={onFinish} form={form} layout="vertical">
        <Form.Item label="Nama Kelas" name="name">
          <Input placeholder="Nama Kelas" required />
        </Form.Item>
        <Form.Item label="Tingkat" name="grade" required>
          <Select>
            <Option value="1">1</Option>
            <Option value="2">2</Option>
            <Option value="3">3</Option>
            <Option value="4">4</Option>
            <Option value="5">5</Option>
            <Option value="6">6</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Jumlah Siswa" name="total_student">
          <InputNumber type="number" required />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Simpan
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
