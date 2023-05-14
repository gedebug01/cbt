import React, { useCallback, useEffect, useState } from 'react';
import {
  Modal,
  Button,
  notification,
  Typography,
  Tag,
  Radio,
  Popover,
  Row,
  Space,
  Select,
} from 'antd';

import {
  EditOutlined,
  DeleteOutlined,
  AuditOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';

import { CustomTable } from '@/components';

import {
  editQuestion,
  deleteQuestion as deleteQuestionAction,
  setQuestionStatus,
  getOneQuestion,
  adminGetAllQuestion,
  getAllClass,
  deleteResult as deleteResultAction,
} from '@/store/actions';

import AddQuestionForm from '@/components/form/AddQuestionForm';

import styles from './styles.module.scss';
import { exportExcel } from '@/utils/appHelper';

const { Text } = Typography;

export default function QuestionList() {
  const dispatch = useDispatch();
  const [api, contextHolder] = notification.useNotification();

  const [classData, setClassData] = useState([]);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenResultModal, setIsOpenResultModal] = useState(false);
  const [resultData, setResultData] = useState([]);
  const [editData, setEditData] = useState({});
  const [totalData, setTotalData] = useState(10);
  const [pageSize, setPageSize] = useState(10);
  const [classOptions, setClassOptions] = useState([]);
  const [filter, setFilter] = useState({});

  const toggleEditModal = useCallback(() => {
    setIsOpenEditModal((prevState) => !prevState);
  }, []);
  const toggleResultModal = useCallback(() => {
    setIsOpenResultModal((prevState) => !prevState);
  }, []);

  const deleteQuestion = async (id) => {
    const { data } = await dispatch(deleteQuestionAction(id));
    if (data) {
      fetchData();
      api.success({
        description: data.message,
        placement: 'topRight',
      });
    } else {
      api.error({
        description: 'Gagal menghapus data. Coba lagi',
        placement: 'topRight',
      });
    }
  };
  const deleteResult = async (id) => {
    const { data } = await dispatch(deleteResultAction(id));
    if (data) {
      fetchResultData();
      api.success({
        description: data.message,
        placement: 'topRight',
      });
    } else {
      api.error({
        description: 'Gagal menghapus data. Coba lagi',
        placement: 'topRight',
      });
    }
  };

  const deleteClassModal = (id) => {
    Modal.warning({
      title: 'Apakah anda yakin?',
      content: 'Data yang anda hapus tidak dapat di kembalikan lagi',
      onOk: () => deleteQuestion(id),
      onCancel: () => {},
      okCancel: true,
    });
  };
  const deleteResultModal = (id) => {
    Modal.warning({
      title: 'Apakah anda yakin?',
      content: 'Data yang anda hapus tidak dapat di kembalikan lagi',
      onOk: () => deleteResult(id),
      onCancel: () => {},
      okCancel: true,
    });
  };

  const onEditQuestion = async (value) => {
    const { data } = await dispatch(editQuestion(editData.id, value));
    if (data) {
      fetchData();
      api.success({
        description: data.message,
        placement: 'topRight',
      });
      toggleEditModal();
    } else {
      api.error({
        description: 'Gagal mengupdate data. Coba lagi',
        placement: 'topRight',
      });
      toggleEditModal();
    }
  };

  const columns = [
    {
      title: 'Mapel',
      dataIndex: 'mapel',
      key: 'mapel',
    },
    {
      title: 'Link',
      dataIndex: 'link',
      key: 'link',
    },
    {
      title: 'Kelas',
      dataIndex: 'class',
      key: 'class',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Hasil',
      dataIndex: 'result',
      key: 'result',
    },
    {
      title: 'Aksi',
      dataIndex: 'action',
      key: 'action',
    },
  ];

  const resultColumns = [
    {
      title: 'NIS',
      dataIndex: 'nis',
      key: 'nis',
    },
    {
      title: 'Nisn',
      dataIndex: 'nisn',
      key: 'nisn',
    },
    {
      title: 'Nama',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Nilai',
      dataIndex: 'result',
      key: 'result',
    },
    {
      title: 'Kunci Jawaban',
      dataIndex: 'answer',
      key: 'answer',
    },
    {
      title: 'Analisis Jawaban',
      dataIndex: 'answerAnalysis',
      key: 'answerAnalysis',
    },
    {
      title: 'Total Keluar Ujian',
      dataIndex: 'leaveCount',
      key: 'leaveCount',
    },
    {
      title: 'Aksi',
      dataIndex: 'action',
      key: 'action',
    },
  ];

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

  const changeStatus = async (status, id) => {
    const { data } = await dispatch(setQuestionStatus({ status, id }));
    if (data) {
      fetchData();
      api.success({
        description: data.message,
        placement: 'topRight',
      });
    } else {
      api.error({
        description: 'Gagal mengupdate status. Coba lagi',
        placement: 'topRight',
      });
    }
  };

  const fetchResultData = async (id) => {
    const { data } = await dispatch(getOneQuestion(id));
    let ansArr = [];
    const newData = data?.question?.Results?.map((el, i) => {
      const studentAnswer = el.answer;
      const keyAnswer = data?.question?.answer;
      for (let i = 0; i < studentAnswer?.length; i++) {
        if (studentAnswer[i] === keyAnswer[i]) {
          ansArr.push(<p>{studentAnswer[i]}</p>);
        } else {
          ansArr.push(<p style={{ color: 'red' }}>{studentAnswer[i]}</p>);
        }
      }
      return {
        key: i,
        nis: el.Student.nis,
        nisn: el.Student.nisn,
        name: el.Student.full_name,
        result: el.result,
        answer: <p style={{ letterSpacing: 4 }}>{data?.question?.answer}</p>,
        answerAnalysis: (
          <Space size={4}>
            {ansArr.map((el, i) => (
              <React.Fragment key={i}>{el}</React.Fragment>
            ))}
          </Space>
        ),
        leaveCount: el.leave_count,
        action: (
          <Button
            danger
            onClick={() => {
              deleteResultModal(el.id);
            }}
          >
            <DeleteOutlined />
          </Button>
        ),
        task: data?.question?.name,
      };
    });
    setResultData(newData ?? []);
    toggleResultModal();
  };

  const fetchData = async (params) => {
    const { data } = await dispatch(adminGetAllQuestion(params));

    if (data) {
      setTotalData(data.questions?.length ?? 10);
      const newData = data.questions?.map((el, i) => {
        let status = el.status;
        return {
          key: i,
          mapel: el.name,
          link: (
            <Text ellipsis style={{ width: 400 }}>
              <a href={el.question_link} target="_blank">
                {el.question_link}
              </a>
            </Text>
          ),
          class: `${el.Class.grade} - ${el.Class.name}`,
          status: (
            <Popover
              trigger="click"
              content={
                <Space size={15} direction="vertical" align="center">
                  <Row>
                    <Radio.Group onChange={(e) => (status = e.target.value)}>
                      <Radio value={1}>Aktif</Radio>
                      <Radio value={2}>Tidak Aktif</Radio>
                    </Radio.Group>
                  </Row>
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => changeStatus(status, el.id)}
                  >
                    Simpan
                  </Button>
                </Space>
              }
            >
              <Tag color={el.status == 2 ? 'red' : 'green'}>
                {el.status == 2 ? 'tidak aktif' : 'aktif'}
              </Tag>
            </Popover>
          ),
          result: (
            <Button onClick={() => fetchResultData(el.id)}>
              <AuditOutlined />
            </Button>
          ),
          action: (
            <div className={styles.buttonContainer}>
              <Button
                onClick={() => {
                  setEditData({
                    id: el.id,
                    question_link: el.question_link,
                    duration: el.duration,
                    name: el.name,
                    answer: el.answer,
                    class_id: el.class_id,
                    total_question: el.total_question,
                    teacher_id: el.teacher_id,
                  });
                  toggleEditModal();
                }}
              >
                <EditOutlined />
              </Button>
              <Button
                danger
                onClick={() => {
                  deleteClassModal(el.id);
                }}
              >
                <DeleteOutlined />
              </Button>
            </div>
          ),
        };
      });
      setClassData(newData);
    }
  };

  useEffect(() => {
    fetchData(filter);
  }, [filter]);

  return (
    <>
      {contextHolder}
      <Space size={20} className={styles.space}>
        <Space>
          <p>Kelas</p>
          <Select
            value={filter.class_id}
            placeholder="Filter Kelas"
            options={classOptions}
            onChange={(e) => setFilter({ ...filter, class_id: e })}
          />
        </Space>
        <Space>
          <p>Status</p>
          <Select
            value={filter.status}
            placeholder="Filter Status"
            options={[
              { value: 1, label: 'Aktif' },
              { value: 2, label: 'Tidak Aktif' },
            ]}
            onChange={(e) => setFilter({ ...filter, status: e })}
          />
        </Space>
        <Button danger type="primary" onClick={() => setFilter({})}>
          Reset Filter
        </Button>
      </Space>
      <CustomTable
        onChange={(e) => {
          const { pageSize } = e;
          setPageSize(pageSize);
        }}
        pageSize={pageSize}
        total={totalData}
        columns={columns}
        data={classData}
      />
      <Modal
        open={isOpenEditModal}
        title="Title"
        onOk={toggleEditModal}
        onCancel={toggleEditModal}
        footer={[
          <Button key="back" onClick={toggleEditModal}>
            Cancel
          </Button>,
        ]}
      >
        <AddQuestionForm
          onEditForm={onEditQuestion}
          editData={editData}
          isAdmin
        />
      </Modal>
      <Modal
        open={isOpenResultModal}
        title="Title"
        onOk={toggleResultModal}
        onCancel={toggleResultModal}
        width={() => {
          if (typeof window !== undefined) {
            const { innerWidth: width } = window;
            return width - 500;
          } else {
            return 800;
          }
        }}
        footer={[
          <Button
            type="primary"
            onClick={() => {
              exportExcel(resultData[0]?.task, resultData);
            }}
          >
            Download
            <DownloadOutlined />
          </Button>,
        ]}
      >
        <CustomTable data={resultData} columns={resultColumns} />
      </Modal>
    </>
  );
}
