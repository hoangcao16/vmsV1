import React, { useState, useRef, useContext, useEffect } from "react";
import { Table, Form, Input } from "antd";
import { TableDetails } from "./style";
import _ from "lodash";
import moment from "moment";
import AIEventsApi from "../../../../actions/api/ai-events/AIEventsApi";
import Notification from "../../../../components/vms/notification/Notification";
import { useTranslation } from "react-i18next";

const EditableContext = React.createContext(null);
const { TextArea } = Input;
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = (e) => {
    e.stopPropagation();
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async (e) => {
    try {
      const values = await form.validateFields();
      toggleEdit(e);
      if (values[dataIndex] !== record[dataIndex]) {
        handleSave({ ...record, ...values });
      }
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
          //   {
          //     required: true,
          //     message: `${title} is required.`,
          //   },
          { max: 255, message: t("view.map.max_length_255") },
        ]}
        onClick={(e) => e.stopPropagation()}
      >
        <TextArea
          autoSize={true}
          maxLength={255}
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
const TableDetailList = (props) => {
  const [dataSource, setDataSource] = useState([]);
  let tracingList = props.tracingList || [];
  let detailAI = props.detailAI || {};
  const { editNoteUpdate } = props;
  const { t } = useTranslation();
  const datacolumns = [
    {
      title: t("view.penalty_ticket.violation_datetime"),
      dataIndex: "createdTime",
      key: "createdTime",
      render: (text) => <span>{moment(text).format("HH:mm DD/MM/YYYY")}</span>,
    },
    {
      title: t("view.live.camera_record"),
      dataIndex: "cameraName",
      key: "cameraName",
    },
    {
      title: t("view.penalty_ticket.violation_type"),
      dataIndex: "eventName",
      key: "eventName",
    },
    {
      title: t("view.map.address"),
      dataIndex: "address",
      key: "address",
    },
    {
      title: t("view.common_device.note"),
      dataIndex: "note",
      key: "note",
      editable: true,
      width: "30%",
    },
  ];
  useEffect(() => {
    setDataSource(tracingList);
  }, [tracingList]);

  // Edit note
  const handleSave = async (row) => {
    const data = {
      cameraUuid: row.cameraUuid,
      uuid: row.uuid,
      note: row?.note?.trim(),
    };
    try {
      const isEdit = await AIEventsApi.editInforOfEvent(row.uuid, data);

      if (isEdit) {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.uuid === item.uuid);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row, note: row?.note?.trim() });
        setDataSource(newData);
        const notifyMess = {
          type: "success",
          title: "",
          description: `${t("noti.successfully_edit_note")}`,
        };
        Notification(notifyMess);
        editNoteUpdate(row);
      } else {
        const notifyMess = {
          type: "error",
          title: "",
          description: `${t("noti.error_edit")}`,
        };
        Notification(notifyMess);
      }
    } catch (error) {
      // message.warning(
      //   'Đã xảy ra lỗi trong quá trình chỉnh sửa, hãy kiểm tra lại'
      // );
      console.log(error);
    }
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
  const onClickRowSelect = (record) => {
    if (props) {
      props.onClickRow(record);
    }
  };
  return (
    <TableDetails>
      <Table
        components={{
          body: {
            cell: EditableCell,
            row: EditableRow,
          },
        }}
        rowClassName={(record, index) => {
          if (record.uuid === detailAI.uuid) return "editable-row selected";
          return "editable-row not-selected";
        }}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              onClickRowSelect(record);
            },
          };
        }}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        rowKey="uuid"
      />
    </TableDetails>
  );
};
function tableDetailListPropsAreEqual(prevTblDetailList, nextTblDetailList) {
  return (
    _.isEqual(prevTblDetailList.tracingList, nextTblDetailList.tracingList) &&
    _.isEqual(prevTblDetailList.detailAI, nextTblDetailList.detailAI)
  );
}
export default TableDetailList;
export const MemoizedTableDetailList = React.memo(
  TableDetailList,
  tableDetailListPropsAreEqual
);
