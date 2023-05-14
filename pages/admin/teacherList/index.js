import { useCallback, useEffect, useState } from 'react';
import { Modal, Button, notification } from 'antd';

import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';

import { CustomTable } from '@/components';

import {
  editTeacher,
  getAllTeacher,
  deleteTeacher as deleteTeacherAction,
} from '@/store/actions';

import styles from './styles.module.scss';
import AddTeacherForm from '@/components/form/AddTeacherForm';

export default function TeacherList() {
  const dispatch = useDispatch();
  const [api, contextHolder] = notification.useNotification();

  const [teacherData, setTeacherData] = useState([]);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [totalData, setTotalData] = useState(10);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');

  const toggleEditModal = useCallback(() => {
    setIsOpenEditModal((prevState) => !prevState);
  }, []);

  const deleteTeacher = async (id) => {
    const { data } = await dispatch(deleteTeacherAction(id));
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
      onOk: () => deleteTeacher(id),
      onCancel: () => {},
      okCancel: true,
    });
  };

  const onEditTeacher = async (value) => {
    const { data } = await dispatch(editTeacher(editData.id, value));
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
      title: 'Nama Lengkap',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Mata Pelajaran',
      dataIndex: 'task',
      key: 'task',
    },
    {
      title: 'Username',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Aksi',
      dataIndex: 'action',
      key: 'action',
    },
  ];

  const fetchData = async () => {
    const { data } = await dispatch(getAllTeacher(page, pageSize, search));
    if (data) {
      setTotalData(data.totalItems);

      const newData = data.data?.map((el, i) => {
        return {
          key: i,
          fullName: el.full_name,
          task: el.task,
          userName: el.username,
          action: (
            <div className={styles.buttonContainer}>
              <Button
                onClick={() => {
                  setEditData({
                    id: el.id,
                    full_name: el.full_name,
                    task: el.task,
                    username: el.username,
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
      setTeacherData(newData);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [page, pageSize]);

  return (
    <>
      {contextHolder}
      <CustomTable
        columns={columns}
        data={teacherData}
        pageSize={pageSize}
        total={totalData}
        onChange={(e) => {
          const { current, pageSize } = e;
          setPageSize(pageSize);
          if (current > 1) {
            setPage(current - 1);
          } else {
            setPage(0);
          }
        }}
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
        <AddTeacherForm onEditForm={onEditTeacher} editData={editData} isEdit />
      </Modal>
    </>
  );
}
