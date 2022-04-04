import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import { AutoComplete, Card, Space, Table, Tag, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import CamproxyApi from "../../../actions/api/camproxy/CamproxyApi";
import "./../../commonStyle/commonTable.scss";
import "./../../commonStyle/commontextArea.scss";
import ModalEditCamproxy from "./ModalEditCamproxy";
import { bodyStyleCard, headStyleCard } from "./variables";
import { useTranslation } from "react-i18next";

const TableCamproxy = () => {
  const { t } = useTranslation();
  const [selectedCamproxyIdEdit, setSelectedCamproxyIdEdit] = useState(null);
  const [listCamproxy, setListCamproxy] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(50);

  const [val, setVal] = useState("");

  useEffect(() => {
    const data = {
      size: size,
      page: page,
      name: "",
    };
    if (!selectedCamproxyIdEdit) {
      CamproxyApi.getAllCamproxy(data).then(setListCamproxy);
    }
  }, [selectedCamproxyIdEdit, size, page]);

  const handleShowModalEdit = () => {
    setSelectedCamproxyIdEdit(null);
  };

  const renderTag = (cellValue) => {
    return cellValue === "UP" ? (
      <Tag color={"#1380FF"} style={{ color: "#ffffff" }}>
        {t("view.camera.active")}
      </Tag>
    ) : (
      <Tag color={"#FF4646"} style={{ color: "#ffffff" }}>
        {t("view.camera.inactive")}
      </Tag>
    );
  };

  const CamproxyColumns = [
    {
      title: `${t("view.category.no")}`,
      key: "index",
      width: "5%",
      render: (text, record, index) => index + 1,
    },
    {
      title: `${t("view.common_device.camproxy_name")}`,
      dataIndex: "name",
      key: "name",
      width: "20%",
    },

    {
      title: `${t("view.common_device.desc")}`,
      dataIndex: "description",
      width: "20%",
      key: "description",
    },

    {
      title: `${t("view.common_device.note")}`,
      dataIndex: "note",
      width: "20%",
      key: "note",
    },

    {
      title: `${t("view.common_device.status")}`,
      dataIndex: "status",
      key: "status",
      width: "20%",
      render: renderTag,
    },

    {
      title: `${t("view.common_device.action")}`,
      // width: '20%',
      render: (text, record) => {
        return (
          <Space>
            <Tooltip placement="rightTop" title={t("view.common_device.edit")}>
              <EditOutlined
                style={{ fontSize: "16px", color: "#6E6B7B" }}
                onClick={() => {
                  setSelectedCamproxyIdEdit(record.uuid);
                }}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];
  const handleSearch = async (value) => {
    setVal(value);
    const data = {
      name: value.trim(),
      page: page,
      size: size,
    };
    const dataCampoxySearch = await CamproxyApi.getAllCamproxy(data);
    setListCamproxy(dataCampoxySearch);
  };

  const handleBlur = async (event) => {
    const value = event.target.value.trim();
    setVal(value);
  };

  const handlePaste = async (event) => {
    const value = event.target.value.trimStart();
    setVal(value);
  };

  return (
    <div className="tabs__container--device">
      <div className="search mt-2">
        <AutoComplete
          maxLength={255}
          className=" full-width height-40"
          onSearch={handleSearch}
          onBlur={handleBlur}
          onPaste={handlePaste}
          value={val}
          placeholder={
            <div className="placehoder height-40 justify-content-between d-flex align-items-center">
              <span>
                {" "}
                &nbsp;{" "}
                {t("view.common_device.please_enter_camproxy_name", {
                  plsEnter: t("please_enter"),
                })}{" "}
              </span>{" "}
              <SearchOutlined style={{ fontSize: 22, pointer: "cussor" }} />
            </div>
          }
        />
      </div>
      <Card
        title={t("view.common_device.camproxy_list")}
        // extra={
        //   <Button>dsdsdsds
        //     <PlusOneOutlined />
        //   </Button>
        // }
        bodyStyle={bodyStyleCard}
        headStyle={headStyleCard}
        className="card--listDevice"
      >
        <Table
          scroll={{ y: 300 }}
          pagination={false}
          rowKey="id"
          columns={CamproxyColumns}
          dataSource={listCamproxy}
          locale={{
            emptyText: `${t("view.user.detail_list.no_valid_results_found")}`,
          }}
        />
      </Card>

      {selectedCamproxyIdEdit && (
        <ModalEditCamproxy
          selectedCamproxyIdEdit={selectedCamproxyIdEdit}
          handleShowModalEdit={handleShowModalEdit}
        />
      )}
    </div>
  );
};

export default withRouter(TableCamproxy);
