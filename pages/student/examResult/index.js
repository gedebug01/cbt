import { useCallback, useEffect, useState } from 'react';
import { Modal, Button, notification, Input } from 'antd';

import { ExportOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';

import { CustomTable } from '@/components';

import styles from './styles.module.scss';
import {
  getOneToken,
  getStudentProfile,
  studentGetAllQuestion,
} from '@/store/actions/student';
import { useRouter } from 'next/router';

export default function ExamList() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();

  const [classData, setClassData] = useState([]);
  const [totalData, setTotalData] = useState(10);
  const [pageSize, setPageSize] = useState(10);

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [selectedQuestion, setSelectedQuestion] = useState('');

  const [inputToken, setInputToken] = useState('');

  const showModal = () => {
    setOpen((prevState) => !prevState);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    const { data: dataApi } = await dispatch(getOneToken(inputToken));
    if (dataApi?.token) {
      api.success({
        description: dataApi.message,
        placement: 'topRight',
      });
      handleCancel();
      setConfirmLoading(false);
      router.push({
        pathname: '/student/examPage',
        query: { question_id: selectedQuestion },
      });
    } else {
      api.error({
        message: `Gagal`,
        description: 'Token salah. Coba lagi',
        placement: 'topRight',
      });
      handleCancel();
      setConfirmLoading(false);
    }
  };

  const columns = [
    {
      title: 'Soal',
      dataIndex: 'question',
      key: 'question',
    },
    {
      title: 'Aksi',
      dataIndex: 'action',
      key: 'action',
    },
  ];

  const fetchData = async () => {
    const { data } = await dispatch(getStudentProfile());
    const { student } = data;

    if (student) {
      const { class_id } = student;
      const { data } = await dispatch(studentGetAllQuestion(class_id));

      if (data) {
        setTotalData(data.questions?.length ?? 10);
        const newData = data.questions?.map((el, i) => {
          return {
            key: i,
            question: el.name,
            action: (
              <div className={styles.buttonContainer}>
                <Button
                  type="primary"
                  onClick={() => {
                    setSelectedQuestion(el.id);
                    showModal();
                  }}
                >
                  <ExportOutlined />
                  Masuk
                </Button>
              </div>
            ),
          };
        });
        setClassData(newData);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {contextHolder}
      <CustomTable
        columns={columns}
        onChange={(e) => {
          const { pageSize } = e;
          setPageSize(pageSize);
        }}
        pageSize={pageSize}
        data={classData}
        total={totalData}
      />
      <Modal
        title="Masukan Token"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Input
          value={inputToken}
          onChange={(e) => setInputToken(e.target.value)}
        />
      </Modal>
    </>
  );
}
