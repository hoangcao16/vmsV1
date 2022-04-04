import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import { AutoComplete, Card, Space, Table, Tag, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import NVRApi from "../../../actions/api/nvr/NVRApi";
import Loading from "../../Loading";
import "./../../commonStyle/commonTable.scss";
import "./../../commonStyle/commontextArea.scss";
import ModalEditNVR from "./ModalEditNVR";
import "./styleNVR.scss";
import { bodyStyleCard, headStyleCard } from "./variables";

const TableNVR = () => {
  const { t } = useTranslation();
  const [selectedNVRIdEdit, setSelectedNVRIdEdit] = useState(null);
  const [listNVR, setListNVR] = useState([]);
  const [loading, setLoading] = useState(false);
  const [size] = useState(50);
  const [val, setVal] = useState("");
  const page = 0;

  const language = reactLocalStorage.get("language");

  useEffect(() => {
    if (
      language == "vn"
        ? (document.title = "CCTV | Modules hệ thống")
        : (document.title = "CCTV | Modules System")
    );
  }, [t]);

  useEffect(() => {
    setLoading(true);
    const data = {
      name: "",
      page: page,
      size: size,
    };
    if (!selectedNVRIdEdit) {
      NVRApi.getAllNVR(data).then(setListNVR).finally(setLoading(false));
    }
    setLoading(false);
  }, [selectedNVRIdEdit, page, size]);

  const handleShowModalEdit = () => {
    setSelectedNVRIdEdit(null);
  };

  const handleSearch = async (value) => {
    setVal(value);
    const data = {
      name: value.replace(/[#&]/g, ""),
      page: page,
      size: size,
    };
    const dataNVRSearch = await NVRApi.getAllNVR(data);
    setListNVR(dataNVRSearch);
  };

  const handleBlur = async (event) => {
    const value = event.target.value.trim();
    setVal(value);
  };

  const handlePaste = async (event) => {
    const value = event.target.value.trimStart();
    setVal(value);
  };

  const renderTag = (cellValue) => {
    return (
      <Tag
        color={cellValue === "UP" ? "#1380FF" : "#FF4646"}
        style={{ color: "#ffffff" }}
      >
        {cellValue === "UP"
          ? `${t("view.camera.active")}`
          : `${t("view.camera.inactive")}`}
      </Tag>
    );
  };

  const NVRColumns = [
    {
      title: `${t("view.category.no")}`,
      key: "index",
      className: "headerColums",
      width: "5%",
      render: (text, record, index) => index + 1,
    },
    {
      title: `${t("view.common_device.nvr_name")}`,
      dataIndex: "name",
      key: "name",
      width: "20%",
      className: "headerColums",
    },

    {
      title: `${t("view.common_device.desc")}`,
      dataIndex: "description",
      className: "headerColums",
      width: "20%",
      key: "description",
    },

    {
      title: `${t("view.common_device.note")}`,
      dataIndex: "note",
      key: "note",
      width: "20%",
      className: "headerColums",
    },

    {
      title: `${t("view.common_device.status")}`,
      dataIndex: "status",
      key: "status",
      width: "20%",
      className: "headerColums",
      render: renderTag,
    },

    {
      title: `${t("view.common_device.action")}`,
      className: "headerColums",
      width: "15%",
      render: (text, record) => {
        return (
          <Space>
            <Tooltip placement="rightTop" title={t("view.common_device.edit")}>
              <EditOutlined
                style={{ fontSize: "16px", color: "#6E6B7B" }}
                onClick={() => {
                  setSelectedNVRIdEdit(record.uuid);
                }}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="tabs__container--device">
      <div className="search mt-2">
        <AutoComplete
          maxLength={255}
          className=" full-width height-40"
          value={val}
          onSearch={handleSearch}
          onBlur={handleBlur}
          onPaste={handlePaste}
          placeholder={
            <div className="placehoder height-40 justify-content-between d-flex align-items-center">
              <span>
                {" "}
                &nbsp;{" "}
                {t("view.common_device.please_enter_nvr_name", {
                  plsEnter: t("please_enter"),
                })}{" "}
              </span>{" "}
              <SearchOutlined style={{ fontSize: 22, pointer: "cussor" }} />
            </div>
          }
        />
      </div>
      <Card
        title={t("view.common_device.nvr_list")}
        bodyStyle={bodyStyleCard}
        headStyle={headStyleCard}
        className="card--listDevice"
      >
        <Table
          scroll={{ y: 300 }}
          pagination={false}
          rowKey="id"
          columns={NVRColumns}
          dataSource={listNVR}
          locale={{
            emptyText: `${t("view.user.detail_list.no_valid_results_found")}`,
          }}
        />
      </Card>

      {selectedNVRIdEdit && (
        <ModalEditNVR
          selectedNVRIdEdit={selectedNVRIdEdit}
          handleShowModalEdit={handleShowModalEdit}
        />
      )}
      {loading ? <Loading /> : null}
    </div>
  );
};

export default withRouter(TableNVR);
