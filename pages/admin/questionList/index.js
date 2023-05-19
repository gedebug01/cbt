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
  Col,
  Input,
} from 'antd';

import {
  EditOutlined,
  DeleteOutlined,
  AuditOutlined,
  DownloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import Highlighter from 'react-highlight-words';

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
import { useRef } from 'react';

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
  const [totalAnswer, setTotalAnswer] = useState(10);
  const [ansPageSize, setAnsPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

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

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

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
      ...getColumnSearchProps('name'),
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
    // let data = {
    //   question: {
    //     name: 'Simulasi Guru',
    //     answer: 'ACBDADCBADCBADCBADCBADCAABCDAC',
    //     Results: [
    //       {
    //         id: '0d48cc0a-91c1-4277-b2fd-f07169521db7',
    //         result: null,
    //         answer: null,
    //         leave_count: null,
    //         Student: {
    //           full_name: 'Kharidatul Jannah, S.Pd.I',
    //           nisn: '28',
    //           nis: '28',
    //         },
    //       },
    //       {
    //         id: '0e82c5c4-ccba-44b2-8f33-14ac2ecc37de',
    //         result: null,
    //         answer: null,
    //         leave_count: null,
    //         Student: {
    //           full_name: 'Wa Fana, S.Pd.I',
    //           nisn: '57',
    //           nis: '57',
    //         },
    //       },
    //       {
    //         id: '10bda424-111e-4cab-9af5-1dee40611c31',
    //         result: null,
    //         answer: null,
    //         leave_count: null,
    //         Student: {
    //           full_name: 'Bambang Suprayitno, M.Pd.I',
    //           nisn: '9',
    //           nis: '9',
    //         },
    //       },
    //       {
    //         id: '22a21a2a-b8d8-4ee2-9c99-cbed86c382bc',
    //         result: null,
    //         answer: null,
    //         leave_count: null,
    //         Student: {
    //           full_name: 'Sarlin La Mara, S.S',
    //           nisn: '47',
    //           nis: '47',
    //         },
    //       },
    //       {
    //         id: '25cae504-8878-41ca-bf57-3e633a310eda',
    //         result: null,
    //         answer: null,
    //         leave_count: null,
    //         Student: {
    //           full_name: 'Harlia, S.Si',
    //           nisn: '19',
    //           nis: '19',
    //         },
    //       },
    //       {
    //         id: '26264091-6450-4f5b-a8ed-af6c89777f25',
    //         result: null,
    //         answer: null,
    //         leave_count: null,
    //         Student: {
    //           full_name: 'Wa Fana, S.Pd.I',
    //           nisn: '57',
    //           nis: '57',
    //         },
    //       },
    //       {
    //         id: '2a6e1369-30ea-4ff5-a61e-bf72beeea9f2',
    //         result: '0',
    //         answer: 'cbabaaaaaaaaaaaaaaaaaaaaaaaaaa',
    //         leave_count: '0',
    //         Student: {
    //           full_name: 'Mauludin Hamid, S.Pd',
    //           nisn: '34',
    //           nis: '34',
    //         },
    //       },
    //       {
    //         id: '2e6fdc72-7476-44fa-82f0-24cb03089ad2',
    //         result: '0',
    //         answer: 'caacaadadccbaacbcadbdccdabcbdc',
    //         leave_count: '3',
    //         Student: {
    //           full_name: 'Normawati, S.Pd',
    //           nisn: '38',
    //           nis: '38',
    //         },
    //       },
    //       {
    //         id: '36f04499-b077-457d-8b60-e22a369148ce',
    //         result: null,
    //         answer: null,
    //         leave_count: null,
    //         Student: {
    //           full_name: 'Wa Ode Mutma Ina, S.Pd',
    //           nisn: '60',
    //           nis: '60',
    //         },
    //       },
    //       {
    //         id: '3a223710-7c0b-435b-bb24-794677d45201',
    //         result: null,
    //         answer: null,
    //         leave_count: null,
    //         Student: {
    //           full_name: 'La Ode Darlin, S.Pd',
    //           nisn: '29',
    //           nis: '29',
    //         },
    //       },
    //       {
    //         id: '487b7b89-cf89-41c6-8c47-2f80e82295b0',
    //         result: null,
    //         answer: null,
    //         leave_count: null,
    //         Student: {
    //           full_name: 'Fajeri Ishak, S.Pd.I., M.Ed',
    //           nisn: '1',
    //           nis: '1',
    //         },
    //       },
    //       {
    //         id: '5127fd46-e8ad-41fc-bf19-4524b71240cf',
    //         result: '0',
    //         answer: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    //         leave_count: '0',
    //         Student: {
    //           full_name: 'Sitti Sahifah, S.Pd',
    //           nisn: '50',
    //           nis: '50',
    //         },
    //       },
    //       {
    //         id: '51399cc0-a741-480a-ad3e-6319e9b5a802',
    //         result: null,
    //         answer: null,
    //         leave_count: null,
    //         Student: {
    //           full_name: 'Thatit Arif Ramadana, SE',
    //           nisn: '54',
    //           nis: '54',
    //         },
    //       },
    //       {
    //         id: '51b4068c-e6fa-49bb-bcd3-9a72ff602459',
    //         result: null,
    //         answer: null,
    //         leave_count: null,
    //         Student: {
    //           full_name: 'Ahmad Ardiawan, S.Pd',
    //           nisn: '3',
    //           nis: '3',
    //         },
    //       },
    //       {
    //         id: '559b676d-5884-498f-9cb6-9b8ba6267ccd',
    //         result: null,
    //         answer: null,
    //         leave_count: null,
    //         Student: {
    //           full_name: 'Sabihi, S.Pd.I',
    //           nisn: '46',
    //           nis: '46',
    //         },
    //       },
    //       {
    //         id: '6066927d-5368-4440-816e-288b9227d050',
    //         result: null,
    //         answer: null,
    //         leave_count: null,
    //         Student: {
    //           full_name: 'Thatit Arif Ramadana, SE',
    //           nisn: '54',
    //           nis: '54',
    //         },
    //       },
    //       {
    //         id: '654e379f-5230-45bd-ae3f-426211818878',
    //         result: null,
    //         answer: null,
    //         leave_count: null,
    //         Student: {
    //           full_name: 'La Ode Muhamad Alibonto, S.Pd',
    //           nisn: '67',
    //           nis: '67',
    //         },
    //       },
    //       {
    //         id: '6ce5a6e0-2288-4026-88af-ade2b79702b9',
    //         result: '0',
    //         answer: 'cbaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    //         leave_count: '0',
    //         Student: {
    //           full_name: 'Mauludin Hamid, S.Pd',
    //           nisn: '34',
    //           nis: '34',
    //         },
    //       },
    //       {
    //         id: '6e96ce97-a836-47ba-971b-1706b811156d',
    //         result: '0',
    //         answer: 'cdacaadabdcbacaddacdbcbaddabca',
    //         leave_count: '3',
    //         Student: {
    //           full_name: 'Anistantia Putri Maulana, MH',
    //           nisn: '5',
    //           nis: '5',
    //         },
    //       },
    //       {
    //         id: '7221f8c0-de97-40e2-ae50-6a3cb5de08d3',
    //         result: null,
    //         answer: null,
    //         leave_count: null,
    //         Student: {
    //           full_name: 'Kartini Tahir, M.Pd',
    //           nisn: '26',
    //           nis: '26',
    //         },
    //       },
    //       {
    //         id: '759d6701-645b-444e-86d1-809269328b19',
    //         result: null,
    //         answer: null,
    //         leave_count: null,
    //         Student: {
    //           full_name: 'Sarniah, S.Pd',
    //           nisn: '48',
    //           nis: '48',
    //         },
    //       },
    //       {
    //         id: '7632f4ad-f49d-47c6-8318-969f881fa82d',
    //         result: '0',
    //         answer: 'cdacacaabdcbaaacbccacaaccaaaac',
    //         leave_count: '0',
    //         Student: {
    //           full_name: 'Sabihi, S.Pd.I',
    //           nisn: '46',
    //           nis: '46',
    //         },
    //       },
    //       {
    //         id: '7e4cadf8-3dd0-4634-9f19-1acf602d6503',
    //         result: null,
    //         answer: null,
    //         leave_count: null,
    //         Student: {
    //           full_name: 'Anita Bachmid, S.Pd',
    //           nisn: '6',
    //           nis: '6',
    //         },
    //       },
    //       {
    //         id: '880e81b9-9127-47a4-9a86-952a3a8f7798',
    //         result: '0',
    //         answer: 'ddacaacbbdcbacaddacdbcbaddabca',
    //         leave_count: '3',
    //         Student: {
    //           full_name: 'Irnawati, S.Si',
    //           nisn: '66',
    //           nis: '66',
    //         },
    //       },
    //       {
    //         id: '8c551e4d-a745-401e-bc1b-a3286a7b9a29',
    //         result: null,
    //         answer: null,
    //         leave_count: null,
    //         Student: {
    //           full_name: 'Tri Pratiwi Mukhtar',
    //           nisn: '55',
    //           nis: '55',
    //         },
    //       },
    //       {
    //         id: '8cbd2198-c425-46e7-b13d-fb7a6827f47b',
    //         result: '0',
    //         answer: 'cbcdcbccdbdbcdbcbbccbccdbccbcd',
    //         leave_count: '0',
    //         Student: {
    //           full_name: 'Basri, S. Mat',
    //           nisn: '10',
    //           nis: '10',
    //         },
    //       },
    //       {
    //         id: '956f6252-1e7d-4cf2-b8c0-ca34849cb0e9',
    //         result: '0',
    //         answer: 'cdacaadabdcbacaddacdbcdaddabca',
    //         leave_count: '3',
    //         Student: {
    //           full_name: 'Sitti Zafirah Tilsaf, S.Ag',
    //           nisn: '51',
    //           nis: '51',
    //         },
    //       },
    //       {
    //         id: '9b62571d-45c5-423a-9683-c10d348e9623',
    //         result: null,
    //         answer: null,
    //         leave_count: null,
    //         Student: {
    //           full_name: 'Sitti Sahifah, S.Pd',
    //           nisn: '50',
    //           nis: '50',
    //         },
    //       },
    //       {
    //         id: '9b932c66-3d95-4b5e-b4f3-c44e3ed577cd',
    //         result: '0',
    //         answer: 'aaaaaaaaaabbbbbcccccdddddddddd',
    //         leave_count: '3',
    //         Student: {
    //           full_name: 'Hamdil Qaswa Fahrudi, S.Pd',
    //           nisn: '18',
    //           nis: '18',
    //         },
    //       },
    //       {
    //         id: '9cbc24d4-2738-4320-b5aa-a993732e93d3',
    //         result: '0',
    //         answer: 'cdacaadbdbcadacdcbdbdcbabcdcbc',
    //         leave_count: '0',
    //         Student: {
    //           full_name: 'Roslinda Alwi, S.Pd.I',
    //           nisn: '45',
    //           nis: '45',
    //         },
    //       },
    //       {
    //         id: '9fa70ef9-1b91-405b-970a-c6ce041a4449',
    //         result: '0',
    //         answer: 'cdabcccbcbcbccdcdcabadcaddcdbd',
    //         leave_count: '2',
    //         Student: {
    //           full_name: 'Hajrullah, S.Pd',
    //           nisn: '17',
    //           nis: '17',
    //         },
    //       },
    //       {
    //         id: 'a0dc05ff-6c07-468a-b50b-68be8511b463',
    //         result: '0',
    //         answer: 'cdbcbcabdcbacadbcdcadaccbbdbac',
    //         leave_count: '5',
    //         Student: {
    //           full_name: 'Wa Ode Maryam Yunita R, S.Psi',
    //           nisn: '59',
    //           nis: '59',
    //         },
    //       },
    //       {
    //         id: 'a333a1ad-3a10-4260-bed7-4738ae6f1963',
    //         result: null,
    //         answer: null,
    //         leave_count: null,
    //         Student: {
    //           full_name: 'Sri Wahyuni. MS, S.Pd',
    //           nisn: '53',
    //           nis: '53',
    //         },
    //       },
    //       {
    //         id: 'a45b93fd-0085-4137-9ae3-48bf8750bc7f',
    //         result: '0',
    //         answer: 'aaaaaaabbabbaaaaaaaaaaaaaaaaaa',
    //         leave_count: '3',
    //         Student: {
    //           full_name: 'Fajeri Ishak, S.Pd.I., M.Ed',
    //           nisn: '1',
    //           nis: '1',
    //         },
    //       },
    //       {
    //         id: 'ac88fe47-10da-4f93-8aff-56194563df26',
    //         result: null,
    //         answer: null,
    //         leave_count: null,
    //         Student: {
    //           full_name: 'La Ode Muhamad Alibonto, S.Pd',
    //           nisn: '67',
    //           nis: '67',
    //         },
    //       },
    //       {
    //         id: 'b23a9584-b81b-406a-b453-aeb9540589a8',
    //         result: null,
    //         answer: null,
    //         leave_count: null,
    //         Student: {
    //           full_name: 'Sharli Anitawati,S.Pd.I',
    //           nisn: '49',
    //           nis: '49',
    //         },
    //       },
    //       {
    //         id: 'b7cd1602-45e0-459d-87cb-1b462ca6ecdb',
    //         result: null,
    //         answer: null,
    //         leave_count: null,
    //         Student: {
    //           full_name: 'Irnawati, S.Si',
    //           nisn: '66',
    //           nis: '66',
    //         },
    //       },
    //       {
    //         id: 'b7ed5778-9be3-4276-afe8-d6cd037ec6ec',
    //         result: '0',
    //         answer: 'bccccccccccccccccccccccccccccc',
    //         leave_count: '3',
    //         Student: {
    //           full_name: 'Nasrudin Gito, S.Pd',
    //           nisn: '37',
    //           nis: '37',
    //         },
    //       },
    //       {
    //         id: 'be3cffdb-f923-416f-8e3a-3fb649254ad8',
    //         result: null,
    //         answer: null,
    //         leave_count: null,
    //         Student: {
    //           full_name: 'Nur Laela Wahyuni Ali Rasyid, S.S',
    //           nisn: '41',
    //           nis: '41',
    //         },
    //       },
    //       {
    //         id: 'c102848d-5baa-4ac9-a139-0d56239372c3',
    //         result: '0',
    //         answer: 'caaabaabbaaaaaaaabbbbbbbbbbbaa',
    //         leave_count: '3',
    //         Student: {
    //           full_name: 'Rilarti, S.Sos',
    //           nisn: '63',
    //           nis: '63',
    //         },
    //       },
    //       {
    //         id: 'c1709a19-d438-4c0b-a28d-46e984d138d2',
    //         result: null,
    //         answer: null,
    //         leave_count: null,
    //         Student: {
    //           full_name: 'Darmawati,S.Pd',
    //           nisn: '12',
    //           nis: '12',
    //         },
    //       },
    //       {
    //         id: 'c25cc340-9e74-4da9-91ad-5aa91119bdfa',
    //         result: '0',
    //         answer: 'cdacacdbddcbacaddbddaaaaaaabca',
    //         leave_count: '0',
    //         Student: {
    //           full_name: 'Darmawati,S.Pd',
    //           nisn: '12',
    //           nis: '12',
    //         },
    //       },
    //       {
    //         id: 'c6b2e231-e74d-4822-9709-690a9ef31ccd',
    //         result: '0',
    //         answer: 'cdacabdbbdcbacaddacdbcbaddabca',
    //         leave_count: '3',
    //         Student: {
    //           full_name: 'Hamira Dwi Putri, S.S',
    //           nisn: '65',
    //           nis: '65',
    //         },
    //       },
    //       {
    //         id: 'd41e757a-8186-4e32-94db-e3922f712efc',
    //         result: null,
    //         answer: null,
    //         leave_count: null,
    //         Student: {
    //           full_name: 'Wa Ode Maryam Yunita R, S.Psi',
    //           nisn: '59',
    //           nis: '59',
    //         },
    //       },
    //       {
    //         id: 'd46c1ef9-b024-4be0-907e-4256b7ec5cfe',
    //         result: null,
    //         answer: null,
    //         leave_count: null,
    //         Student: {
    //           full_name: 'Hamira Dwi Putri, S.S',
    //           nisn: '65',
    //           nis: '65',
    //         },
    //       },
    //       {
    //         id: 'e1c96a42-5f76-4427-8f4f-4cd9b9a4dbb6',
    //         result: null,
    //         answer: null,
    //         leave_count: null,
    //         Student: {
    //           full_name: 'Sharli Anitawati,S.Pd.I',
    //           nisn: '49',
    //           nis: '49',
    //         },
    //       },
    //       {
    //         id: 'e5d65d31-054c-4ce5-a8d1-df1924482002',
    //         result: null,
    //         answer: null,
    //         leave_count: null,
    //         Student: {
    //           full_name: 'Nur Laela Wahyuni Ali Rasyid, S.S',
    //           nisn: '41',
    //           nis: '41',
    //         },
    //       },
    //       {
    //         id: 'e891bb89-a384-4b2a-84b1-4fe67abcc574',
    //         result: '0',
    //         answer: 'cdacbcdabdcbacacdacdbcbaddabca',
    //         leave_count: '0',
    //         Student: {
    //           full_name: 'Latipa Rupiantini, M.Pd.I',
    //           nisn: '31',
    //           nis: '31',
    //         },
    //       },
    //       {
    //         id: 'f309ea68-d139-42f5-be0f-0458a1608cb3',
    //         result: null,
    //         answer: null,
    //         leave_count: null,
    //         Student: {
    //           full_name: 'Helvy Nurlela',
    //           nisn: '72',
    //           nis: '72',
    //         },
    //       },
    //       {
    //         id: 'ffc42b14-b34e-42aa-86f5-2591d04d166a',
    //         result: '0',
    //         answer: 'cdacaadaddcbacabdacdbcbaadabba',
    //         leave_count: '0',
    //         Student: {
    //           full_name: 'Juliawanti Abu Yasid, S.Pd',
    //           nisn: '25',
    //           nis: '25',
    //         },
    //       },
    //       {
    //         id: 'ffeefd42-4314-4d61-98d3-67080fc90e7a',
    //         result: null,
    //         answer: null,
    //         leave_count: null,
    //         Student: {
    //           full_name: 'Hamdil Qaswa Fahrudi, S.Pd',
    //           nisn: '18',
    //           nis: '18',
    //         },
    //       },
    //     ],
    //   },
    // };
    const { data } = await dispatch(getOneQuestion(id));
    setTotalAnswer(data?.question?.Results?.length ?? 10);
    const newData = data?.question?.Results?.map((el, i) => {
      let ansArr = [];
      const studentAnswer = el.answer;
      const keyAnswer = data?.question?.answer;
      for (let i = 0; i < studentAnswer?.length; i++) {
        if (studentAnswer[i]?.toLowerCase() === keyAnswer[i]?.toLowerCase()) {
          ansArr.push(
            <Tag color="green">
              {i + 1}:{' '}
              <Typography.Text strong style={{ fontSize: 12, color: 'green' }}>
                {studentAnswer[i].toUpperCase()}
              </Typography.Text>
            </Tag>
          );
        } else {
          ansArr.push(
            <Tag color="red">
              {i + 1}:{' '}
              <Typography.Text strong style={{ fontSize: 12, color: 'red' }}>
                {studentAnswer[i].toUpperCase()}
              </Typography.Text>
            </Tag>
          );
        }
      }
      return {
        key: i,
        nis: el.Student.nis,
        nisn: el.Student.nisn,
        name: el.Student.full_name,
        result: parseFloat(el.result).toFixed(2),
        answer: (
          <div className={styles.wrapText}>
            <Row gutter={[1, 1]} justify="space-between">
              {data?.question?.answer?.split('').map((el, i) => (
                <Col>
                  <Tag>
                    {i + 1}:{' '}
                    <Typography.Text strong style={{ fontSize: 12 }}>
                      {el.toUpperCase()}
                    </Typography.Text>
                  </Tag>
                </Col>
              ))}
            </Row>
          </div>
        ),
        answerAnalysis: (
          <div className={styles.ansWrap}>
            <Row gutter={[1, 1]} justify="space-between">
              {ansArr.map((el, i) => (
                <Col>
                  <React.Fragment key={i}>{el}</React.Fragment>
                </Col>
              ))}
            </Row>
          </div>
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
        title="Daftar Jawaban Siswa"
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
        <CustomTable
          onChange={(e) => {
            const { pageSize } = e;
            setAnsPageSize(pageSize);
          }}
          pageSize={ansPageSize}
          total={totalAnswer}
          data={resultData}
          columns={resultColumns}
        />
      </Modal>
    </>
  );
}
