import { useCallback, useEffect, useState } from 'react';
import { Modal, Button, notification } from 'antd';

import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';

import { CustomTable } from '@/components';

import {
  editClass,
  getAllClass,
  deleteClass as deleteClassAction,
} from '@/store/actions';

import styles from './styles.module.scss';
import AddClassForm from '@/components/form';

export default function ClassList() {
  const dispatch = useDispatch();
  const [api, contextHolder] = notification.useNotification();

  const [classData, setClassData] = useState([]);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [totalData, setTotalData] = useState(10);
  const [pageSize, setPageSize] = useState(10);

  const toggleEditModal = useCallback(() => {
    setIsOpenEditModal((prevState) => !prevState);
  }, []);

  const deleteClass = async (id) => {
    const { data } = await dispatch(deleteClassAction(id));
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
      onOk: () => deleteClass(id),
      onCancel: () => {},
      okCancel: true,
    });
  };

  const onEditClass = async (value) => {
    const { data } = await dispatch(editClass(editData.id, value));
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
      title: 'Tingkat',
      dataIndex: 'class',
      key: 'class',
    },
    {
      title: 'Nama Kelas',
      dataIndex: 'className',
      key: 'className',
    },
    {
      title: 'Jumlah Siswa',
      dataIndex: 'totalStudents',
      key: 'totalStudents',
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Aksi',
      dataIndex: 'action',
      key: 'action',
    },
  ];

  const fetchData = async () => {
    const { data } = await dispatch(getAllClass());

    if (data) {
      setTotalData(data.class?.length ?? 10);
      const newData = data.class?.map((el, i) => {
        return {
          key: i,
          class: el.grade,
          className: el.name,
          totalStudents: el.total_student,
          id: el.id,
          action: (
            <div className={styles.buttonContainer}>
              <Button
                onClick={() => {
                  setEditData({
                    id: el.id,
                    name: el.name,
                    grade: el.grade,
                    total_student: el.total_student,
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
        open={isOpenEditModal}
        title="Edit Kelas"
        onOk={toggleEditModal}
        onCancel={toggleEditModal}
        footer={[
          <Button key="back" onClick={toggleEditModal}>
            Cancel
          </Button>,
        ]}
      >
        <AddClassForm onEditForm={onEditClass} editData={editData} />
      </Modal>
    </>
  );
}
