import { useCallback, useEffect, useState } from 'react';
import { Modal, Button, notification, Input, Tag, Result, Spin } from 'antd';

import { ExportOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';

import { CustomTable } from '@/components';

import styles from './styles.module.scss';
import {
  getOneToken,
  getResult,
  getStudentProfile,
  studentGetAllQuestion,
} from '@/store/actions/student';
import { useRouter } from 'next/router';
import moment from 'moment';
import LS_KEYS from '@/constant/localStorage';

function ExamListPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();

  const [examData, setExamData] = useState([]);
  // const [allResult, setAllResult] = useState([]);
  const [totalData, setTotalData] = useState(10);
  const [pageSize, setPageSize] = useState(10);
  const [studentStatus, setStudentStatus] = useState(false);

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [selectedQuestion, setSelectedQuestion] = useState('');

  const [inputToken, setInputToken] = useState('');

  // const [clipPermission, setClipPermission] = useState(false);
  // const [permissionModal, setPermissionModal] = useState(false);

  // useEffect(() => {
  //   if (!clipPermission) {
  //     setPermissionModal(true);
  //   } else {
  //     setPermissionModal(false);
  //   }
  // }, [clipPermission]);

  // const checkPermission = async () => {
  //   const permission = await navigator.permissions.query({
  //     name: 'clipboard-read',
  //   });
  //   if (permission.state === 'granted') {
  //     setClipPermission(true);
  //     navigator.clipboard.writeText('');
  //   } else {
  //     setClipPermission(false);
  //   }
  // };
  // useEffect(() => {
  //   checkPermission();
  // }, []);

  const clearStorage = async () => {
    if (typeof window !== undefined) {
      localStorage.removeItem(LS_KEYS.STUDENT_EXAM);
      localStorage.removeItem(LS_KEYS.STUDENT_EXAM_ANSWER);
      localStorage.removeItem(LS_KEYS.STUDENT_EXAM_DURATION);
      localStorage.removeItem(LS_KEYS.STUDENT_EXAM_RESULT_ID);
      localStorage.removeItem(LS_KEYS.STUDENT_EXAM_TOTAL_QUESTION);
      localStorage.removeItem(LS_KEYS.STUDENT_EXAM_QUESTION);
      localStorage.removeItem(LS_KEYS.STUDENT_EXAM_BLUR_COUNT);
      localStorage.removeItem(LS_KEYS.STUDENT_EXAM_QUESTION_ID);
      // localStorage.removeItem(LS_KEYS.STUDENT_EXAM_SS_COUNT);
    }
  };

  useEffect(() => {
    clearStorage();
  }, []);

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
      const expire = +dataApi?.token.expire;
      const now = moment().unix();

      if (now > expire || dataApi.token.question_id !== selectedQuestion) {
        api.error({
          message: `Gagal`,
          description: 'Token kadaluarsa atau salah. Coba lagi',
          placement: 'topRight',
        });
        handleCancel();
        setConfirmLoading(false);
        return;
      }

      api.success({
        description: 'Token benar',
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
      const { class_id, status } = student;
      const { data } = await dispatch(studentGetAllQuestion(class_id));
      const { data: resultData } = await dispatch(getResult());

      const questions = [];
      data?.questions?.forEach((item) => {
        let resultTemplate = { ...item };
        resultData.forEach((res) => {
          if (res?.question_id === item?.id) {
            resultTemplate.result = +res.result;
            resultTemplate.question_id = res.question_id;
          }
        });
        questions.push(resultTemplate);
      });

      setStudentStatus(status);
      if (data) {
        setTotalData(data.questions?.length ?? 10);
        const newData = questions?.map((el, i) => {
          return {
            key: i,
            question: el.name,
            action: (
              <div className={styles.buttonContainer}>
                {el?.result || el?.result == 0 ? (
                  <Tag color={el?.result < 50 ? 'error' : 'green'}>
                    <p style={{ fontWeight: 500 }}>Hasil: {el?.result}</p>
                  </Tag>
                ) : (
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
                )}
              </div>
            ),
          };
        });
        setExamData(newData);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {contextHolder}
      {studentStatus ? (
        <div>
          {/* <div className={clipPermission ? '' : styles.blur}> */}
          <CustomTable
            columns={columns}
            onChange={(e) => {
              const { pageSize } = e;
              setPageSize(pageSize);
            }}
            pageSize={pageSize}
            data={examData}
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
          {/* <Modal
            title="Izinkan Membaca Clipboard Screenshoot"
            open={permissionModal}
            onOk={async () => {
              const permite = await navigator.clipboard.read();
              if (permite) {
                window.location.reload(true);
                setPermissionModal(false);
              }
            }}
            onCancel={() => setPermissionModal(false)}
          /> */}
        </div>
      ) : null}
    </>
  );
}

function ExamBlockPage() {
  return (
    <Result
      status="403"
      title="Maaf, anda tidak bisa mengikuti ujian."
      subTitle="Silahkan lunasi pembayaran anda untuk mengikuti ujian."
    />
  );
}

export default function ExamList() {
  const dispatch = useDispatch();
  const [status, setStatus] = useState(null);

  const fetchStatus = async () => {
    const { data } = await dispatch(getStudentProfile());
    if (data) {
      const { student } = data;
      setStatus(student.status);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  if (!status) {
    return (
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
        }}
      >
        <Spin />
      </div>
    );
  }

  return status > 1 ? <ExamBlockPage /> : <ExamListPage />;
}
