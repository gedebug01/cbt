import React, { useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, notification, Select } from 'antd';

import { useDispatch } from 'react-redux';

import { bulkAddQuestion, getAllClass, getAllTeacher } from '@/store/actions';
import { useRouter } from 'next/router';

const { TextArea } = Input;
export default function AddQuestionForm({ onEditForm, editData, isAdmin }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const router = useRouter();

  const [api, contextHolder] = notification.useNotification();
  const [classOptions, setClassOptions] = useState([]);
  const [teacherOptions, setTeacherOptions] = useState([]);

  const onFinish = async (values) => {
    const {
      class_id,
      teacher_id,
      answer,
      question_link,
      name,
      duration,
      total_question,
    } = values ?? {};
    if (!class_id) {
      api.warning({
        description: 'Kelas tidak boleh kosong',
        placement: 'topRight',
      });
      return;
    }
    if (isAdmin && !teacher_id) {
      api.warning({
        description: 'Guru mapel tidak boleh kosong',
        placement: 'topRight',
      });
      return;
    }
    if (onEditForm) {
      onEditForm(values);
      return;
    }

    if (answer.length < total_question) {
      return api.error({
        description: 'Jumlah kunci jawaban kurang dari jumlah butir soal',
        placement: 'topRight',
      });
    }
    const payload = class_id?.map((el) => ({
      name,
      total_question,
      duration,
      answer,
      question_link,
      teacher_id,
      class_id: el,
    }));

    const { data: dataApi } = await dispatch(bulkAddQuestion(payload));
    if (dataApi) {
      api.success({
        description: dataApi.message,
        placement: 'topRight',
      });
      if (isAdmin) {
        router.push('/admin/questionList');
      } else {
        router.push('/teacher/questionList');
      }
    } else {
      api.error({
        description: 'Gagal menambahkan data. Coba lagi',
        placement: 'topRight',
      });
    }
  };

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

  const fetchAllTeacher = async () => {
    const { data } = await dispatch(getAllTeacher());

    if (data) {
      const newOptions = data?.data?.map((el) => {
        return {
          label: el.full_name,
          value: el.id,
        };
      });
      setTeacherOptions(newOptions);
    }
  };

  useEffect(() => {
    fetchAllClass();
    fetchAllTeacher();
  }, []);

  useEffect(() => {
    if (editData && onEditForm) {
      form.setFieldsValue(editData);
    }
  }, [onEditForm, editData]);

  return (
    <>
      {contextHolder}
      <Form onFinish={onFinish} form={form} layout="vertical">
        <Form.Item label="Mata Pelajaran" name="name" required>
          <Input placeholder="Mata Pelajaran" required />
        </Form.Item>
        {isAdmin ? (
          <Form.Item label="Guru Mata Pelajaran" name="teacher_id" required>
            <Select placeholder="Guru Mapel" options={teacherOptions} />
          </Form.Item>
        ) : null}
        <Form.Item label="Link Soal" name="question_link" required>
          <Input placeholder="Link Soal" required type="link" />
        </Form.Item>
        <Form.Item label="Kunci Jawaban" name="answer" required>
          <TextArea placeholder="Mata Pelajaran" required />
        </Form.Item>
        <Form.Item label="Kelas" name="class_id" required>
          <Select
            placeholder="Kelas"
            options={classOptions}
            mode={onEditForm ? '' : 'multiple'}
          />
        </Form.Item>
        <Form.Item label="Durasi" name="duration" required>
          <InputNumber placeholder="Durasi" required min={0} step={5} />
        </Form.Item>
        <Form.Item label="Jumlah Butir Soal" name="total_question" required>
          <InputNumber placeholder="Jumlah Butir Soal" required min={0} />
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
