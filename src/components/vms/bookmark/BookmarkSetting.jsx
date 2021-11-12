import React, { useEffect, useState, useCallback } from "react";
import { Select, Spin, Modal, Image } from "antd";
import {
    filterOption,
    normalizeOptions,
} from "../../../view/common/select/CustomSelect";
import { debounce, isEmpty } from "lodash";
import "./BookmarkSetting.scss";

import InfiniteScroll from "react-infinite-scroller";
import nextIcon from "../../../assets/img/icons/next.png";
import bookmarkApi from "../../../api/controller-api/bookmarkApi";
import { CheckOutlined, CloseOutlined, EditOutlined, StarFilled } from "@ant-design/icons";

import cameraApi from "../../../api/controller-api/cameraApi";
import Notification from "../notification/Notification";
import { NOTYFY_TYPE } from "../../../view/common/vms/Constant";
import {
    GRID1X1,
    GRID2X2,
    GRID3X3,
    GRID4X4,
    GRIDALL,
} from "../../../view/common/vms/constans/grid";
import { useTranslation } from 'react-i18next';
import { KControllerOk } from "../../../api/controller-api/code";



const gridTypes = [
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
    const [isModalBookmarkVisible, setIsModalBookmarkVisible] = useState(false);


    // Debounce the original search async function
    const searchFunc = useCallback(
        debounce((value, gridType) => fetchData(gridType, value, true), 200),
        []
    );

    const handleChangeGridStyle = (gridSize) => {
        console.log("handleChangeGridStyle:", gridSize);
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
        }
        console.log("handleChangeGridStyle:", tmp);
        setDataGridPreview(tmp);
        return tmp;
    };

    /**
     * @appendMode: Chế độ đang loading trang mới hay là mở lần đâu tiên hoặc tìm kiếm
     * Trong trương hợp loading trang tiếp theo, cần lưu lại số lượng bookmarks trước đó để append vào
     * Trường hợp mở popup hoặc tìm kiếm, luôn tìm theo trang đầu tiên và coi mảng bookmark ban đầu là rỗng
     */
    const fetchData = async (gType, queryName, appendMode) => {
        let tmp = []
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
                });
            });
            setBookmarks(tmp);
            console.log("fetchData========>:", currentPage, data, tmp);
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

    const handleInfiniteOnLoad = () => {
        setConfig({
            loading: true,
        });

        fetchData(null, null, true).then((r) => console.log(r));
    };

    const handleSelectScreen = async (item) => {
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
                title: "Chọn màn hình ưa thích",
                description: "Không tồn tại bất kỳ camera trong màn hình này",
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
                        const camFoundIdx = camList.findIndex((ite) => ite.uuid === camUuid)
                        if (camFoundIdx < 0) {
                            Notification({
                                type: "warning",
                                title: "Màn hình mặc định",
                                description: "Không tồn tại camera này",
                            });
                            return it
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
                title: "Xem danh sách màn hình",
                description: "Lỗi:" + err.toString(),
            });
        }
    };

    const handleDeleteScreen = async (screen, idx) => {
        debugger
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
                    title: "Xóa màn hình",
                    description: "Xóa màn hình " + nameScreen + " thành công",
                });
            }
        } catch (err) {
            Notification({
                type: NOTYFY_TYPE.warning,
                title: "Xóa màn hình",
                description:
                    "Xóa màn hình " + nameScreen + " thất bại.Lỗi " + err.toString(),
            });
        } finally {
            setCurrentRecord(null);
        }
    };

    const handleSetDefault = async (screen, idx) => {
        const nameScreen = screen.name;
        try {
            const resData = await bookmarkApi.setDefault(screen.id);
            if (resData && resData.payload) {
                Notification({
                    type: NOTYFY_TYPE.success,
                    title: "Màn hình mặc định",
                    description: "Cài đặt màn hình  mặc định " + nameScreen + " thành công",
                });

                setCurrentRecord(screen);
                fetchData(null, null, false);

            }
        } catch (err) {
            Notification({
                type: NOTYFY_TYPE.warning,
                title: "Màn hình mặc định",
                description:
                    "Cài đặt màn hình  mặc định thất bại.Lỗi:" + err.toString(),
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
        console.log("handleEditMode:", item, idx, bookmarks);
        e.stopPropagation();
        changeEditModeState(true, idx, item);
    };

    const onRenameCompleted = async (e, item, idx) => {
        console.log("onRenameCompleted:", item, idx, newName);
        e.stopPropagation();
        changeEditModeState(false, idx, item);

        //API
        const updateItem = { ...item, name: newName };
        try {
            const resData = await bookmarkApi.update(updateItem, item.id);
            if (resData) {
                let tmp = [...bookmarks];
                tmp[idx].name = newName.trim();
                setBookmarks(tmp);
                Notification({
                    type: NOTYFY_TYPE.success,
                    title: "Đổi tên màn hình",
                    description: "Thành công",
                });
            }
        } catch (err) {
            Notification({
                type: NOTYFY_TYPE.warning,
                title: "Đổi tên màn hình",
                description: "Thất bại. Lỗi:" + err.toString(),
            });
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
        setIsModalBookmarkVisible(false);
        handleClickOkCB(currentRecord);
    };

    const handleBookmarkCancel = () => {
        handleClickCancelCB();
    };
    return (
        <Modal
            visible={showModal}
            title={t('components.bookmark.favorite_screen_list')}
            okText={t('view.map.btn_apply')}
            cancelText={t('view.map.button_cancel')}
            onOk={handleBookmarkOk}
            className='modal--bookmark'
            onCancel={handleBookmarkCancel}
            width='90%'
            zIndex={1100}
            maskStyle={{ background: 'rgba(51, 51, 51, 0.9)' }}
        >
            <div className='bookmarks'>
                <div className='bookmarks__filter'>
                    <input
                        className='bookmarks__filter-input'
                        type='text'
                        maxLength={100}
                        placeholder={t('components.bookmark.enter_screen_name')}
                        onChange={(e) => {
                            handleInputOnchange(e);
                        }}
                    />
                    <Select
                        className='bookmarks__filter-gridType'
                        datasource={gridTypes ? gridTypes : []}
                        showSearch
                        allowClear
                        onChange={(gridType) => {
                            handleSelectGridType(gridType);
                        }}
                        filterOption={filterOption}
                        options={normalizeOptions("name", "id", gridTypes || [])}
                        placeholder={t('components.bookmark.grid_type')}
                    />
                </div>
                <div className='bookmarks__content'>
                    <div className='bookmarks__list'>
                        <div className='bookmarks__list-heading'>
                            <span>{t('components.bookmark.screen_name')}</span>
                            <span>{t('components.bookmark.grid')}</span>
                            <span>{t('components.bookmark.action')}</span>
                        </div>
                        <div className='bookmarks__list-items'>
                            <InfiniteScroll
                                initialLoad={false}
                                pageStart={1}
                                loadMore={handleInfiniteOnLoad}
                                hasMore={!config.loading && config.hasMore}
                                useWindow={false}
                            >
                                {bookmarks.map((item, idx) => (
                                    <div
                                        className={"bookmarks__list-item"}
                                        onClick={(e) => handleSelectScreen(item)}
                                    >
                                        <span
                                            className='bookmarks__list-item--name'
                                            id={`screenId-${idx}`}
                                            onClick={(e) => handleEditMode(e, item, idx)}
                                            title={item?.name}
                                        >
                                            {item?.name}
                                        </span>
                                        <div
                                            className=' bookmarks__list-item--edit-input'
                                            id={`screenEditInput-${idx}`}
                                        >
                                            <input

                                                id={`screenIdInput-${idx}`}
                                                type='text'
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    setNewName(e.target.value);
                                                }}
                                                defaultValue={item.name}
                                                onClick={(e) => {
                                                    e.stopPropagation();

                                                }}
                                                onBlur={(e)=>{
                                                    setNewName(e.target.value.trim());
                                                }}
                                            />
                                            <CheckOutlined
                                                className='bookmarks__list-item--icon'
                                                onClick={(e) => onRenameCompleted(e, item, idx)}
                                            />
                                            <CloseOutlined
                                                className='bookmarks__list-item--icon'
                                                onClick={(e) => onCloseCompleted(e, item, idx)}
                                            />
                                        </div>

                                        <span className='bookmarks__list-item--grid'>
                                            {item.gridType}
                                        </span>
                                        <div className='bookmarks__list-actions'>
                                            <EditOutlined
                                                className='bookmarks__list-icon'
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditMode(e, item, idx);
                                                }}
                                            />
                                            <CloseOutlined
                                                className='bookmarks__list-icon'
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteScreen(item, idx);
                                                }}
                                            />
                                            <StarFilled
                                                className={'bookmarks__list-icon ' + (item.defaultBookmark == 1 ? 'bookmarks__list-icon--active' : '')}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSetDefault(item, idx);
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                                {config.loading && config.hasMore && (
                                    <div className='demo-loading-container'>
                                        <Spin />
                                    </div>
                                )}
                            </InfiniteScroll>
                        </div>
                        <div className='bookmarks__list-info'>
                            {t('components.bookmark.display')} {currentRecordNumber}/{total} {t('components.bookmark.record')}
                        </div>
                    </div>
                    <Image width={40} src={nextIcon} preview={false} />
                    <div className='bookmarks__detail'>
                        <div className='bookmarks__container w-100 col-12'>
                            {dataGridPreview &&
                                dataGridPreview.map((item, index) => (
                                    <div
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