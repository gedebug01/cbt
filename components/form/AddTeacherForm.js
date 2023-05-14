import React, { useEffect } from 'react';
import { Button, Form, Input, notification } from 'antd';

import { useDispatch } from 'react-redux';

import { addTeacher } from '@/store/actions';

export default function AddTeacherForm({ onEditForm, editData, isEdit }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [api, contextHolder] = notification.useNotification();

  const onFinish = async (values) => {
    if (onEditForm) {
      onEditForm(values);
      return;
    }
    const { data: dataApi } = await dispatch(addTeacher(values));
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
        <Form.Item label="Nama Lengkap" name="full_name">
          <Input placeholder="Name Lengkap" required />
        </Form.Item>
        <Form.Item label="Mata Pelajaran" name="task">
          <Input placeholder="Mata Pelajaran" required />
        </Form.Item>
        <Form.Item label="Username" name="username">
          <Input placeholder="Username" required />
        </Form.Item>
        <Form.Item label="Password" name="password">
          <Input type="password" placeholder="Password" required={!isEdit} />
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
