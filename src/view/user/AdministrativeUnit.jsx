import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
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
  Tooltip,
} from "antd";
import "antd/dist/antd.css";
import { isEmpty } from "lodash-es";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import AdDivisionApi from "../../actions/api/advision/AdDivision";

import Notification from "../../components/vms/notification/Notification";
import Breadcrumds from "../breadcrumds/Breadcrumds";
import "./../commonStyle/commonInput.scss";
import "./../commonStyle/commonSelect.scss";
import "./../commonStyle/commonTable.scss";
import ModalEditAdministrativeUnit from "./ModalEditAdministrativeUnit";
import ModalViewDetail from "./ModalViewDetail";
import "./AdministrativeUnit.scss";
import { bodyStyleCard, headStyleCard } from "./variables";

export const CATEGORY_NAME = {
  AD_DIVISIONS: "AD_DIVISIONS",
};

const AdministrativeUnit = () => {
  const { t } = useTranslation();
  const language = reactLocalStorage.get("language");
  const [dataOptions, setDataOptions] = useState({});
  const [dataType, setDataType] = useState(CATEGORY_NAME.AD_DIVISIONS);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (
      language == "vn"
        ? (document.title = "CCTV | Administrative unit")
        : (document.title = "CCTV | Đơn vị hành chính")
    );
  }, [t]);

  useEffect(() => {
    const data = {
      name: "",
    };
    fetchOptionsData(data).then((data) => {
      setDataOptions(data);
    });
  }, [showModal]);

  const getDataByCategory = (dataType) => {
    if (isEmpty(dataType)) {
      return [];
    }

    const dataSource = adDivisions;

    return dataSource;
  };
  const getNameByCategory = (dataType) => {
    if (isEmpty(dataType)) {
      return [];
    }

    let name = `${t("view.map.administrative_unit")}`;

    return (
      <div className="card--header">
        <h4> {name}</h4>
        <div className="search__toolbar">
          <AutoComplete
            className="searchInputCamproxy"
            value={search}
            onSearch={handleSearch}
            onBlur={handleBlur}
            maxLength={255}
            style={{ width: 350, height: 40, marginRight: 18 }}
            placeholder={
              <div>
                <span> &nbsp;{t("view.map.search")} </span>{" "}
                <SearchOutlined style={{ fontSize: 22 }} />
              </div>
            }
          ></AutoComplete>

          <Tooltip placement="top" title={t("add")}>
            <Button
              type="primary"
              onClick={() => {
                setSelectedCategoryId(null);
                setShowModal(true);
              }}
            >
              <PlusOutlined />
            </Button>
          </Tooltip>
        </div>
      </div>
    );
  };

  const handleBlur = (event) => {
    const value = event.target.value.trim();
    setSearch(value);
  };

  const handleSearch = async (value) => {
    setSearch(value);
    const data = {
      name: value,
    };
    const dataSearch = await fetchOptionsData(data);
    setDataOptions(dataSearch);
  };

  const handleDelete = async (id, dataType) => {
    if (isEmpty(dataType)) {
      return [];
    }

    let isDelete = false;

    isDelete = await AdDivisionApi.delete(id);
    const notifyMess = {
      type: "success",
      title: "",
      description: `${t("noti.successfully_delete_administrative_category", {
        delete: t("delete"),
      })}`,
    };
    isDelete && Notification(notifyMess);
    const data = {
      name: "",
    };
    fetchOptionsData(data).then(setDataOptions);
  };

  const handleShowModalInfo = () => {
    setSelectedUnitId(null);
  };

  const { adDivisions } = dataOptions;

  const categoryColumns = [
    {
      title: `${t("view.storage.NO")}`,
      key: "index",
      className: "headerColums",
      width: "10%",
      render: (text, record, index) => index + 1,
    },

    {
      title: `${t("view.category.administrative_unit_name")}`,
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      // width: '50%',
      className: "headerColums",
    },

    {
      title: `${t("view.storage.action")}`,
      className: "headerColums",
      width: "12%",
      render: (_text, record) => {
        return (
          <Space>
            <Tooltip placement="top" title={t("view.common_device.edit")}>
              <EditOutlined
                style={{ fontSize: "16px", color: "#6E6B7B" }}
                onClick={() => {
                  setSelectedCategoryId(record.uuid);
                  setShowModal(true);
                }}
              />
            </Tooltip>
            <Tooltip placement="top" title={t("delete")}>
              <Popconfirm
                title={t("noti.delete_category", { this: t("this") })}
                onConfirm={() => handleDelete(record.uuid, dataType)}
              >
                <DeleteOutlined
                  style={{ fontSize: "16px", color: "#6E6B7B" }}
                />
              </Popconfirm>
            </Tooltip>

            {dataType === CATEGORY_NAME.AD_DIVISIONS && (
              <Tooltip placement="top" title={t("view.common_device.detail")}>
                <InfoCircleOutlined
                  style={{ fontSize: "16px", color: "#6E6B7B" }}
                  onClick={() => {
                    setSelectedUnitId(record.uuid);
                  }}
                />
              </Tooltip>
            )}
          </Space>
        );
      },
    },
  ];

  const handleShowModalUpdateCategory = () => {
    let modalHtml = null;
    if (showModal) {
      if (dataType === CATEGORY_NAME.AD_DIVISIONS) {
        modalHtml = (
          <ModalEditAdministrativeUnit
            selectedCategoryId={selectedCategoryId}
            setShowModal={setShowModal}
          />
        );
      }
    }
    return modalHtml;
  };

  return (
    <div className="tabs__container--category">
      <Breadcrumds
        url="/app/setting"
        nameParent={t("breadcrumd.setting")}
        nameChild={t("view.map.administrative_unit")}
      />

      <Card
        title={getNameByCategory(dataType)}
        bodyStyle={bodyStyleCard}
        headStyle={headStyleCard}
        className="card--category"
      >
        <Table
          pagination={false}
          scroll={{ y: 500 }}
          rowKey="id"
          columns={categoryColumns}
          dataSource={getDataByCategory(dataType)}
          locale={{
            emptyText: `${t("view.user.detail_list.no_valid_results_found")}`,
          }}
        />
      </Card>
      {handleShowModalUpdateCategory()}
      {selectedUnitId && (
        <ModalViewDetail
          selectedUnitId={selectedUnitId}
          handleShowModal={handleShowModalInfo}
        />
      )}
    </div>
  );
};

async function fetchOptionsData(data) {
  const payload = await Promise.all([AdDivisionApi.getAllAdDivision(data)]);

  return {
    adDivisions: payload[0],
  };
}

export default withRouter(AdministrativeUnit);
