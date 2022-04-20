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
import { isEmpty } from "lodash-es";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import CameraApi from "../../actions/api/camera/CameraApi";
import DepartmentApi from "../../actions/api/department/DepartmentApi";
import EventApi from "../../actions/api/event/EventApi";
import FieldApi from "../../actions/api/field/FieldApi";
import TagApi from "../../actions/api/tag";
import VendorApi from "../../actions/api/vendor/VendorApi";
import Notification from "../../components/vms/notification/Notification";
import Breadcrumds from "../breadcrumds/Breadcrumds";
import "./../commonStyle/commonInput.scss";
import "./../commonStyle/commonSelect.scss";
import "./../commonStyle/commonTable.scss";
import ModalEditCategory from "./ModalEditCategory";
import ModalUpdateTag from "./ModalUpdateTag";
import ModalUpdateDepartment from "./ModalUpdateDepartment";
import ModalViewDetail from "./ModalViewDetail";
import "./TableCategory.scss";
import { bodyStyleCard, headStyleCard } from "./variables";
import debounce from "lodash/debounce";
const AI_SOURCE = process.env.REACT_APP_AI_SOURCE;
export const CATEGORY_NAME = {
  EVENT_TYPE: "EVENT_TYPE",
  VENDOR: "VENDOR",
  CAMERA_TYPE: "CAMERA_TYPE",
  FIELD: "FIELD",
  TAGS: "TAGS",
  DEPARTMENTS: "DEPARTMENTS",
};

