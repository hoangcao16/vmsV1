import React, {useEffect, useState} from "react";
import { v4 as uuidV4 } from 'uuid';
import {
    Button,
    Col,
    Form,
    Input,
    Row,
    Select,
    Upload,
    Space,
} from "antd";
import AddressApi from "../../../actions/api/address/AddressApi";
import AdDivisionApi from "../../../actions/api/advision/AdDivision";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import cameraTypeApi from "../../../api/controller-api/cameraTypeApi";
import vendorApi from "../../../api/controller-api/vendorApi";
import {
    filterOption,
    normalizeOptions,
} from "../../common/select/CustomSelect";
import zoneApi from "../../../api/controller-api/zoneApi";
import Notification from "../../../components/vms/notification/Notification";
import ExportEventFileApi from "../../../actions/api/exporteventfile/ExportEventFileApi";
import useHandleUploadFile from "../../../hooks/useHandleUploadFile";
import { useTranslation } from 'react-i18next';

const {Dragger} = Upload;

async function fetchSelectOptions() {
    const provinces = await AddressApi.getAllProvinces();
    const zones = await zoneApi.getAll();
    const adDivisions = await AdDivisionApi.getAllAdDivision();
    const cameraTypes = await cameraTypeApi.getAll()
    const vendors = await vendorApi.getAll()
    console.log('fetchSelectOptions:zones:', zones)
    return {
        provinces,
        zones,
        adDivisions,
        cameraTypes,
        vendors,
    };
}

