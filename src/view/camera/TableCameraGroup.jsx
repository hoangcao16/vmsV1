import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  Popconfirm,
  Spin,
  Tabs,
  Tooltip,
  Tree,
} from "antd";
import "antd/dist/antd.css";
import { isEmpty } from "lodash-es";
import debounce from "lodash/debounce";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { reactLocalStorage } from "reactjs-localstorage";
import CameraApi from "../../actions/api/camera/CameraApi";
import Notification from "../../components/vms/notification/Notification";
import Breadcrumds from "../breadcrumds/Breadcrumds";
import "./../commonStyle/commonAuto.scss";
import "./../commonStyle/commonModal.scss";
import "./../commonStyle/commonSelect.scss";
import ModalAddCameraGroup from "./ModalAddCameraGroup";
import ModalEditCameraGroup from "./ModalEditCameraGroup";
import { loadTreeCamGroup } from "./redux/actions/index";
import TableAddCamInCamGroup from "./TableAddCamInCamGroup";
import TableCamera from "./TableCamera";
import "./TableCameraGroup.scss";
import "./TableGroup.scss";
import TableListCamInCamGroup from "./TableListCamInCamGroup";

const { TreeNode } = Tree;

const TYPE = {
  CAMERA: 1,
  CAMERA_GROUP: 2,
};

export const wrapper = {
  fontFamily:
    "Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
};

const { TabPane } = Tabs;

