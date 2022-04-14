import { SearchOutlined } from "@ant-design/icons";
import { AutoComplete, Modal, Table } from "antd";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CameraApi from "../../../../actions/api/camera/CameraApi";
import "./ModalAddCameraGroup.scss";

const ModalAddCameraGroup = (props) => {
  const { handleShowModalAdd, selectedAdd } = props;

  const { t } = useTranslation();

  const [isModalVisible, setIsModalVisible] = useState(selectedAdd);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [search, setSearch] = useState("");

  const [cameraGroup, setCameraGroup] = useState([]);

  useEffect(() => {
    let data = {
      name: search,
      page: 1,
      size: 1000000,
    };
    CameraApi.getAllGroupCamera(data).then((result) => {
      let selectedId = props?.checkedGroups;
      const data = result.filter((r) => !selectedId.includes(r.uuid));
      setCameraGroup(data);
    });
  }, []);

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  // const hasSelected = selectedRowKeys.length  > 0;

  const handleSearch = async (value) => {
    setSearch(value);

    CameraApi.getAllGroupCamera({
      name: value,
      page: 1,
      size: 1000000,
    }).then((result) => {
      let selectedId = props?.checkedGroups;
      const data = result.filter((r) => !selectedId.includes(r.uuid));
      setCameraGroup(data);
    });
  };

  const handleSubmit = async () => {
    const data = selectedRowKeys.map((s) => {
      return {
        subject: `user@${props.id}`,
        object: `cam_g@${s}`,
        action: "view_online",
      };
    });

    const dataAdd = {
      policies: data,
    };

    const isAdd = await CameraApi.addMultilPermission(dataAdd);
    if (isAdd) {
      setIsModalVisible(false);
      handleShowModalAdd([
        ...new Set(props?.checkedGroups.concat(selectedRowKeys)),
      ]);
    }
  };

  const handleCancel = async () => {
    setIsModalVisible(false);
    handleShowModalAdd();
  };

  const handleBlur = (event) => {
    const value = event.target.value.trim();
    setSearch(value);
  };

  const renderHeader = () => {
    return (
      <>
        <div className="d-flex justify-content-between">
          <AutoComplete
            className=" full-width height-40"
            onSearch={debounce(handleSearch, 1000)}
            onBlur={handleBlur}
            maxLength={255}
            placeholder={
              <div className="placehoder height-40 justify-content-between d-flex align-items-center">
                <span style={{ opacity: "0.5" }}>
                  {" "}
                  &nbsp;{" "}
                  {t("view.user.detail_list.please_enter_search_keyword", {
                    plsEnter: t("please_enter"),
                  })}{" "}
                </span>{" "}
                <SearchOutlined style={{ fontSize: 22 }} />
              </div>
            }
          />
        </div>
        <div
          className="choose__records"
          style={{
            marginRight: 20,
            // marginBottom: 20,
            color: "#ffffff",
            height: "20px",
          }}
        >
          {/* {hasSelected
            ? `${t('view.storage.choose')} ${selectedRowKeys.length 
            } ${t('view.storage.record')}`
            : ''} */}
        </div>
      </>
    );
  };

  const columns = [
    {
      title: `${t("view.user.detail_list.camera_group_name")}`,
      dataIndex: "name",
      className: "headerUserColums",
    },
    {
      title: `${t("view.user.detail_list.desc")}`,
      dataIndex: "description",
      className: "headerUserColums",
    },
  ];

  return (
    <>
      <Modal
        title={t("view.user.detail_list.add_camera_group_to_user")}
        className="modal__add-camera-group--in-detail-user"
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        // style={{ top: 30, height: 790, borderRadius: 10 }}
        width={500}
        cancelText={t("view.map.button_cancel")}
        okText={t("view.map.button_save")}
        maskStyle={{ background: "rgba(51, 51, 51, 0.9)" }}
      >
        <Table
          className="tableAddCameraGroup"
          rowKey="uuid"
          columns={columns}
          dataSource={cameraGroup}
          title={renderHeader}
          // scroll={{ y: 300 }}
          rowSelection={rowSelection}
          rowClassName={(includes) =>
            props?.checkedGroups.includes(includes?.uuid) ? "disabled-row" : ""
          }
          locale={{
            emptyText: `${t("view.user.detail_list.no_valid_results_found")}`,
          }}
        />
      </Modal>
    </>
  );
};

export default ModalAddCameraGroup;
