import React, { useState, useEffect } from "react";
import Search from "../../../components/vms/search";
import { ChevronRight, ChevronLeft } from "react-feather";
import { Modal } from "antd";
import ItemControl from "./ItemControl";
// import { Modal, Button } from 'antd';
import ModalControlPanel from "./ModalControlPanel";
import Preset from "../../preset/Preset";
import "./ModalPresetSetting.scss";
import ptzControllerApi from '../../../api/ptz/ptzController'
import Notification from '../../../components/vms/notification/Notification'
import { NOTYFY_TYPE } from '../../common/vms/Constant'
import { useTranslation } from 'react-i18next';


const LIST_TYPES = {
    preset: 'preset',
    presetTour: 'presetTour',
    other: 'other'
}


const Index = ({
    setOpenMenuControl,
    isOpenModal,
    setCurrentMenuControl,
    slotId,
    idCamera,
    setReloadLiveMenuTool,
    reloadLiveMenuTool,
    isOpenModalControlPanel,
    setIsOpenModalControlPanel
}) => {
    const { t } = useTranslation();
    const CONTROL_TYPES = [
        {
            name: "Preset",
            type: 1,
            icon: <ChevronRight />,
        },
        {
            name: "Preset tour",
            type: 2,
            icon: <ChevronRight />,
        },
        {
            name: `${t('view.live.preset_setting')}`,
            type: 3,
        },
        { name: `${t('view.live.open_control_panel')}`, type: 4 },
    ];
    const [typeActive, setTypeActive] = useState(1);
    const [openModalControlPanel, setOpenModalControlPanel] = useState(false);
    const [openModalPresetSetting, setOpenModalPresetSetting] = useState(false);
    const [listType, setListType] = useState(LIST_TYPES.preset)
    const [presetTourLists, setPresetTourLists] = useState(null)
    const [presetLists, setPresetLists] = useState(null)
    const [recallPresetAndPresetTourList, setRecallPresetAndPresetTourList] = useState(false)
    const getAllPreset = async (params) => {
        if (idCamera) {
            const payload = await ptzControllerApi.getAllPreset(params);
            if (payload == null) {
                return
            }
            if (payload) {
                setPresetLists(payload.data)
            }
        }
    }
    const getAllPresetTour = async (params) => {
        if (idCamera) {
            const payload = await ptzControllerApi.getAllPresetTour(params);
            if (payload == null) {
                return
            }
            if (payload) {
                setPresetTourLists(payload.data)
            }
        }
    }
    //get preset data
    useEffect(() => {
        const params = {
            cameraUuid: idCamera,
        }
        getAllPreset(params)
        getAllPresetTour(params)
    }, [recallPresetAndPresetTourList])

    const onClickCallPreset = async (idPreset) => {
        const body = {
            cameraUuid: idCamera,
            idPreset: idPreset,
        };
        try {
            const isPost = await ptzControllerApi.postCallPreset(body);
        } catch (error) {
            const warnNotyfi = {
                type: NOTYFY_TYPE.warning,
                description: "Đã xảy ra lỗi",
                duration: 2,
            };
            Notification(warnNotyfi);
            console.log(error);
        }
    };

    const onClickCallPresetTour = async (idPresetTour) => {
        const body = {
            cameraUuid: idCamera,
            idPresetTour: idPresetTour,
        };
        try {
            const isPost = await ptzControllerApi.postCallPresetTour(body);
        } catch (error) {
            const warnNotyfi = {
                type: NOTYFY_TYPE.warning,
                description: "Đã xảy ra lỗi",
                duration: 2,
            };
            Notification(warnNotyfi);
            console.log(error);
        }
    };

    const handleSelectType = (type) => {
        setTypeActive(type);
        if (type === 4) {
            setIsOpenModalControlPanel(true);
            setOpenMenuControl(false);
            setCurrentMenuControl(slotId);
            setListType(LIST_TYPES.other)
        }
        if (type === 3) {
            setIsOpenModalControlPanel(false);
            setOpenModalPresetSetting(true);
            setOpenMenuControl(false);
            setListType(LIST_TYPES.other)
        }
        if (type === 2) {
            setListType(LIST_TYPES.presetTour)
        }
        if (type === 1) {
            setListType(LIST_TYPES.preset)
        }
    };

    const handleCloseModalControPanel = () => {
        setIsOpenModalControlPanel(false);
        setTypeActive(null);
    };
    const handleCloseModalPresetSetting = () => {
        setReloadLiveMenuTool(!reloadLiveMenuTool)
        setRecallPresetAndPresetTourList(!recallPresetAndPresetTourList);
        setOpenModalPresetSetting(false);
        setTypeActive(1);
        setListType(LIST_TYPES.preset)
    };

    // const handleCloseModal = () => {
    //   setOpenModalControlPanel(false);
    //   setTypeActive(null);
    // };
    const renderListPreset = () => {
        return presetLists?.map((item, index) =>
            <button className='menu-control-container__right__result__item' title={item.name}
                onClick={() => onClickCallPreset(item.idPreset)}>
                {item?.name}
            </button>
        )
    }

    const renderListPresetTour = () => {
        return presetTourLists?.map((item, index) =>
            <button className='menu-control-container__right__result__item ' title={item.name}
                onClick={() => onClickCallPresetTour(item.idPresetTour)}>
                {item?.name}
            </button>
        )
    }

    return (
        <>
            <div className='menu-control-container'>
                <div className='menu-control-container__left'>
                    <div className='menu-control-container__left__back'></div>
                    {CONTROL_TYPES.map((item, _) => {
                        return (
                            <ItemControl
                                typeActive={typeActive}
                                item={item}
                                onSelectType={handleSelectType}
                                key={item.type}
                            />
                        );
                    })}
                </div>
                <div className='menu-control-container__right'>
                    <div className='menu-control-container__right__search'>
                        <Search />
                    </div>
                    <div className='menu-control-container__right__result'>
                        {listType === LIST_TYPES.preset ? renderListPreset() :
                            listType === LIST_TYPES.presetTour ? renderListPresetTour() : ''}
                    </div>
                </div>
            </div>
            {isOpenModal && (
                <ModalControlPanel
                    isOpen={isOpenModalControlPanel}
                    onCloseModal={handleCloseModalControPanel}
                    idCamera={idCamera}
                />
            )}
            {/* {openModalPresetSetting && isOpenModal && ( */}
            <Modal
                wrapClassName='preset--setting'
                visible={openModalPresetSetting}
                title={t('view.live.preset_setting')}
                footer={null}
                closable={true}
                onCancel={handleCloseModalPresetSetting}
                destroyOnClose={true}
                maskStyle={{ background: 'rgba(51, 51, 51, 0.9)' }}
            >
                <Preset idCamera={idCamera} />
            </Modal>
            {/* )} */}
        </>
    );
}
    ;

export default Index;