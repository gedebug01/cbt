import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import { read, utils } from 'xlsx';

const { Dragger } = Upload;

export const DragDrop = ({ onDragDrop }) => {
  const handleFileUpload = ({ file }) => {
    const { status } = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      const workbook = read(e.target.result, { type: 'binary' });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const data = utils.sheet_to_json(worksheet, { header: 1 });

      const result = data.slice(1).map((row) =>
        row.reduce((obj, value, index) => {
          obj[data[0][index]] = value;
          return obj;
        }, {})
      );

      if (status === 'done') {
        onDragDrop(result);
      }
    };

    reader.readAsBinaryString(file.originFileObj);
  };

  return (
    <>
      <Dragger
        onChange={(e) => handleFileUpload(e)}
        showUploadList={true}
        multiple={false}
        accept=".xlsx"
        maxCount={1}
        beforeUpload={false}
        // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click atau drag file ke area ini untuk mengupload
        </p>
        <p className="ant-upload-hint">
          Drag dan Drop hanya satu file dengan extention .xlsx
        </p>
      </Dragger>
    </>
  );
};
