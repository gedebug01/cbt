import { useCallback, useEffect, useState } from 'react';
import { Modal, Button, notification, Space, Input } from 'antd';

import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';

import { CustomTable } from '@/components';

import {
  editStudent,
  getAllStudent,
  deleteStudent as deleteStudentAction,
} from '@/store/actions';

import styles from './styles.module.scss';
import AddStudentForm from '@/components/form/AddStudentForm';

export default function StudentList() {
  const dispatch = useDispatch();
  const [api, contextHolder] = notification.useNotification();

  const [studentData, setStudentData] = useState([]);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [totalData, setTotalData] = useState(1);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');

  const toggleEditModal = useCallback(() => {
    setIsOpenEditModal((prevState) => !prevState);
  }, []);

  const deleteStudent = async (id) => {
    const { data } = await dispatch(deleteStudentAction(id));
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
      onOk: () => deleteStudent(id),
      onCancel: () => {},
      okCancel: true,
    });
  };

  const onEditStudent = async (value) => {
    const { data } = await dispatch(editStudent(editData.id, value));
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
      title: 'Kelas',
      dataIndex: 'className',
      key: 'className',
    },
    {
      title: 'Username',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'NISN',
      dataIndex: 'nisn',
      key: 'nisn',
    },
    {
      title: 'NIS',
      dataIndex: 'nis',
      key: 'nis',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Aksi',
      dataIndex: 'action',
      key: 'action',
    },
  ];

  const fetchData = async () => {
    const { data } = await dispatch(getAllStudent(page, pageSize, search));

    if (data) {
      setTotalData(data.totalItems);
      const newData = data.data?.map((el, i) => {
        return {
          key: i,
          fullName: el.full_name,
          className: `${el.Class.grade} ${el.Class.name}`,
          userName: el.username,
          nisn: el.nisn,
          nis: el.nis,
          status: el.status === 1 ? 'Aktif' : 'Tidak Aktif',
          totalStudents: el.total_student,
          action: (
            <div className={styles.buttonContainer}>
              <Button
                onClick={() => {
                  setEditData({
                    id: el.id,
                    full_name: el.full_name,
                    class_id: el.class_id,
                    username: el.username,
                    nisn: el.nisn,
                    nis: el.nis,
                    status: el.status,
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
      setStudentData(newData);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize, search]);

  return (
    <>
      {contextHolder}
      <Space size={20} className={styles.space}>
        <Input.Search onSearch={(e) => setSearch(e)} />
      </Space>
      <CustomTable
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
        columns={columns}
        data={studentData}
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
        <AddStudentForm onEditForm={onEditStudent} editData={editData} isEdit />
      </Modal>
    </>
  );
}
