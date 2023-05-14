import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select, InputNumber, notification } from 'antd';

import { useDispatch } from 'react-redux';

import { addStudent, getAllClass } from '@/store/actions';

export default function AddExamForm({ onEditForm, editData, isEdit }) {
  const [form] = Form.useForm();
  const { Option } = Select;
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
        <Form.Item label="Nama Ujian" name="name" required>
          <Input placeholder="Nama Ujian" required />
        </Form.Item>
        <Form.Item label="Kelas" name="class_id" required>
          <Select options={classOptions} mode="multiple" />
        </Form.Item>
        <Form.Item label="Durasi" name="duration" required>
          <Input placeholder="Durasi" required />
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
