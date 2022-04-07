import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  StarFilled,
} from "@ant-design/icons";
import { Image, Modal, Spin, Select, Tooltip } from "antd";
import { debounce, isEmpty } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroller";
import { reactLocalStorage } from "reactjs-localstorage";
import bookmarkApi from "../../../api/controller-api/bookmarkApi";
import cameraApi from "../../../api/controller-api/cameraApi";
import { KControllerOk } from "../../../api/controller-api/code";
import nextIcon from "../../../assets/img/icons/next.png";
import {
  filterOption,
  normalizeOptions,
} from "../../../view/common/select/CustomSelect";
import {
  GRID1X1,
  GRID2X2,
  GRID3X3,
  GRID4X4,
  GRIDALL,
} from "../../../view/common/vms/constans/grid";
import { NOTYFY_TYPE } from "../../../view/common/vms/Constant";
import Notification from "../notification/Notification";
import "./BookmarkSetting.scss";

const language = reactLocalStorage.get("language");

let gridTypes = {};

if (language == "vn") {
  gridTypes = [
    {
      name: "Tất cả",
      id: GRIDALL,
    },
    {
      name: GRID1X1,
      id: GRID1X1,
    },
    {
      name: GRID2X2,
      id: GRID2X2,
    },
    {
      name: GRID3X3,
      id: GRID3X3,
    },
    {
      name: GRID4X4,
      id: GRID4X4,
    },
  ];
} else {
  gridTypes = [
    {
      name: "All",
      id: GRIDALL,
    },
    {
      name: GRID1X1,
      id: GRID1X1,
    },
    {
      name: GRID2X2,
      id: GRID2X2,
    },
    {
      name: GRID3X3,
      id: GRID3X3,
    },
    {
      name: GRID4X4,
      id: GRID4X4,
    },
  ];
}
const initialDataGrid = [...Array(16).keys()];
const BookmarkSetting = ({
  reloadBookmark,
  showModal,
  handleClickOkCB,
  handleClickCancelCB,
}) => {
  const { t } = useTranslation();
  // const dispatch = useDispatch();
  const [bookmarks, setBookmarks] = useState([]);
  const [config, setConfig] = useState({
    loading: false,
    hasMore: true,
  });
  const [rowClass, setRowClass] = useState("h-25");
  const [colClass, setColClass] = useState("col-3");
  const [dataGridPreview, setDataGridPreview] = useState(initialDataGrid);
  const [gridType, setGridType] = useState();
  const [total, setTotal] = useState(0);
  let [currentPage, setCurrentPage] = useState(1);
  const [currentRecordNumber, setCurrentRecordNumber] = useState(0);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [newName, setNewName] = useState(null);
  const [searchName, setSearchName] = useState(null);
  const [initialGridPreview, setInitialGridPreview] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const [activeRow, setActiveRow] = useState(null);

  // Debounce the original search async function
  const searchFunc = useCallback(
    debounce((value, gridType) => fetchData(gridType, value, true), 200),
    []
  );

  const handleChangeGridStyle = (gridSize) => {
    let tmp = initialGridPreview;
    switch (gridSize) {
      case GRID1X1:
        setRowClass("h-100");
        setColClass("col-12");
        tmp = initialGridPreview.slice(0, 1);
        break;
      case GRID2X2:
        setRowClass("h-50");
        setColClass("col-6");
        tmp = initialGridPreview.slice(0, 4);
        break;
      case GRID3X3:
        setRowClass("h-33");
        setColClass("col-4");
        tmp = initialGridPreview.slice(0, 9);
        break;
      case GRID4X4:
        setRowClass("h-25");
        setColClass("col-3");
        tmp = initialGridPreview.slice(0, 16);
        break;
      default:
        break;
    }
    setDataGridPreview(tmp);
    return tmp;
  };

  /**
   * @appendMode: Chế độ đang loading trang mới hay là mở lần đâu tiên hoặc tìm kiếm
   * Trong trương hợp loading trang tiếp theo, cần lưu lại số lượng bookmarks trước đó để append vào
   * Trường hợp mở popup hoặc tìm kiếm, luôn tìm theo trang đầu tiên và coi mảng bookmark ban đầu là rỗng
   */
  const fetchData = async (gType, queryName, appendMode) => {
    let tmp = [];
    if (appendMode) {
      tmp = [...bookmarks];
    } else {
      currentPage = 1;
    }
    const data = await bookmarkApi.getAll({
      name: queryName ? queryName : searchName,
      size: 12,
      page: currentPage,
      gridType: gType ? gType : gridType,
      sort_by: "name",
      order_by: "asc",
    });
    if (data && data.payload) {
      if (appendMode) {
        tmp = [...bookmarks];
      }
      data.payload.forEach((item, index) => {
        tmp.push({
          id: item.uuid,
          name: item.name,
          gridType: item.gridType,
          cameraUuids: item.cameraUuids,
          defaultBookmark: item.defaultBookmark,
          viewTypes: item.viewTypes,
        });
      });
      setBookmarks(tmp);
      setLoaded(true);
      const total = data.metadata.total;
      const pageSize = data.metadata.size;
      const totalPage = Math.floor(total / pageSize) + 1;
      setTotal(total);
      if (totalPage == currentPage) {
        setConfig({
          hasMore: false,
          loading: false,
        });
        setCurrentRecordNumber(total);
      } else {
        setConfig({
          hasMore: true,
          loading: false,
        });
        setCurrentRecordNumber(currentPage * pageSize);
        setCurrentPage(currentPage + 1);
      }
    }
  };
  useEffect(() => {
    setCurrentRecord(null);
    fetchData(null, null, false);
  }, [reloadBookmark]);

  useEffect(() => {
    setCurrentRecord(null);
    fetchData(null, null, true);
  }, [gridType, searchName]);

  useEffect(() => {
    const tmp = dataGridPreview.map((item, idx) => {
      return {
        id: idx,
        cameraName: null,
      };
    });
    setInitialGridPreview(tmp);
    setDataGridPreview(tmp);
  }, []);

  useEffect(() => {
    if (showModal == false) {
      setSearchName(null)
      let fakeData = {
        target: {
          value: ""
        }
      }
      handleInputOnchange(fakeData)
    }
  }, [showModal])

  const handleInfiniteOnLoad = () => {
    setConfig({
      loading: true,
    });

    fetchData(null, null, true).then((r) => console.log(r));
  };

  const handleSelectScreen = async (item) => {
    setNewName(null);
    setActiveRow(item.id);

    if (!item && item.cameraUuids) {
      return;
    }
    let tmp1 = handleChangeGridStyle(item.gridType);
    let cameraUuids = [];
    item.cameraUuids.forEach((it) => {
      if (it != "") {
        cameraUuids.push(it);
      }
    });
    if (cameraUuids.length <= 0) {
      Notification({
        type: "warning",
        title: `${t("noti.choose_favorite_screen")}`,
        description: `${t("noti.no_camera_in_screen")}`,
      });
      return;
    }

    try {
      const resData = await cameraApi.searchCamerasWithUuids({
        uuids: cameraUuids,
      });
      if (resData && resData.payload) {
        const camList = resData.payload;
        const tmp = tmp1.map((it, idx) => {
          if (item.cameraUuids[idx] !== "") {
            const camUuid = item.cameraUuids[idx];
            const camFoundIdx = camList.findIndex(
              (ite) => ite.uuid === camUuid
            );
            if (camFoundIdx < 0) {
              Notification({
                type: "warning",
                title: `${t("noti.default_screen")}`,
                description: `${t("noti.camera_not_exist")}`,
              });
              return it;
            }
            const cam = camList[camFoundIdx];
            return {
              id: idx,
              camId: cam.id,
              cameraUuid: camUuid,
              cameraName: cam.name,
            };
          }
          return it;
        });
        setDataGridPreview(tmp);
        let screen = { ...item };
        screen.camList = tmp;
        setCurrentRecord(screen);
      }
    } catch (err) {
      Notification({
        type: "warning",
        title: `${t("noti.view_screen_list")}`,
        description: err.toString(),
      });
    }
  };

  const handleDeleteScreen = async (screen, idx) => {
    const nameScreen = screen.name;
    try {
      const resData = await bookmarkApi.delete(screen.id);
      if (resData.code == KControllerOk) {
        let tmp = [...bookmarks];
        const deletedIdx = tmp.findIndex((it) => it.id == screen.id);
        const screenEle = document.getElementById(`screenId-${idx}`);
        screenEle.style.display = "block";
        const screenEleInput = document.getElementById(
          `screenEditInput-${idx}`
        );
        screenEleInput.style.display = "none";
        tmp.splice(deletedIdx, 1);
        setBookmarks(tmp);
        Notification({
          type: "success",
          title: `${t("noti.delete_screen")}`,
          description:
            `${t("noti.delete")}` + nameScreen + `${t("noti.screen_success")}`,
        });
      }
    } catch (err) {
      Notification({
        type: NOTYFY_TYPE.warning,
        title: `${t("noti.delete_screen")}`,
        description:
          `${t("noti.delete")}` +
          nameScreen +
          `${t("noti.screen_failed")}` +
          err.toString(),
      });
    } finally {
      setCurrentRecord(null);
    }
  };

  const handleSetDefault = async (screen, idx) => {
    handleSelectScreen(screen);
    const nameScreen = screen.name;
    try {
      const resData = await bookmarkApi.setDefault(screen.id);
      if (resData && resData.payload) {
        Notification({
          type: NOTYFY_TYPE.success,
          title: `${t("noti.default_screen")}`,
          description:
            `${t("noti.setting_default_screen")}` +
            nameScreen +
            `${t("noti.successfully")}`,
        });

        setCurrentRecord(screen);
        fetchData(null, null, false);
      }
    } catch (err) {
      Notification({
        type: NOTYFY_TYPE.warning,
        title: `${t("noti.default_screen")}`,
        description:
          `${t("noti.setting_default_screen_failed")}` + err.toString(),
      });
    } finally {
      setCurrentRecord(null);
    }
  };

  const handleInputOnchange = (e) => {
    const { value } = e.target;
    setCurrentPage(1);
    setSearchName(value);
    setBookmarks([]);
    searchFunc(value, gridType);
  };

  const handleBlur = (e) => {
    setSearchName(e.target.value.trim());
  };

  const handlePaste = (e) => {
    setSearchName(e.target.value.trimStart());
  }

  const handleSelectGridType = (gType) => {
    setCurrentPage(1);
    setBookmarks([]);
    if (gType == GRIDALL) {
      setGridType(null);
    } else {
      setGridType(gType);
    }
  };

  const handleEditMode = (e, item, idx) => {
    const currentItem = item.id
    bookmarks.forEach((b, idx, item) => {
      if (b.id !== currentItem) {
        changeEditModeState(false, idx, item);
      }
    })
    setNewName(null);
    e.stopPropagation();
    changeEditModeState(true, idx, item);
  };

  const onRenameCompleted = async (e, item, idx) => {
    e.stopPropagation();
    changeEditModeState(false, idx, item);

    //API
    const updateItem = { ...item, name: newName };
    const resData = await bookmarkApi.update(updateItem, item.id);
    if (resData) {
      let tmp = [...bookmarks];
      if (!isEmpty(newName)) {
        tmp[idx].name = newName.trim();
        setBookmarks(tmp);
        Notification({
          type: NOTYFY_TYPE.success,
          title: `${t("noti.change_screen_name")}`,
          description: `${t("noti.success")}`,
        });
      } else {
        Notification({
          type: NOTYFY_TYPE.success,
          title: `${t("noti.change_screen_name")}`,
          description: `${t("noti.success")}`,
        });
      }
    }
  };

  const changeEditModeState = (toEditMode, idx, item) => {
    if (toEditMode) {
      //show edit
      const screenEleInput = document.getElementById(`screenEditInput-${idx}`);
      screenEleInput.style.display = "block";
      screenEleInput.focus();
      const screenIdInput = document.getElementById(`screenIdInput-${idx}`);
      screenIdInput.value = item.name;
      //hidden text
      const screenEle = document.getElementById(`screenId-${idx}`);
      screenEle.style.display = "none";
    } else {
      //hidden edit
      const screenEleInput = document.getElementById(`screenEditInput-${idx}`);
      screenEleInput.style.display = "none";
      const screenIdInput = document.getElementById(`screenIdInput-${idx}`);
      screenIdInput.value = item.name;

      //show text
      const screenEle = document.getElementById(`screenId-${idx}`);
      screenEle.style.display = "block";
    }
  };
  const onCloseCompleted = (e, item, idx) => {
    e.stopPropagation();
    changeEditModeState(false, idx, item);
  };
  const handleBookmarkOk = () => {
    handleClickOkCB(currentRecord);
  };

  const handleBookmarkCancel = () => {
    handleClickCancelCB();
  };
  return (
    <Modal
      visible={showModal}
      title={t("components.bookmark.favorite_screen_list")}
      okText={t("view.map.btn_apply")}
      cancelText={t("view.map.button_cancel")}
      onOk={handleBookmarkOk}
      className="modal--bookmark"
      onCancel={handleBookmarkCancel}
      width="90%"
      zIndex={1100}
      maskStyle={{ background: "rgba(51, 51, 51, 0.9)" }}
    >
      <div className="bookmarks">
        <div className="bookmarks__filter">
          <input
            value={searchName}
            className="bookmarks__filter-input"
            type="text"
            maxLength={100}
            placeholder={t("components.bookmark.enter_screen_name")}
            onChange={(e) => {
              handleInputOnchange(e);
            }}
            onBlur={(e) => handleBlur(e)}
            onPaste={(e) => handlePaste(e)}
          />
          <Select
            className="bookmarks__filter-gridType"
            datasource={gridTypes ? gridTypes : []}
            onChange={(gridType) => {
              handleSelectGridType(gridType);
            }}
            filterOption={filterOption}
            options={normalizeOptions("name", "id", gridTypes || [])}
            placeholder={t("components.bookmark.grid_type")}
          />
        </div>
        <div className="bookmarks__content">
          <div className="bookmarks__list">
            <div className="bookmarks__list-heading">
              <span>{t("components.bookmark.screen_name")}</span>
              <span>{t("components.bookmark.grid")}</span>
              <span>{t("components.bookmark.action")}</span>
            </div>
            <div className="bookmarks__list-items">
              <InfiniteScroll
                initialLoad={false}
                pageStart={1}
                loadMore={handleInfiniteOnLoad}
                hasMore={!config.loading && config.hasMore}
                useWindow={false}
              >
                {!isEmpty(bookmarks) ? (
                  bookmarks.map((item, idx) => (
                    <div
                      key={idx}
                      className="bookmarks__list-item"
                      onClick={(e) => handleSelectScreen(item)}
                    >
                      <span
                        className="bookmarks__list-item--name"
                        id={`screenId-${idx}`}
                        onClick={(e) => handleEditMode(e, item, idx)}
                        title={item?.name}
                      >
                        {item?.name.length > 40
                          ? `${item?.name.slice(0, 20)}...`
                          : `${item?.name}`}
                      </span>
                      <div
                        className="bookmarks__list-item--edit-input"
                        id={`screenEditInput-${idx}`}
                      >
                        <input
                          id={`screenIdInput-${idx}`}
                          type="text"
                          value={newName}
                          onChange={(e) => {
                            e.stopPropagation();
                            setNewName(e.target.value);
                          }}
                          defaultValue={item.name.slice(0, 20)}
                          onClick={(e) => {
                            e.stopPropagation();
                            setNewName(e.target.value.trim());
                          }}
                          onBlur={(e) => {
                            setNewName(e.target.value.trim());
                          }}
                          onPaste={(e) => {
                            setNewName(e.target.value.trimStart());
                          }}
                          maxLength={100}
                        />
                        <CheckOutlined
                          className="bookmarks__list-item--icon"
                          onClick={(e) => onRenameCompleted(e, item, idx)}
                        />
                        <CloseOutlined
                          className="bookmarks__list-item--icon"
                          onClick={(e) => onCloseCompleted(e, item, idx)}
                        />
                      </div>

                      <span className="bookmarks__list-item--grid">
                        {item.gridType}
                      </span>
                      <div className="bookmarks__list-actions">
                        <Tooltip
                          placement="top"
                          title={t("view.user.detail_list.edit")}
                          arrowPointAtCenter={true}
                        >
                          <EditOutlined
                            className="bookmarks__list-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditMode(e, item, idx);
                            }}
                          />
                        </Tooltip>

                        <Tooltip
                          placement="top"
                          title={t("delete")}
                          arrowPointAtCenter={true}
                        >
                          <CloseOutlined
                            className="bookmarks__list-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteScreen(item, idx);
                            }}
                          />
                        </Tooltip>

                        <Tooltip
                          placement="top"
                          title={t("view.user.detail_list.star")}
                          arrowPointAtCenter={true}
                        >
                          <StarFilled
                            className={
                              "bookmarks__list-icon " +
                              (item.defaultBookmark == 1
                                ? "bookmarks__list-icon--active"
                                : "")
                            }
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetDefault(item, idx);
                            }}
                          />
                        </Tooltip>
                      </div>
                    </div>
                  ))
                ) : loaded ? (
                  <div
                    className="text-center"
                    style={{ color: "white", margin: "20px 0px" }}
                  >
                    {t("view.user.detail_list.no_valid_results_found")}
                  </div>
                ) : null}
                {config.loading && config.hasMore && (
                  <div className="demo-loading-container">
                    <Spin />
                  </div>
                )}
              </InfiniteScroll>
            </div>
            <div className="bookmarks__list-info">
              {t("components.bookmark.display")} {currentRecordNumber}/{total}{" "}
              {t("components.bookmark.record")}
            </div>
          </div>
          <Image width={40} src={nextIcon} preview={false} />
          <div className="bookmarks__detail">
            <div className="bookmarks__container w-100 col-12">
              {dataGridPreview &&
                dataGridPreview.map((item, index) => (
                  <div
                    key={index}
                    className={`game-cell flex-grow-1 ${rowClass} ${colClass}`}
                  >
                    {item.cameraName}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default BookmarkSetting;
