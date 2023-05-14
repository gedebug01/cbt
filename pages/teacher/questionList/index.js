import { useCallback, useEffect, useState } from 'react';
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
  getAllQuestion,
  deleteQuestion as deleteQuestionAction,
  setQuestionStatus,
  getOneQuestion,
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
        description: 'Gagal mengupdate data. Coba lagi',
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
  ];

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
    const newData = data?.question?.Results?.map((el, i) => {
      return {
        key: i,
        nis: el.Student.nis,
        nisn: el.Student.nisn,
        name: el.Student.full_name,
        result: el.result,
        task: data?.question?.name,
      };
    });
    setResultData(newData ?? []);
    toggleResultModal();
  };

  const fetchData = async () => {
    const { data } = await dispatch(getAllQuestion());

    if (data) {
      setTotalData(data.questions?.length ?? 10);
      const newData = data.questions?.map((el, i) => {
        let status = el.status;
        return {
          key: i,
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
    fetchData();
  }, []);

  return (
    <>
      {contextHolder}
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
        <AddQuestionForm onEditForm={onEditQuestion} editData={editData} />
      </Modal>
      <Modal
        open={isOpenResultModal}
        title="Title"
        onOk={toggleResultModal}
        onCancel={toggleResultModal}
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
