import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Row,
  Typography,
  Divider,
  notification,
  Modal,
  InputNumber,
  Space,
  Select,
} from 'antd';

import { CustomTable } from '@/components';

import { useDispatch } from 'react-redux';
import {
  createToken,
  listToken,
  deleteToken as actionDeleteToken,
  adminGetAllQuestion,
} from '@/store/actions';
import AddExamForm from '@/components/form/AddExamForm';
import { genRandonString } from '@/utils/appHelper';
import { DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Text, Title } = Typography;

export default function CreateExam() {
  const dispatch = useDispatch();
  const [api, contextHolder] = notification.useNotification();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [token, setToken] = useState('* * * * *');
  const [duration, setDuration] = useState(1);
  const [totalData, setTotalData] = useState(10);
  const [tokenData, setTokenData] = useState([]);
  const [questionOption, setQuestionOption] = useState([]);
  const [questionId, setQuestionId] = useState(null);

  const deleteToken = async (id) => {
    const { data } = await dispatch(actionDeleteToken(id));
    if (data) {
      fetchData();
      api.success({
        description: 'Berhasil menghapus soal',
        placement: 'topRight',
      });
    } else {
      api.error({
        description: 'Gagal mengupdate data. Coba lagi',
        placement: 'topRight',
      });
    }
  };

  const deleteModal = (id) => {
    Modal.warning({
      title: 'Apakah anda yakin?',
      content: 'Data yang anda hapus tidak dapat di kembalikan lagi',
      onOk: () => deleteToken(id),
      onCancel: () => {},
      okCancel: true,
    });
  };

  const fetchData = async () => {
    const { data } = await dispatch(listToken());

    if (data) {
      setTotalData(data?.length ?? 10);
      const newData = data?.map((el, i) => {
        return {
          key: i,
          expire: moment.unix(el?.expire).format('DD MMMM, YYYY hh:mm A'),
          token: el.secret_token,
          question_id: el.question_id,
          question_name: el.Question.name,
          class_name: `${el.Question.Class.grade} ${el.Question.Class.name}`,
          id: el.id,
          action: (
            <Button
              danger
              onClick={() => {
                deleteModal(el.id);
              }}
            >
              <DeleteOutlined />
            </Button>
          ),
        };
      });
      setTokenData(newData);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
    fetchQuestion();
  };
  const resetState = () => {
    setToken('* * * * *');
    setQuestionId(null);
    setDuration(0);
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    resetState();
  };
  const handleOk = async () => {
    if (token === '* * * * *') {
      api.warning({
        description: 'Token tidak boleh kosong',
        placement: 'topRight',
      });
      return;
    }
    if (!duration || duration === 0) {
      api.warning({
        description: 'Durasi tidak boleh kosong',
        placement: 'topRight',
      });
      return;
    }
    if (!questionId) {
      api.warning({
        description: 'Soal tidak boleh kosong',
        placement: 'topRight',
      });
      return;
    }
    const { data: dataApi } = await dispatch(
      createToken({
        secret_token: token,
        expire: moment().add(duration, 'hour').unix(),
        question_id: questionId,
      })
    );
    if (dataApi) {
      api.success({
        description: 'Berhasil Menambahkan Token',
        placement: 'topRight',
      });
      fetchData();
      resetState();
      handleCancel();
    } else {
      api.error({
        description: 'Gagal menambahkan token. Coba lagi',
        placement: 'topRight',
      });
      handleCancel();
    }
  };

  const columns = [
    {
      title: 'Token',
      dataIndex: 'token',
      key: 'token',
    },
    {
      title: 'Expire',
      dataIndex: 'expire',
      key: 'expire',
    },
    {
      title: 'Soal',
      dataIndex: 'question_name',
      key: 'question_name',
    },
    {
      title: 'Kelas',
      dataIndex: 'class_name',
      key: 'class_name',
    },
    {
      title: 'Aksi',
      dataIndex: 'action',
      key: 'action',
    },
  ];

  const generateToken = useCallback(() => {
    const token = genRandonString(5);
    setToken(token);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchQuestion = async () => {
    const { data } = await dispatch(adminGetAllQuestion());

    if (data) {
      setTotalData(data.questions?.length ?? 10);
      const newData = [];
      data.questions?.forEach((el) => {
        const alreadyHaveToken = tokenData.some(
          (elx) => elx.question_id === el.id
        );
        if (!alreadyHaveToken) {
          newData.push({
            value: el.id,
            label: `${el.name} - ${el.Class.grade} ${el.Class.name}`,
          });
        }
      });
      setQuestionOption(newData);
    }
  };

  return (
    <>
      {contextHolder}
      <Title level={2}>Tambah Token</Title>
      <Text>
        Tambah Data Token dengan mengisi form di bawah ini sebagai syarat
        mengikuti ujian.
      </Text>
      <Divider />
      <Row gutter={24}>
        {/* <Col span={12}>
          <Card title="Kelas" bordered={false}>
            <AddExamForm />
          </Card>
        </Col> */}
        <Col span={24}>
          <Card
            title="Token"
            bordered={false}
            extra={<Button onClick={showModal}>Buat Token</Button>}
          >
            <CustomTable columns={columns} data={tokenData} total={totalData} />
          </Card>
        </Col>
      </Row>
      <Modal
        title="Buat Token"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={
          <Space size={30}>
            <Button type="primary" ghost onClick={generateToken}>
              Generate
            </Button>
            <Space>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button
                onClick={handleOk}
                type="primary"
                disabled={token === '* * * * *'}
              >
                Save
              </Button>
            </Space>
          </Space>
        }
      >
        <Row gutter={24} align="middle" justify="center">
          <Col span={24}>
            <p style={{ fontWeight: 700 }}>Token:</p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                background: '#f0f0f0',
                padding: 5,
                borderRadius: 5,
                marginBottom: 20,
              }}
            >
              <p style={{ fontWeight: 700 }}>{token}</p>
            </div>
          </Col>
          <Col
            span={24}
            style={{
              marginBottom: 20,
            }}
          >
            <p style={{ fontWeight: 700 }}>Soal</p>
            <Select
              style={{
                width: '50%',
              }}
              value={questionId}
              onChange={setQuestionId}
              placeholder="Pilih Soal"
              options={questionOption}
            />
          </Col>
          <Col
            span={24}
            style={{
              marginBottom: 20,
            }}
          >
            <p style={{ fontWeight: 700 }}>Durasi:</p>
            <InputNumber
              style={{
                width: '25%',
              }}
              value={duration}
              onChange={setDuration}
              min={1}
              max={24}
              addonAfter="Jam"
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
}
