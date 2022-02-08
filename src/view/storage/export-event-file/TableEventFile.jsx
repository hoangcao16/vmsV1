import { Input, Popconfirm, Select, Table, Tooltip } from "antd";
import React, { useState } from "react";
import { FiBookmark, FiFilm, FiImage } from "react-icons/fi";
import moment from "moment";
import {
  filterOption,
  normalizeOptions,
} from "../../common/select/CustomSelect";
import { findIndex } from "lodash-es";
import { RiDeleteBinLine } from "react-icons/ri";
import { AiOutlineCheck, AiOutlineClose, AiOutlineEdit } from "react-icons/all";
import _ from "lodash";
import { useTranslation } from "react-i18next";

const TableEventFile = (props) => {
  const { t } = useTranslation();
  let eventList = props.eventList || [];
  let dataList = props.dataList || [];
  const [selectedRowUuid, setSelectedRowUuid] = useState("");

  const saveEventFileHandler = (uuid) => {
    const index = findIndex(dataList, (item) => item.uuid === uuid);
    if (index !== -1) {
      props.onSaveEventFile(dataList[index], dataList);
    }
  };

  const editEventFileHandler = (uuid, isImportant) => {
    let newDataList = [...dataList];
    const index = findIndex(newDataList, (item) => item.uuid === uuid);
    if (index !== -1) {
      newDataList[index] = Object.assign({
        ...newDataList[index],
        isImportant: isImportant,
        editMode: false,
      });
      props.onEditEventFile(newDataList[index], newDataList);
    }
  };

  const deleteEventFileHandler = (uuid) => {
    props.onDeleteEventFile(uuid);
  };

  const changeEditModeHandler = (uuid, editMode) => {
    let newDataList = [...dataList];
    const index = findIndex(newDataList, (item) => item.uuid === uuid);
    if (index !== -1) {
      newDataList[index] = Object.assign({
        ...newDataList[index],
        editMode: editMode,
      });
      props.onChangeEditModeHandler(newDataList);
    }
  };

  const renderAction = (row) => {
    if (row.isSaved && !row.editMode)
      return (
        <div className="actionEventFile">
          <AiOutlineEdit
            className="icon"
            onClick={() => changeEditModeHandler(row?.uuid, true)}
          />
          {!row.isImportant && (
            <FiBookmark
              className="icon"
              onClick={() => editEventFileHandler(row?.uuid, true)}
            />
          )}
          {row.isImportant && (
            <FiBookmark
              className="icon-active"
              onClick={() => editEventFileHandler(row?.uuid, false)}
            />
          )}
          <Popconfirm
            cancelText={t("view.user.detail_list.cancel")}
            okText={t("view.user.detail_list.confirm")}
            title={t("noti.delete_file", { this: t("this") })}
            onConfirm={() => {
              deleteEventFileHandler(row?.uuid);
            }}
          >
            <RiDeleteBinLine className="icon" />
          </Popconfirm>
        </div>
      );
    return (
      <div className="actionEventFile">
        {row.isSaved && (
          <AiOutlineCheck
            className="icon"
            onClick={() => editEventFileHandler(row?.uuid, row?.isImportant)}
          />
        )}
        {row.isSaved && (
          <AiOutlineClose
            className="icon"
            onClick={() => changeEditModeHandler(row?.uuid, false)}
          />
        )}
        {!row.isSaved && (
          <AiOutlineCheck
            className="icon"
            onClick={() => saveEventFileHandler(row?.uuid)}
          />
        )}
        {!row.isSaved && (
          <AiOutlineClose
            className="icon"
            onClick={() => deleteEventFileHandler(row?.uuid)}
          />
        )}
      </div>
    );
  };

  const renderViolationTime = (value) => {
    return moment(value * 1000).format("HH:mm DD/MM/YYYY");
  };

  const renderCreatedTime = (value) => {
    return moment(value).format("HH:mm DD/MM/YYYY");
  };

  const renderName = (value) => {
    return (
      <Tooltip title={value}>
        <span>{value}</span>
      </Tooltip>
    );
  };

  const renderType = (value) => {
    return !value || value === 0 ? (
      <FiFilm className="iconType" />
    ) : (
      <FiImage className="iconType" />
    );
  };

  const onChangeEventHandler = (uuid, row) => {
    const event = eventList.filter((e) => e.uuid === uuid);
    if (event && event.length > 0) {
      const index = findIndex(dataList, (item) => item.uuid === row.uuid);
      if (index !== -1) {
        dataList[index] = Object.assign({
          ...dataList[index],
          eventUuid: uuid,
          eventName: event[0].name,
        });
      }
    }
  };

  const renderEvent = (row) => {
    const defaultVal = row.eventUuid === "" ? null : row.eventUuid;
    if (row.isSaved && !row.editMode)
      return (
        <Tooltip title={row.eventName}>
          <span>{row.eventName}</span>
        </Tooltip>
      );
    return (
      <Select
        allowClear
        showSearch
        onChange={(uuid) => onChangeEventHandler(uuid, row)}
        filterOption={filterOption}
        options={normalizeOptions("name", "uuid", eventList)}
        placeholder={t("view.category.event_type")}
        defaultValue={defaultVal}
      />
    );
  };

  const onChangeNoteHandler = (event, row) => {
    const index = findIndex(dataList, (item) => item.uuid === row.uuid);
    if (index !== -1) {
      dataList[index] = Object.assign({
        ...dataList[index],
        note: event.target.value,
      });
    }
  };

  const renderNote = (row) => {
    if (row.isSaved && !row.editMode)
      return (
        <Tooltip title={row.note}>
          <span>{row.note}</span>
        </Tooltip>
      );
    return (
      <Input
        defaultValue={row.note}
        placeholder={t("view.storage.note")}
        onChange={(event) => onChangeNoteHandler(event, row)}
      />
    );
  };

  const renderLength = (value) => {
    return new Date(+value * 1000).toISOString().substr(11, 8);
  };

  const eventFileColumns = [
    {
      title: `${t("view.storage.event")}`,
      dataIndex: "",
      key: "event",
      width: 150,
      editable: true,
      render: renderEvent,
    },
    {
      title: `${t("view.storage.violation_time")}`,
      dataIndex: "violationTime",
      key: "violationTime",
      width: 150,
      render: renderViolationTime,
    },
    {
      title: `${t("view.storage.created_time")}`,
      dataIndex: "createdTime",
      key: "createdTime",
      width: 150,
      render: renderCreatedTime,
    },
    {
      title: `${t("view.storage.file_name")}`,
      dataIndex: "name",
      key: "name",
      width: 200,
      render: renderName,
    },
    {
      title: `${t("view.storage.note")}`,
      dataIndex: "",
      key: "note",
      width: 150,
      render: renderNote,
    },
    {
      title: `${t("view.storage.camera_name", { cam: t("camera") })}`,
      dataIndex: "cameraName",
      key: "cameraName",
      width: 200,
    },
    {
      title: `${t("view.storage.type")}`,
      dataIndex: "type",
      key: "type",
      width: 70,
      render: renderType,
    },
    {
      title: `${t("view.storage.length")}`,
      dataIndex: "length",
      key: "length",
      width: 100,
      render: renderLength,
    },
    {
      title: `${t("view.storage.address")}`,
      dataIndex: "address",
      key: "address",
      width: 400,
    },
    {
      title: `${t("view.storage.action")}`,
      dataIndex: "",
      key: "action",
      fixed: "right",
      width: 100,
      render: renderAction,
    },
  ];

  const onRowHandler = (record, index) => {
    return {
      onClick: (event) => {}, // click row
      onDoubleClick: (event) => {
        setSelectedRowUuid(record.uuid);
        props.onClickRow(record, dataList);
      }, // double click row
      onContextMenu: (event) => {}, // right button click row
      onMouseEnter: (event) => {}, // mouse enter row
      onMouseLeave: (event) => {}, // mouse leave row
    };
  };

  return (
    <>
      <Table
        className="table__list--file tableEventFile"
        rowClassName={(record, index) => {
          if (record.uuid === selectedRowUuid) return "selected";
          return "not-selected";
        }}
        onRow={onRowHandler}
        rowKey="uuid"
        columns={eventFileColumns}
        scroll={{ x: 600, y: 280 }}
        dataSource={dataList}
        pagination={false}
      />
    </>
  );
};

function tableEventFilePropsAreEqual(prevTblEventFile, nextTblEventFile) {
  return _.isEqual(prevTblEventFile.dataList, nextTblEventFile.dataList);
}

export const MemoizedTableEventFile = React.memo(
  TableEventFile,
  tableEventFilePropsAreEqual
);
