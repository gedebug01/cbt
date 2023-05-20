import React, { useEffect, useState, useCallback } from 'react';
import {
  Drawer,
  FloatButton,
  notification,
  Grid,
  Space,
  Spin,
  Button,
  Modal,
  Row,
} from 'antd';

import {
  collectResult,
  getOneQuestion,
  initResult,
} from '@/store/actions/student';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { FormOutlined } from '@ant-design/icons';
import moment from 'moment';

import LS_KEYS from '@/constant/localStorage';

import style from './styles.module.scss';
import { DefaultLayout, ExamContent, MyTimer } from '@/components';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const { useBreakpoint } = Grid;

function NewExamPage({ isOld }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const questionId = router.query;
  const [api, contextHolder] = notification.useNotification();
  const { md } = useBreakpoint();
  const [question_id, setQuestionId] = useLocalStorage(
    LS_KEYS.STUDENT_EXAM_QUESTION_ID,
    ''
  );
  const [questionLink, setQuestionLink] = useLocalStorage(
    LS_KEYS.STUDENT_EXAM_QUESTION,
    null
  );
  const [qustionTotal, setQustionTotal] = useState([null]);
  const [examDuration, setExamDuration] = useState(null);
  const [resultId, setResultId] = useLocalStorage(
    LS_KEYS.STUDENT_EXAM_RESULT_ID,
    ''
  );
  const [open, setOpen] = useState(true);
  const [height, setHeight] = useState(600);
  const [start, setStart] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [examLoading, setExamLoading] = useState(false);
  const [value, setValue] = useState({});
  const [allowCollect, setAllowCollect] = useState(false);
  const [finishStatus, setfinishStatus] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [studentBlurModal, setStudentBlurModal] = useState(false);
  const [examEnd, setExamEnd] = useState(false);
  const [forceFinish, setForceFinish] = useState(false);
  const [studentBlur, setStudentBlur] = useLocalStorage(
    LS_KEYS.STUDENT_EXAM_BLUR_COUNT,
    0
  );

  const toggleCloseStudentBlurModal = () => {
    setStudentBlurModal(() => false);
  };
  const toggleOpenStudentBlurModal = () => {
    setStudentBlurModal(() => true);
  };

  const showModalAlert = () => {
    setfinishStatus(false);
    setOpenAlert(true);
  };
  const hideModalAlert = () => {
    setOpenAlert(false);
  };

  const onBackButtonEvent = (e) => {
    e.preventDefault();
    if (!finishStatus) {
      showModalAlert();
    }
  };

  useEffect(() => {
    if (questionId?.question_id) {
      setQuestionId(questionId);
    }
  }, [questionId]);

  useEffect(() => {
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', onBackButtonEvent);
    return () => {
      window.removeEventListener('popstate', onBackButtonEvent);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== undefined) {
      const { innerHeight: height } = window;
      setHeight(height);
    }
  });

  const fetchQuestion = async (question_id) => {
    const { data: dataApi } = await dispatch(getOneQuestion(question_id));
    if (dataApi) {
      const arr = new Array(dataApi.question?.total_question)
        .fill('')
        .map((_, i) => i + 1);

      setQuestionLink(dataApi.question?.question_link);
      setQustionTotal(arr);
      setExamDuration(dataApi.question?.duration);

      if (typeof window !== undefined) {
        localStorage.setItem(
          LS_KEYS.STUDENT_EXAM_TOTAL_QUESTION,
          JSON.stringify(arr)
        );
      }
    } else {
      api.error({
        description: 'Gagal meload soal',
        placement: 'topRight',
      });
    }
  };
  const refreshQuestion = async () => {
    if (window) {
      window.location?.reload(false);
    }
  };

  const toggleDrawer = useCallback(() => {
    setOpen((prevState) => !prevState);
  }, []);

  const hideModal = async () => {
    setExamLoading(true);
    const { data: dataApi } = await dispatch(
      initResult({
        question_id: question_id.question_id,
        start_time: moment().unix(),
      })
    );
    if (dataApi) {
      setResultId(dataApi.id);
      setStart(true);
      setExamLoading(false);
    } else {
      api.error({
        message: `Gagal`,
        description: 'Coba lagi',
        placement: 'topRight',
      });
      setExamLoading(false);
      setOpen(false);
    }
  };
  const setOldData = () => {
    if (typeof window !== undefined) {
      const oldAnswer = localStorage.getItem(LS_KEYS.STUDENT_EXAM_ANSWER);
      const oldTotalQuestion = localStorage.getItem(
        LS_KEYS.STUDENT_EXAM_TOTAL_QUESTION
      );
      setValue(JSON.parse(oldAnswer) ?? {});
      setQustionTotal(JSON.parse(oldTotalQuestion));
    }
  };

  useEffect(() => {
    if (isOld) {
      setStart(true);
      setOldData();
    }
  }, [isOld]);

  useEffect(() => {
    if (question_id && !isOld) {
      fetchQuestion(question_id);
    }
  }, [isOld, question_id]);

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
    }
  };

  const onExamFinish = async (value) => {
    let answer = '';

    if (!examEnd) {
      if (!forceFinish) {
        if (Object.values(value).length !== qustionTotal?.length) {
          api.warning({
            message: 'Silahkan jawab seluruh soal terlebih dahulu',
          });
          return;
        }

        if (!allowCollect) {
          api.warning({
            message:
              'Kumpul jawaban minimal dibawah 15 menit sebelum waktu berakhir',
          });
          return;
        }
      } else {
        if (Object.values(value).length !== qustionTotal?.length) {
          return;
        }
      }
    }

    for (let i = 1; i <= qustionTotal?.length; i++) {
      if (value[i]) {
        answer += value[i];
      } else {
        answer += '-';
      }
    }
    await dispatch(
      collectResult(resultId, {
        answer,
        end_time: moment().unix(),
        question_id: question_id.question_id,
        leave_count: studentBlur,
      })
    );

    await clearStorage();
    router.push('/student/examList');
  };

  const onChange = useCallback(
    (value) => {
      setValue(value);
    },
    [value]
  );

  useEffect(() => {
    if (typeof window !== undefined) {
      localStorage.setItem(LS_KEYS.STUDENT_EXAM, 1);
    }
  }, []);

  const blurCounter = async (blur) => {
    let count = +blur + 1;
    await setStudentBlur(() => count);
  };

  const onFocus = () => {
    if (+studentBlur >= 0) {
      blurCounter(studentBlur);
    }
  };

  const onBlur = () => {
    toggleOpenStudentBlurModal();
  };

  useEffect(() => {
    if (studentBlur > 2) {
      setForceFinish(true);
    }
    if (forceFinish) {
      onExamFinish(value);
    }
  }, [studentBlur]);

  //! colect result when user go out of exam
  useEffect(() => {
    window.addEventListener('blur', onBlur);
    document.addEventListener('message', onBlur);

    return () => {
      document.removeEventListener('message', onBlur);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  const listenSs = (e) => {
    if (e.key == 'PrintScreen') {
      navigator.clipboard.writeText('');
    }
  };
  useEffect(() => {
    window.addEventListener('keyup', (e) => listenSs(e));
    return () => {
      window.removeEventListener('keyup', (e) => listenSs(e));
    };
  }, []);

  useEffect(() => {
    if (forceFinish) {
      onExamFinish(value);
    }
  }, [forceFinish]);

  useEffect(() => {
    if (examEnd) {
      onExamFinish(value);
    }
  }, [examEnd]);

  return (
    <DefaultLayout>
      {contextHolder}
      {questionLink ? (
        <div className={style.containerWrap} style={{ height }}>
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
              marginTop: -15,
              marginBottom: 15,
            }}
          >
            {start ? (
              <>
                <MyTimer
                  onFinish={() => setExamEnd(true)}
                  duration={examDuration}
                  isOld={isOld}
                  allowCollect={setAllowCollect}
                />
              </>
            ) : (
              <p>Loading...</p>
            )}
            <Button type="primary" onClick={refreshQuestion}>
              Refresh Soal
            </Button>
          </div>
          <div
            className={[
              md ? style.container : style.containerMobile,
              start ? '' : style.blur,
            ].join(' ')}
          >
            <div className={style.frameContainer}>
              <div className={style.iframeInner}>
                <iframe
                  className={style.iframe}
                  onLoad={() => setLoaded(true)}
                  sandbox="allow-scripts allow-same-origin"
                  frameBorder="0"
                  height="100%"
                  src={questionLink}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                />
              </div>
            </div>
            {open && md ? (
              <div className={style.answerContainer}>
                <ExamContent
                  value={value}
                  isOld={isOld}
                  onValueChange={onChange}
                  onExamFinish={onExamFinish}
                  qustionTotal={qustionTotal}
                />
              </div>
            ) : null}
          </div>
          <Modal
            open={!start && !isOld}
            closable={false}
            footer={
              <Button
                size="small"
                type="primary"
                onClick={hideModal}
                disabled={!loaded}
                loading={examLoading}
              >
                Mulai
              </Button>
            }
          >
            <p>Berdoalah sebelum mengerjakan soal</p>
          </Modal>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Spin />
        </div>
      )}
      {md ? (
        <FloatButton
          onClick={toggleDrawer}
          icon={<FormOutlined />}
          type="default"
          style={{ right: 25, bottom: 20, background: '#BEF0CB' }}
        />
      ) : (
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button
            onClick={toggleDrawer}
            type="primary"
            style={{
              width: '70%',
              fontWeight: 'bold',
            }}
          >
            Jawab
          </Button>
        </div>
      )}
      <Modal
        open={openAlert}
        footer={
          <Space>
            <Button type="primary" onClick={hideModalAlert}>
              Tutup
            </Button>
          </Space>
        }
      >
        <p>
          Memencet tombol kembali berulangkali dapat menyebabkan seluruh data
          ujian anda akan terhapus!
        </p>
      </Modal>
      <Modal
        title="Anda terdeteksi keluar dari halaman ujian!"
        open={studentBlurModal}
        onCancel={toggleCloseStudentBlurModal}
        footer={
          <Button
            onClick={() => {
              toggleCloseStudentBlurModal();
              onFocus();
            }}
          >
            Tutup
          </Button>
        }
      >
        <p>
          Ujian anda akan di batalkan jika anda tetap keluar dari halaman ujian.
        </p>
      </Modal>
      {!md ? (
        <Drawer
          title="Jawaban"
          placement="bottom"
          height={400}
          onClose={toggleDrawer}
          open={open}
        >
          <ExamContent
            value={value}
            isOld={isOld}
            onValueChange={onChange}
            onExamFinish={onExamFinish}
            qustionTotal={qustionTotal}
          />
        </Drawer>
      ) : null}
    </DefaultLayout>
  );
}

export default function ExamPage() {
  const [examStatus, setExamStatus] = useState(null);

  useEffect(() => {
    if (typeof window !== undefined) {
      const exam = localStorage.getItem(LS_KEYS.STUDENT_EXAM);
      exam ? setExamStatus(1) : setExamStatus(0);
    }
  }, []);

  if (examStatus === null) {
    return (
      <Row justify="center">
        <Spin tip="Menyiapkan Ujian..." />
      </Row>
    );
  }

  return <NewExamPage isOld={examStatus === 0 ? false : true} />;
}
