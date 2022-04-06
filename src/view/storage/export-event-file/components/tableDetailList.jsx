import React, { useState, useRef, useContext, useEffect } from "react";
import { Table, Form, Input } from "antd";
import { TableDetails } from "./style";
import _ from "lodash";
const EditableContext = React.createContext(null);

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input
          ref={inputRef}
          onPressEnter={save}
          onBlur={save}
          className="edit-note"
        />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        // style={{
        //   paddingRight: 24,
        // }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const TableDetailList = () => {
  const datacolumns = [
    {
      title: "Ngày giờ ghi nhận",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Camera ghi nhận",
      dataIndex: "camera",
      key: "camera",
    },
    {
      title: "Loại vi phạm",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Địa điểm",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      editable: true,
    },
  ];
  const dataSource = [
    {
      key: "1",
      time: "10/10/2020",
      camera: "edsolabs10",
      type: "Vuot qua gioi han",
      address: "Hà Nội",
      note: "Không vượt quá giới hạn",
    },
    {
      key: "2",
      time: "10/10/2020",
      camera: "edsolabs10",
      type: "Vuot qua gioi han",
      address: "Hà Nội",
      note: "Không vượt quá giới hạn",
    },
  ];
  const handleSave = (row) => {
    console.log(row);
  };
  const columns = datacolumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    };
  });
  return (
    <TableDetails>
      <Table
        components={{
          body: {
            cell: EditableCell,
            row: EditableRow,
          },
        }}
        rowClassName={() => "editable-row"}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        rowKey="key"
      />
    </TableDetails>
  );
};
function tableDetailListPropsAreEqual(prevTblDetailList, nextTblDetailList) {
  return _.isEqual(prevTblDetailList.dataList, nextTblDetailList.dataList);
}
export default TableDetailList;
export const MemoizedTableDetailList = React.memo(
  TableDetailList,
  tableDetailListPropsAreEqual
);
