import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  Card,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Tooltip
} from "antd";
import "antd/dist/antd.css";
import { isEmpty } from "lodash-es";
import debounce from "lodash/debounce";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import CameraApi from "../../actions/api/camera/CameraApi";
import VendorApi from "../../actions/api/vendor/VendorApi";
import FieldApi from "../../actions/api/field/FieldApi";
import EventApi from "../../actions/api/event/EventApi";

import Notification from "../../components/vms/notification/Notification";
import "./../commonStyle/commonInput.scss";
import "./../commonStyle/commonSelect.scss";
import "./../commonStyle/commonTable.scss";
import ModalEditHumans from "./ModalEditHumans";
import "./TableHumans.scss";
import { bodyStyleCard, headStyleCard } from "./variables";
import { useTranslation } from "react-i18next";
import { reactLocalStorage } from "reactjs-localstorage";
import Breadcrumds from "../breadcrumds/Breadcrumds";
import { ShowTotal } from "../../styled/showTotal";
import AIHumansApi from "../../actions/api/ai-humans/AIHumansApi";

export const CATEGORY_NAME = {
  EVENT_TYPE: "EVENT_TYPE",
  VENDOR: "VENDOR",
  CAMERA_TYPE: "CAMERA_TYPE",
  AD_DIVISIONS: "AD_DIVISIONS",
  FIELD: "FIELD",
};