const { Option } = Select;
const TableCategory = () => {
  const { t } = useTranslation();
  const language = reactLocalStorage.get("language");
  const [dataOptions, setDataOptions] = useState({});
  const [dataType, setDataType] = useState(CATEGORY_NAME.VENDOR);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (
      language === "vn"
        ? (document.title = "CCTV | Quản lý danh mục")
        : (document.title = "CCTV | Category Management")
    );
  }, [t]);

  useEffect(() => {
    const data = {
      name: "",
      size: 1000,
    };
    fetchOptionsData(data).then((data) => {
      setDataOptions(data);
    });
  }, [showModal]);

  const handleChange = (value) => {
    setDataType(value);
    setSearch("");
    handleSearch("");
  };

  const getDataByCategory = (dataType) => {
    if (isEmpty(dataType)) {
      return [];
    }
    let dataSource;

    if (dataType === CATEGORY_NAME.CAMERA_TYPE) {
      dataSource = cameraTypes;
    }

    if (dataType === CATEGORY_NAME.VENDOR) {
      dataSource = vendors;
    }

    if (dataType === CATEGORY_NAME.FIELD) {
      dataSource = field;
    }
    if (dataType === CATEGORY_NAME.EVENT_TYPE) {
      dataSource = eventTypes;
    }

    if (dataType === CATEGORY_NAME.TAGS) {
      dataSource = tags;
    }

    if (dataType === CATEGORY_NAME.DEPARTMENTS) {
      dataSource = departments;
    }

    return dataSource;
  };
  const getNameByCategory = (dataType) => {
    if (isEmpty(dataType)) {
      return [];
    }

    let name;

    if (dataType === CATEGORY_NAME.CAMERA_TYPE) {
      name = `${t("view.map.camera_type", { cam: t("camera") })}`;
    }

    if (dataType === CATEGORY_NAME.VENDOR) {
      name = `${t("view.category.camera_vendor", { cam: t("camera") })}`;
    }

    if (dataType === CATEGORY_NAME.FIELD) {
      name = `${t("view.category.field")}`;
    }

    if (dataType === CATEGORY_NAME.EVENT_TYPE) {
      name = `${t("view.category.event_type")}`;
    }
    if (dataType === CATEGORY_NAME.TAGS) {
      name = `${t("view.category.tags")}`;
    }
    if (dataType === CATEGORY_NAME.DEPARTMENTS) {
      name = `${t("view.category.department")}`;
    }

    return (
      <div className="card--header">
        <h4> {name}</h4>
        <div className="search__toolbar">
          <AutoComplete
            className="searchInputCamproxy"
            onSearch={debounce(handleSearch, 1000)}
            onBlur={handleBlur}
            onPaste={handlePaste}
            maxLength={255}
            value={search}
            onChange={(value) => setSearch(value)}
            style={{ width: 350, height: 40, marginRight: 18 }}
            placeholder={
              <div>
                <span> &nbsp;{t("view.map.search")} </span>{" "}
                <SearchOutlined style={{ fontSize: 22 }} />
              </div>
            }
          ></AutoComplete>
          <Select defaultValue={CATEGORY_NAME.VENDOR} onChange={handleChange}>
            <Option value={CATEGORY_NAME.VENDOR}>
              {t("view.category.camera_vendor", { cam: t("camera") })}
            </Option>
            <Option value={CATEGORY_NAME.FIELD}>
              {t("view.category.field")}
            </Option>

            <Option value={CATEGORY_NAME.CAMERA_TYPE}>
              {t("view.map.camera_type", { cam: t("camera") })}
            </Option>
            <Option value={CATEGORY_NAME.EVENT_TYPE}>
              {t("view.category.event_type")}
            </Option>
            <Option value={CATEGORY_NAME.TAGS}>
              {t("view.category.tags")}
            </Option>
            {AI_SOURCE === "edso" && (
              <Option value={CATEGORY_NAME.DEPARTMENTS}>
                {t("view.category.department")}
              </Option>
            )}
          </Select>

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

  const handlePaste = (event) => {
    const value = event.target.value.trimStart();
    setSearch(value);
  };

  const handleSearch = async (value) => {
    setSearch(value);
    const data = {
      name: encodeURIComponent(value),
      size: 1000,
    };
    // const dataSearch = await fetchOptionsData(data);
    // setDataOptions(dataSearch);
    let dataSearch;
    if (dataType === CATEGORY_NAME.VENDOR) {
      dataSearch = await VendorApi.getAllVendor(data);
      setDataOptions((prev) => {
        return { ...prev, vendors: dataSearch };
      });
    }

    if (dataType === CATEGORY_NAME.FIELD) {
      dataSearch = await FieldApi.getAllFeild(data);
      setDataOptions((prev) => {
        return { ...prev, field: dataSearch };
      });
    }

    if (dataType === CATEGORY_NAME.CAMERA_TYPE) {
      dataSearch = await CameraApi.getAllCameraTypes(data);
      setDataOptions((prev) => {
        return { ...prev, cameraTypes: dataSearch };
      });
    }

    if (dataType === CATEGORY_NAME.EVENT_TYPE) {
      dataSearch = await EventApi.getAllEvent(data);
      setDataOptions((prev) => {
        return { ...prev, eventTypes: dataSearch };
      });
    }

    if (dataType === CATEGORY_NAME.TAGS) {
      dataSearch = await TagApi.getAllTags(data);
      setDataOptions((prev) => {
        return { ...prev, tags: dataSearch };
      });
    }

    if (dataType === CATEGORY_NAME.DEPARTMENTS) {
      dataSearch = await DepartmentApi.getAllDepartment({
        ...data,
        administrativeUnitUuid: "",
      });
      setDataOptions((prev) => {
        return { ...prev, departments: dataSearch };
      });
    }
  };

  const handleDelete = async (id, dataType) => {
    if (isEmpty(dataType)) {
      return [];
    }

    let isDelete = false;

    if (dataType === CATEGORY_NAME.CAMERA_TYPE) {
      isDelete = await CameraApi.deleteCameraType(id);

      const notifyMess = {
        type: "success",
        title: "",
        description: `${t("noti.successfully_delete_camera_type", {
          delete: t("delete"),
          cam: t("camera"),
        })}`,
      };
      isDelete && Notification(notifyMess);
    }

    if (dataType === CATEGORY_NAME.VENDOR) {
      isDelete = await VendorApi.delete(id);
      const notifyMess = {
        type: "success",
        title: "",
        description: `${t("noti.successfully_delete_camera_vendor", {
          delete: t("delete"),
          cam: t("camera"),
        })}`,
      };
      isDelete && Notification(notifyMess);
    }

    if (dataType === CATEGORY_NAME.FIELD) {
      isDelete = await FieldApi.deleteField(id);
      const notifyMess = {
        type: "success",
        title: "",
        description: `${t("noti.successfully_delete_field", {
          delete: t("delete"),
        })}`,
      };
      isDelete && Notification(notifyMess);
    }

    if (dataType === CATEGORY_NAME.EVENT_TYPE) {
      isDelete = await EventApi.deleteEvent(id);
      const notifyMess = {
        type: "success",
        title: "",
        description: `${t("noti.successfully_delete_event_type", {
          delete: t("delete"),
        })}`,
      };
      isDelete && Notification(notifyMess);
    }

    if (dataType === CATEGORY_NAME.TAGS) {
      isDelete = await TagApi.deleteTagById(id);
      const notifyMess = {
        type: "success",
        title: "",
        description: `${t("noti.successfully_delete_tag_type", {
          delete: t("delete"),
        })}`,
      };
      isDelete && Notification(notifyMess);
    }

    if (dataType === CATEGORY_NAME.DEPARTMENTS) {
      isDelete = await DepartmentApi.delete(id);
      const notifyMess = {
        type: "success",
        title: "",
        description: `${t("noti.successfully_delete_dep_type", {
          delete: t("delete"),
        })}`,
      };
      isDelete && Notification(notifyMess);
    }
    const data = {
      name: "",
      size: 1000,
    };
    fetchOptionsData(data).then(setDataOptions);
  };

  const handleShowModalInfo = () => {
    setSelectedUnitId(null);
  };

  const { vendors, cameraTypes, field, eventTypes, tags, departments } =
    dataOptions;

  const categoryColumns = [
    {
      title: `${t("view.storage.NO")}`,
      key: "index",
      className: "headerColums",
      width: "10%",
      render: (text, record, index) => index + 1,
    },

    {
      title: `${t("view.category.category_name")}`,
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
                cancelText={t("view.user.detail_list.cancel")}
                okText={t("view.user.detail_list.confirm")}
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

  const addFieldColumn = {
    title: `${t("view.category.field")}`,
    dataIndex: "fieldName",
    key: "fieldName",
    width: "40%",

    className: "headerColums",
  };

  const addTagColumns = [
    {
      title: `${t("view.category.category_name")}`,
      dataIndex: "key",
      key: "key",
      className: "headerColums",
    },
  ];

  const addDepartmentColumns = [
    {
      title: `${t("view.category.administrative_unit")}`,
      dataIndex: "administrativeName",
      key: "administrativeName",
      className: "headerColums",
    },
  ];

  if (dataType === CATEGORY_NAME.EVENT_TYPE) {
    categoryColumns.splice(2, 0, addFieldColumn);
  }

  if (dataType === CATEGORY_NAME.TAGS) {
    categoryColumns.splice(1, 1, ...addTagColumns);
  }

  if (dataType === CATEGORY_NAME.DEPARTMENTS) {
    categoryColumns.splice(2, 0, ...addDepartmentColumns);
  }

  const handleShowModalUpdateCategory = () => {
    let modalHtml = null;
    if (showModal) {
      if (dataType === CATEGORY_NAME.TAGS) {
        modalHtml = (
          <ModalUpdateTag
            selectedCategoryId={selectedCategoryId}
            setShowModal={setShowModal}
          />
        );
      } else if (dataType === CATEGORY_NAME.DEPARTMENTS) {
        modalHtml = (
          <ModalUpdateDepartment
            selectedCategoryId={selectedCategoryId}
            setShowModal={setShowModal}
          />
        );
      } else {
        modalHtml = (
          <ModalEditCategory
            dataType={dataType}
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
        nameChild={t("view.user.category_management")}
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
  const payload = await Promise.all([
    CameraApi.getAllCameraTypes(data),
    VendorApi.getAllVendor(data),
    FieldApi.getAllFeild(data),
    EventApi.getAllEvent(data),
    TagApi.getAllTags(data),
    DepartmentApi.getAllDepartment({ ...data, administrativeUnitUuid: "" }),
  ]);

  return {
    cameraTypes: payload[0],
    vendors: payload[1],
    field: payload[2],
    eventTypes: payload[3],
    tags: payload[4],
    departments: payload[5],
  };
}

export default withRouter(TableCategory);