function CameraGroup(props) {
  const { t } = useTranslation();
  const { treeData } = props;
  const [camGroupUuid, setCamGroupUuid] = useState(null);
  const [isAddCam, setIsAddCam] = useState(false);
  const [camInGroup, setCamInGroup] = useState([]);
  const [reload, setReload] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [isEdit, setIsEdit] = useState(null);
  const [valueSearch, setValueSearch] = useState();
  const [dataAdd, setDataAdd] = useState(null);
  const [dataEdit, setDataEdit] = useState(null);
  const [treeNodeCamList, setTreeNodeCamList] = useState([]);

  const [option, setOption] = useState({
    expandedKeys: [],
    searchValue: "",
    autoExpandParent: true,
  });

  // const [form] = Form.useForm();

  useEffect(() => {
    document.title = "CCTV | Camera";
  }, []);

  useEffect(() => {
    props.handleFetchData({ name: "", parent: "all" });
  }, []);

  useEffect(() => {
    if (isEmpty(camGroupUuid)) {
      setCamInGroup([]);
      return;
    }
    CameraApi.getGroupCameraById(camGroupUuid).then((result) => {
      setCamInGroup(result?.cameraList);
    });
    setIsAddCam(false);
  }, [camGroupUuid]);

  useEffect(() => {
    if (isEmpty(camGroupUuid)) {
      setCamInGroup([]);
      return;
    }
    CameraApi.getGroupCameraById(camGroupUuid).then((result) => {
      setCamInGroup(result?.cameraList);
    });
  }, [reload]);

  useEffect(() => {
    setTreeNodeCamList(treeData);
  }, [treeData]);

  const onExpand = (expandedKeys) => {
    setOption({
      ...option,
      expandedKeys,
      autoExpandParent: true,
    });
  };

  const dataList = [];
  const generateList = (data) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { name, uuid } = node;
      dataList.push({ key: uuid, title: name, titleUnsign: unsign(name) });
      if (node.children) {
        generateList(node.children);
      }
    }
  };

  generateList(treeData);
  const getParentKey = (key, treeNodeCamList) => {
    let parentKey;
    for (let i = 0; i < treeNodeCamList.length; i++) {
      const node = treeNodeCamList[i];
      if (node.children) {
        if (node.children.some((item) => item.uuid === key)) {
          parentKey = node.uuid;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      } else {
        parentKey = key;
      }
    }
    return parentKey;
  };

  const getTreeNodeExpand = (key, treeNodeCam) => {
    let treeNodeExpand;
    if (treeNodeCam.uuid === key) {
      treeNodeExpand = treeNodeCam.uuid;
    } else if (treeNodeCam.children) {
      if (treeNodeCam.children.some((item) => item.uuid === key)) {
        treeNodeExpand = treeNodeCam.uuid;
      } else {
        for (let i = 0; i < treeNodeCam.children.length; i++) {
          if (getTreeNodeExpand(key, treeNodeCam.children[i])) {
            treeNodeExpand = getTreeNodeExpand(key, treeNodeCam.children[i]);
            break;
          }
        }
      }
    }
    return treeNodeExpand;
  };

  const handleFilterTreeData = (treeData, expandedKeys) => {
    let treeDataFilter = [];
    if (expandedKeys.length > 0) {
      treeDataFilter = treeData.filter((tree) =>
        expandedKeys.find((key) => getTreeNodeExpand(key, tree))
      );
    }
    return treeDataFilter;
  };

  const handleSearch = async (value) => {
    // setValueSearch(value.trim())
    // const value = data.trim()
    // setValueSearch(value)

    if (isEmpty(value)) {
      setOption({
        ...option,
        expandedKeys: [],
        searchValue: value,
      });
      setTreeNodeCamList(treeData);
      return;
    }
    const valueSearch = unsign(value);
    const expandedKeys = dataList
      .map((item) => {
        if (item.titleUnsign.indexOf(valueSearch) > -1) {
          return getParentKey(item.key, treeData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    let newTreeData = JSON.parse(JSON.stringify(treeData));
    const treeDataFilter = handleFilterTreeData(newTreeData, expandedKeys);
    setTreeNodeCamList(treeDataFilter);
    setOption({
      ...option,
      expandedKeys,
      searchValue: value,
    });
  };

  const handleAdddCamera = (isAdd) => {
    setIsAddCam(isAdd);
    setReload(!reload);
  };

  let camInGroupKey = [];

  camInGroupKey = camInGroup.map((c) => c.uuid);

  const onSelect = (e) => {
    setCamGroupUuid(e[0]);
  };

  function callback(key) {
    reactLocalStorage.setObject("TYPE", key);
    setCamGroupUuid(null);
  }

  const { expandedKeys, autoExpandParent } = option;

  const loop = (data) =>
    data.map((item) => {
      if (item.children) {
        return (
          <TreeNode key={item.uuid} title={renderTitle(item.uuid, item.name)}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode key={item.uuid} title={renderTitle(item.uuid, item.name)} />
      );
    });

  function unsign(str) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase()
      .trim();
  }

  const showModal = (id) => {
    setValueSearch(null)
    setIsAdd(true);
    setDataAdd(id);
  };

  const handleShowModalEdit = () => {
    setIsEdit(false);
    props.handleFetchData({ name: "", parent: "all" });
  };
  const handleShowModalAdd = () => {
    setIsAdd(false);
    props.handleFetchData({ name: "", parent: "all" });
  };

  const showModalEdit = (id) => {
    setValueSearch(null)
    setIsEdit(true);
    setDataEdit(id);
  };

  const renderTitle = (id, name) => {
    return (
      <div className="d-flex">
        <div className="titleGroup" title={name}>
          {name}
        </div>
        <div className="tools--edit">
          <Tooltip placement="top" title={t("view.camera.add_new_camera_group")}>
            <PlusOutlined
              onClick={(e) => {
                e.stopPropagation();
                showModal(id);
              }}
              // style={{ fontSize: '16px', color: '#6E6B7B' }}
            />
          </Tooltip>
          <Tooltip placement="top" title={t("view.common_device.edit")}>
            <EditOutlined
              onClick={(e) => {
                e.stopPropagation();
                showModalEdit(id);
              }}
              // style={{ fontSize: '16px', color: '#6E6B7B' }}
            />
          </Tooltip>
          <Popconfirm
            title={t("noti.delete_camera_group")}
            onConfirm={(e) => {
              e.stopPropagation();
              handleDelete(id);
            }}
            className="confirm--delete"
            icon={<ExclamationCircleOutlined />}
            cancelText={t("view.user.detail_list.cancel")}
            okText={t("view.user.detail_list.confirm")}
          >
            <Tooltip placement="top" title={t("delete")}>
              <DeleteOutlined
                onClick={(e) => {
                  e.stopPropagation();
                }}
                // style={{ fontSize: '16px', color: '#6E6B7B' }}
              />
            </Tooltip>
          </Popconfirm>
        </div>
      </div>
    );
  };

  const handleDelete = async (id) => {
    const isDeleted = await CameraApi.deleteCameraGroup(id);

    if (isDeleted) {
      const notifyMess = {
        type: "success",
        title: "",
        description: `${t("noti.successfully_delete_camera_group")}`,
      };
      Notification(notifyMess);
      props.handleFetchData({ name: "", parent: "all" });
    }
  };

  return (
    <div>
      <Breadcrumds
        url="/app/setting"
        nameParent={t("breadcrumd.setting")}
        nameChild="Camera"
      />
      <div className="tabs__container">
        {/* <Col span={9}> */}
        <div className="tabs__container--camera">
          <Tabs
            type="card"
            onChange={callback}
            defaultActiveKey={
              reactLocalStorage.getObject("TYPE") || TYPE.CAMERA
            }
          >
            <TabPane tab="Camera" key={TYPE.CAMERA} className="Camera">
              <TableCamera />
            </TabPane>
            <TabPane
              tab={t("view.map.camera_group", { cam: t("camera"), G: t("G") })}
              key={TYPE?.CAMERA_GROUP}
              className="CameraGroup"
            >
              <div className="CameraGroupSearch">
                <AutoComplete
                  maxLength={255}
                  className=" full-width height-40 read search__camera-group"
                  onSearch={debounce(handleSearch, 1000)}
                  value={valueSearch}
                  onChange={(e) => setValueSearch(e)}
                  onBlur={(e) => setValueSearch(e.target.value.trim())}
                  onPaste={(e) => setValueSearch(e.target.value.trimStart())}
                  onClear={(e) => console.log("clear")}
                  placeholder={
                    <div className="placehoder height-40 justify-content-between d-flex align-items-center">
                      <span style={{ opacity: "0.5" }}>
                        {" "}
                        &nbsp; {t("view.map.search")}{" "}
                      </span>{" "}
                      <SearchOutlined
                        style={{ fontSize: 20, color: "#E3F0FF" }}
                      />
                    </div>
                  }
                />
                <Tooltip
                  placement="rightTop"
                  title={t("view.camera.add_new_camera_group")}
                >
                  <Button
                    type="primary"
                    className="btnAddUser height-40"
                    style={{ borderRadius: "6px", border: "0" }}
                    onClick={() => showModal(null)}
                  >
                    <PlusOutlined className="d-flex justify-content-between align-center" />
                  </Button>
                </Tooltip>
              </div>

              {!isEmpty(treeNodeCamList) ? (
                <Tree
                  className="treeData"
                  onExpand={onExpand}
                  onSelect={(e) => onSelect(e)}
                  switcherIcon={<DownOutlined />}
                  scroll={{ y: 300 }}
                  virtual={true}
                  defaultExpandAll={true}
                  expandedKeys={expandedKeys}
                  autoExpandParent={autoExpandParent}
                >
                  {loop(treeNodeCamList)}
                </Tree>
              ) : !props?.isLoading ? (
                <div style={{ textAlign: "center", color: "#ffffff" }}>
                  {t("view.user.detail_list.no_valid_results_found")}
                </div>
              ) : (
                <Spin />
              )}
            </TabPane>
          </Tabs>
        </div>
        <div className="tabs__list--camera">
          {isAddCam ? (
            <TableAddCamInCamGroup
              camGroupUuid={camGroupUuid}
              handleAdddCamera={handleAdddCamera}
              camInGroupKey={camInGroupKey}
            />
          ) : (
            <TableListCamInCamGroup
              camGroupUuid={camGroupUuid}
              handleAdddCamera={handleAdddCamera}
            />
          )}
        </div>
      </div>

      {isAdd && (
        <ModalAddCameraGroup
          isAdd={isAdd}
          handleShowModalAdd={handleShowModalAdd}
          dataAdd={isEmpty(dataAdd) ? null : dataAdd}
        />
      )}
      {isEdit && (
        <ModalEditCameraGroup
          isAdd={isAdd}
          handleShowModalEdit={handleShowModalEdit}
          dataEdit={isEmpty(dataEdit) ? null : dataEdit}
        />
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  isLoading: state.cameraGroup.isLoading,
  treeData: state.cameraGroup.treeData,
  error: state.cameraGroup.error,
});

const mapDispatchToProps = (dispatch) => {
  return {
    handleFetchData: (params) => {
      dispatch(loadTreeCamGroup(params));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CameraGroup);