const MapCameraAdd = (props) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [isCollapsedCameraForm, setIsCollapsedCameraForm] = useState(false);
    const {initialLatLgn, editCam, handleSubmitCallback, selectNewPosition, isEditForm} = props;
    const [imgFile, setImgFile] = useState('');

    const [filterOptions, setFilterOptions] = useState({});

    const [provinceId, setProvinceId] = useState(null);

    const [districts, setDistrict] = useState([]);

    const [districtId, setDistrictId] = useState(null);

    const [wards, setWard] = useState([]);
    const [imageUrl,imgFileName, loading, handleChange, uploadImage, beforeUpload] = useHandleUploadFile(imgFile);
    useEffect((e) => {
        console.log('editCam:', editCam, selectNewPosition)
        if (editCam) {
            console.log('set editCam:long_, lat_', editCam.long_, editCam.lat_)
            setProvinceId(editCam.provinceId)
            form.setFieldsValue({
                uuid: editCam.uuid,
                id: editCam.id,
                name: editCam.name,
                long_: editCam.long_,
                lat_: editCam.lat_,
                code: editCam.code,
                cameraTypeUuid: editCam.cameraTypeUuid,
                vendorUuid: editCam.vendorUuid,
                address: editCam.address,
                provinceId: editCam.provinceId,
                districtId: editCam.districtId,
                wardId: editCam.wardId,
                port: editCam.port,
                ip: editCam.ip,
                zoneUuid: editCam.zoneUuid,
                zoneName: editCam.zoneName,
                cameraUrl: editCam.cameraUrl,
                administrativeUnitUuid: editCam.administrativeUnitUuid,
            })
            if (selectNewPosition) {
                form.setFieldsValue({
                    long_: initialLatLgn[0],
                    lat_: initialLatLgn[1],
                })
            }

        } else {
            form.setFieldsValue({
                uuid: '',
                id: '',
                name: '',
                code: '',
                cameraTypeUuid: '',
                vendorUuid: null,
                address: '',
                provinceId: null,
                districtId: null,
                wardId: null,
                port: null,
                ip: '',
                zoneUuid: null,
                long_: null,
                lat_:null,
                cameraUrl: '',
                administrativeUnitUuid: null,
            })
            if (selectNewPosition) {
                console.log('set initialLatLgn:')
                form.setFieldsValue({
                    long_: initialLatLgn[0],
                    lat_: initialLatLgn[1],
                })
            }
        }

        setImgFile(editCam?.avatarFileName)

    }, [editCam, form, initialLatLgn[0], initialLatLgn[1], selectNewPosition])


    const toggleCollapsedCameraForm = () => {
        setIsCollapsedCameraForm(isCollapsedCameraForm ? false : true);
    };

    useEffect(() => {
        fetchSelectOptions().then(setFilterOptions);
    }, []);

    useEffect(() => {
        console.log('useEffect:provinceId changed', provinceId)
        setDistrict([]);
        if (provinceId) {
            AddressApi.getDistrictByProvinceId(provinceId).then(setDistrict);
        }
        if (editCam && editCam.districtId) {
            AddressApi.getWardByDistrictId(editCam.districtId).then(setWard);
        }
    }, [editCam, provinceId]);

    useEffect(() => {
        console.log('useEffect:districtId changed', provinceId)
        setWard([]);
        if (districtId) {
            AddressApi.getWardByDistrictId(districtId).then(setWard);
        }
    }, [districtId, provinceId]);

    const {provinces, zones, vendors, cameraTypes, adDivisions} = filterOptions;

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined/> : <PlusOutlined/>}
            <div style={{marginTop: 8}}>{t('view.map.add_image')}</div>
        </div>
    );

    const onChangeCity = async (cityId) => {
        setProvinceId(cityId);

        await resetDistrictAndWardData();
    };

    function resetDistrictAndWardData() {
        form.setFieldsValue({districtId: null, wardId: null});
    }

    const onChangeDistrict = async (districtId) => {
        setDistrictId(districtId);
        await resetWardData();
    };

    function resetWardData() {
        form.setFieldsValue({wardId: null});
    }

    const handleSubmit = async (value) => {
        const payload = {
            ...value,
            avatarFileName: imgFileName
        };
        handleSubmitCallback(payload)
    };

    const onReset = () => {
        form.resetFields();
    };

    return (
        <div
            className={
                "camera-form position-absolute d-flex flex-column" +
                (isCollapsedCameraForm ? " collapsed" : "")
            }
        >
            <a className="toggle-collapse" onClick={toggleCollapsedCameraForm}/>
            <Form
                className="camera-form-inner"
                layout="vertical"
                form={form}
                fields={[
                ]}
                onFinish={handleSubmit}
            >
                <Row gutter={12}>
                    <Col span={24} className="pb-1">
                        <Dragger
                            name="avatar"
                            listType="picture-card"
                            className="camera-image"
                            showUploadList={false}
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                            customRequest={uploadImage}
                        >
                            {imageUrl ? (
                                <img src={imageUrl} alt="avatar" style={{width: "100%"}}/>
                            ) : (
                                uploadButton
                            )}
                        </Dragger>
                    </Col>
                    <Col span={24} hidden={true}>
                        <Form.Item
                            name={["uuid"]}
                        >
                            <Input placeholder="uuid"/>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name={["name"]}
                            label={t('view.map.camera_name', { cam : t('camera') })}
                            rules={[{required: true, message: t('view.map.required_field')}]}
                        >
                            <Input placeholder={t('view.map.please_enter_camera_name', { plsEnter: t('please_enter'), cam: t('camera') })}/>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name={["code"]}
                            label={t('view.map.camera_id', { cam : t('camera') })}
                            rules={[{required: true, message: t('view.map.required_field')}]}
                        >
                            <Input placeholder={t('view.map.please_enter_camera_id', { plsEnter: t('please_enter'), cam: t('camera') })} value={editCam?.name}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="cameraTypeUuid"
                            label={t('view.map.camera_type', { cam: t('camera') })}
                            rules={[{required: true, message: t('view.map.required_field')}]}
                        >
                            <Select
                                dataSource={cameraTypes || []}
                                filterOption={filterOption}
                                options={normalizeOptions("name", "uuid", cameraTypes || [])}
                                placeholder={t('view.map.please_choose_camera_type', { cam: t('camera') })}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={12}>
                    <Col span={24}>
                        <Form.Item name="vendorUuid" label={t('view.map.vendor')}>
                            <Select
                                dataSource={vendors || []}
                                filterOption={filterOption}
                                options={normalizeOptions("name", "uuid", vendors || [])}
                                placeholder={t('view.map.please_enter_name_vendor', { plsEnter: t('please_enter') })}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label={t('view.map.administrative_unit')}
                            name="administrativeUnitUuid"
                        >
                            <Select
                                dataSource={adDivisions || []}
                                filterOption={filterOption}
                                options={normalizeOptions("name", "uuid", adDivisions || [])}
                                placeholder={t('view.map.please_choose_administrative_unit')}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            label={t('view.map.location')}
                            name={["address"]}
                            rules={[{required: true, message: t('view.map.required_field')}]}
                        >
                            <Input placeholder={t('view.map.please_choose_location')}/>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name={["provinceId"]}
                            label={t('view.map.province_id')}
                            rules={[{required: true, message: t('view.map.required_field')}]}
                        >
                            <Select
                                dataSource={provinces || []}
                                onChange={(cityId) => onChangeCity(cityId)}
                                filterOption={filterOption}
                                options={normalizeOptions("name", "provinceId", provinces || [])}
                                placeholder={t('view.map.province_id')}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name={["districtId"]}
                            label={t('view.map.district_id')}
                            rules={[{required: true, message: t('view.map.required_field')}]}
                        >
                            <Select
                                dataSource={districts}
                                onChange={(districtId) => onChangeDistrict(districtId)}
                                filterOption={filterOption}
                                options={normalizeOptions("name", "districtId", districts || [])}
                                placeholder={t('view.map.district_id')}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={12}>
                    <Col span={12}>
                        <Form.Item
                            name={["wardId"]}
                            label={t('view.map.ward_id')}
                            rules={[{required: true, message: t('view.map.required_field')}]}
                        >
                            <Select
                                dataSource={wards}
                                filterOption={filterOption}
                                options={normalizeOptions("name", "id", wards || [])}
                                placeholder={t('view.map.ward_id')}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={12}>
                    <Col span={12}>
                        <Form.Item label={t('view.map.longitude')} name={["long_"]}>
                            <Input
                                placeholder={t('view.map.please_enter_latitude', { pleEnter: t('please_enter') })}
                                // defaultValue={initialLatLgn.lng}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={t('view.map.latitude')} name={["lat_"]}>
                            <Input
                                placeholder={t('view.map.please_enter_latitude', { pleEnter: t('please_enter') })}
                                // defaultValue={initialLatLgn.lat}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            label={(t('view.map.port'))}
                            name={["port"]}
                            rules={[{required: true, message: t('view.map.required_field')}]}
                        >
                            <Input placeholder={t('view.map.please_enter_port', { plsEnter: t('please_enter') })}></Input>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label={(t('view.map.zone'))}
                            name={["zoneUuid"]}
                            rules={[{required: true, message: t('view.map.required_field')}]}
                        >
                            <Select
                                dataSource={zones}
                                showSearch
                                allowClear
                                filterOption={filterOption}
                                options={normalizeOptions("name", "uuid", zones || [])}
                                placeholder={t('view.map.please_enter_zone', { plsEnter: t('please_enter') })}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="IP"
                            name={["ip"]}
                            rules={[{required: true, message: t('view.map.required_field')}]}
                        >
                            <Input placeholder={t('view.map.please_enter_ip', { plsEnter: t('please_enter') })}/>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label={t('view.map.original_url')}
                            name={["cameraUrl"]}
                            rules={[{required: true, message: t('view.map.required_field')}]}
                        >
                            <Input disabled={isEditForm} placeholder={t('view.map.please_enter_original_url', { plsEnter: t('please_enter') })}/>
                        </Form.Item>
                    </Col>
                </Row>

                <div
                    className="submit"
                    style={{
                        textAlign: "center",
                    }}
                >
                    <Space>
                        <Button htmlType="button" ghost onClick={onReset}>{t('view.map.button_cancel')}</Button>
                        <Button type="primary" htmlType="submit ">{t('view.map.button_save')}</Button>
                    </Space>
                </div>
            </Form>
        </div>
    );
};

export default MapCameraAdd;
