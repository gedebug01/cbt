import React from 'react';
import { Table } from 'antd';

export const CustomTable = ({ columns, data, pageSize, total, onChange }) => {
  const pagination = {
    pageSize: pageSize ?? 10,
    total: total ?? 10,
  };

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={pagination}
      onChange={onChange}
    />
  );
};