const { Option } = Select;
const TableHumans = () => {
  const { t } = useTranslation();
  const language = reactLocalStorage.get("language");
  const [selectedHumansId, setSelectedHumansId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [total, setTotal] = useState(0);
  const [listHumans, setListHumans] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (
      language == "vn"
        ? (document.title = "CCTV | Quản lý khuôn mặt")
        : (document.title = "CCTV | Face Management")
    );
  }, []);

  useEffect(() => {
    const data = {
      page: page,
      pageSize: pageSize,
      name: "",
    };
    AIHumansApi.getAllHumans(data).then((result) => {
      setListHumans(result.payload);
      setTotal(result?.metadata?.total);
    });
  }, [page, pageSize, showModal]);

  const getNameByCategory = () => {
    return (
      <div className="card--header">
        <h4>{t("view.ai_humans.face")}</h4>

        <div className="search__toolbar">
          <AutoComplete
            onSearch={debounce(handleSearch, 300)}
            style={{ width: 350, height: 40, marginRight: 18 }}
            maxLength={255}
            className="searchInputCamproxy"
            placeholder={
                <div className="placeholder">
                  <span style={{ opacity: "0.5" }}>
                    {" "}
                    &nbsp;{" "}
                    {`${t("view.user.detail_list.please_enter_search_keyword", {
                      plsEnter: t("please_enter"),
                    })}`}{" "}
                  </span>{" "}
                  <SearchOutlined style={{ fontSize: 22 }} />
                </div>
              }
          ></AutoComplete>
          <Tooltip
            placement="top"
            title={t("view.ai_humans.plus")}
          >
            <Button
              type="primary"
              onClick={() => {
                setSelectedHumansId(null);
                setShowModal(true);
              }}
            >
              <PlusOutlined />
            </Button>
          </Tooltip>


          {/* <Button
              className="btnAdd"
              style={{ borderColor: '#7367F0' }}
              onClick={handleImport}
            >
              + Import
            </Button> */}
        </div>
      </div>
    );
  };

  const handleSearch = async (value) => {
    const data = {
      page: page,
      pageSize: pageSize,
      name: value,
    };
    AIHumansApi.getAllHumans(data).then((result) => {
      let dataResult = result[Object.keys(result)[0]];
      setListHumans(result.payload);
      setTotal(result?.metadata?.total);
    });
  };

  const loadList = async () => {
    const data = {
      page: page,
      pageSize: pageSize,
      name: "",
    };
    AIHumansApi.getAllHumans(data).then((result) => {
      let dataResult = result[Object.keys(result)[0]];
      setListHumans(result.payload);
      setTotal(result?.metadata?.total);
    });
  };

  const handleDelete = async (id) => {
    let isDelete = false;

    isDelete = await AIHumansApi.deleteHumans(id);

    const notifyMess = {
      type: "success",
      title: "",
      description: `${t("noti.successfully_delete_human", {
        delete: t("delete"),
      })}`,
    };
    isDelete && Notification(notifyMess);

    const data = {
      page: page,
      pageSize: pageSize,
      name: ""
    };
    AIHumansApi.getAllHumans(data).then((result) => {
      let dataResult = result[Object.keys(result)[0]];
      setListHumans(result.payload);
      setTotal(result?.metadata.total);
    });
  };

  const onShowSizeChange = (current, pageSize) => {
    setPage(current);
    setPageSize(pageSize);
  };

  const renderTag = (haveImg) => {
    let str = "";
    haveImg ? (str = `${t("view.ai_humans.image.have")}`) : (str = `${t("view.ai_humans.image.no")}`);
    return (
      <Tag color={haveImg ? "#1380FF" : "#FF4646"} style={{ color: "#ffffff" }}>
        {str}
      </Tag>
    );
  };

  const categoryColumns = [
    {
      title: "STT",
      fixed: "left",
      key: "index",
      className: "headerColums",
      width: "10%",
      render: (text, record, index) => index + 1,
    },
    {
      title: `${t("view.ai_humans.name")}`,
      dataIndex: "name",
      key: "name",
      className: "headerColums",
      fixed: "left",
      width: "15%",
    },
    {
      title: `${t("view.ai_humans.code")}`,
      dataIndex: "code",
      className: "headerColums",
      key: "code",
      width: "5%",
    },
    {
      title: `${t("view.ai_humans.position")}`,
      dataIndex: "position",
      className: "headerColums",
      key: "position",
      width: "10%",
    },
    {
      title: `${t("view.ai_humans.adminUnit")}`,
      dataIndex: "adminUnitName",
      className: "headerColums",
      key: "adminUnit",
      width: "10%",
    },
    {
      title: `${t("view.ai_humans.department")}`,
      dataIndex: "departmentName",
      className: "headerColums",
      key: "department",
      width: "10%",
    },
    {
      title: `${t("view.ai_humans.status")}`,
      dataIndex: "haveImg",
      className: "headerColums",
      key: "haveImg",
      render: renderTag,
      width: "10%",
    },
    {
      title: `${t("view.storage.action")}`,
      className: "headerColums",
      fixed: "right",
      width: "12%",
      render: (_text, record) => {
        return (
          <Space>
            <Tooltip
              placement="top"
              title={t("view.ai_humans.edit")}
            >
              <EditOutlined
                style={{ fontSize: "16px", color: "#6E6B7B" }}
                onClick={() => {
                  setSelectedHumansId(record.uuid);
                  setShowModal(true);
                }}
              />
            </Tooltip>
            <Tooltip
              placement="top"
              title={t("view.ai_humans.delete")}
            >
              <Popconfirm
                cancelText={t("view.user.detail_list.cancel")}
                okText={t("view.user.detail_list.confirm")}
                title={t("noti.delete_category", { this: t("this") })}
                onConfirm={() => handleDelete(record.uuid)}
              >
                <DeleteOutlined style={{ fontSize: "16px", color: "#6E6B7B" }} />
              </Popconfirm>
            </Tooltip>


          </Space>
        );
      },
    },
  ];

  return (
    <div className="tabs__container--category">
      <Breadcrumds
        url="/app/setting"
        nameParent={t("breadcrumd.setting")}
        nameChild={t("view.ai_humans.face")}
      />

      <Card
        title={getNameByCategory()}
        // extra={
        //   <Button>
        //     <PlusOneOutlined />
        //   </Button>
        // }
        bodyStyle={bodyStyleCard}
        headStyle={headStyleCard}
        className="card--category"
      // headStyle={{ padding: 30 }}
      >
        <Table
          className="table__hard--drive--list"
          pagination={{
            showSizeChanger: true,
            onShowSizeChange: (current, size) => {
              onShowSizeChange(current, size);
            },
            hideOnSinglePage: false,
            current: page,
            total: total,
            pageSize: pageSize,
            onChange: (value) => {
              setPage(value.trim());
            },
            showTotal: (total, range) => {
              return (
                <ShowTotal className="show--total">
                  {t("view.user.detail_list.viewing")} {range[0]}{" "}
                  {t("view.user.detail_list.to")} {range[1]}{" "}
                  {t("view.user.detail_list.out_of")} {total}{" "}
                  {t("view.user.detail_list.indexes")}
                </ShowTotal>
              );
            },
          }}
          locale={{
            emptyText: (
              <div style={{ color: "white" }}>
                {t("view.user.detail_list.no_valid_results_found")}
              </div>
            ),
          }}
          scroll={{ x: "max-content", y: 500 }}
          rowKey="id"
          columns={categoryColumns}
          dataSource={listHumans}
        />
      </Card>

      {/* {selectedCategoryId && (
        <ModalViewEditCategory
          dataType={dataType}
          selectedCategoryId={selectedCategoryId}
          handleShowModalEdit={handleShowModalEdit}
        />
      )}
      {selectedAdd && (
        <ModalAddCategory
          fields={field}
          selectedAdd={selectedAdd}
          handleShowModalAdd={handleShowModalAdd}
          dataType={dataType}
        />
      )} */}
      {showModal && (
        <ModalEditHumans
          selectedHumansId={selectedHumansId}
          setShowModal={setShowModal}
          loadList={loadList}
        />
      )}
    </div>
  );
};

export default withRouter(TableHumans);
