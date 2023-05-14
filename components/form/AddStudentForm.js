import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select, InputNumber, notification } from 'antd';

import { useDispatch } from 'react-redux';

import { addStudent, getAllClass } from '@/store/actions';

export default function AddStudentForm({ onEditForm, editData, isEdit }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [api, contextHolder] = notification.useNotification();

  const [classOptions, setClassOptions] = useState([]);

  const fetchAllClass = async () => {
    const { data } = await dispatch(getAllClass());

    if (data) {
      const newOptions = data?.class?.map((el) => {
        return {
          label: `${el.grade} ${el.name}`,
          value: el.id,
        };
      });
      setClassOptions(newOptions);
    }
  };

  useEffect(() => {
    fetchAllClass();
  }, []);

  const onFinish = async (values) => {
    if (!values.class_id) {
      api.warning({
        description: 'Kelas tidak boleh kosong',
        placement: 'topRight',
      });
      return;
    }
    if (!values.status) {
      api.warning({
        description: 'Status tidak boleh kosong',
        placement: 'topRight',
      });
      return;
    }
    if (onEditForm) {
      onEditForm(values);
      return;
    }
    const { data: dataApi } = await dispatch(addStudent(values));
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
        <Form.Item label="Password" name="password">
          <Input type="password" placeholder="Password" required={!isEdit} />
        </Form.Item>
        <Form.Item label="Kelas" name="class_id" required>
          <Select options={classOptions} />
        </Form.Item>
        <Form.Item label="Username" name="username">
          <Input placeholder="Username" required />
        </Form.Item>
        <Form.Item label="NISN" name="nisn">
          <Input placeholder="NISN" required />
        </Form.Item>
        <Form.Item label="NIS" name="nis">
          <Input placeholder="NIS" required />
        </Form.Item>
        <Form.Item label="Status" name="status">
          <Select
            placeholder="Pilih Status"
            options={[
              { value: 1, label: 'Aktif' },
              { value: 2, label: 'Tidak Aktif' },
            ]}
          />
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
