import React, {useEffect, useState} from "react";

import {
    Button,
    Col,
    Form,
    Input,
    Row,
    Select,
    Upload,
    message,
    Space,
} from "antd";
import AddressApi from "../../../actions/api/address/AddressApi";
import AdDivisionApi from "../../../actions/api/advision/AdDivision";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import cameraTypeApi from "../../../api/controller-api/cameraTypeApi";
import vendorApi from "../../../api/controller-api/vendorApi";
import {AdministrativeUnitType} from "../../../@core/common/common";
import {
    filterOption,
    normalizeOptions,
} from "../../common/select/CustomSelect";
import zoneApi from "../../../api/controller-api/zoneApi";
import validator from 'validator';
import Notification from "../../../components/vms/notification/Notification";
import useHandleUploadFile from "../../../hooks/useHandleUploadFile";
import { useTranslation } from 'react-i18next';

const {Dragger} = Upload;
async function fetchSelectOptions() {
    const provinces = await AddressApi.getAllProvinces();
    const zones = await zoneApi.getAll();
    const adDivisions = await AdDivisionApi.getAllAdDivision();
    const cameraTypes = await cameraTypeApi.getAll()
    const vendors = await vendorApi.getAll()
    return {
        provinces,
        zones,
        adDivisions,
        cameraTypes,
        vendors,
    };
}

const MapAdministrativeUnitAdd = (props) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [imgFile, setImgFile] = useState('');
    const [isCollapsedCameraForm, setIsCollapsedCameraForm] = useState(false);
    const [imageUrl,imgFileName, loading, handleChange, uploadImage, beforeUpload] = useHandleUploadFile(imgFile);
    const {initialLatLgn, editAdminisUnit, handleSubmitCallback, selectNewPosition} = props;
    
    useEffect(() => {
        if (editAdminisUnit != null) {
            console.log('set editAdminisUnit:long_, lat_', editAdminisUnit.lng, editAdminisUnit.lat)
            setProvinceId(editAdminisUnit.provinceId)
            form.setFieldsValue({
                uuid: editAdminisUnit.uuid,
                name: editAdminisUnit.name,
                long_: editAdminisUnit.long_,
                lat_: editAdminisUnit.lat_,
                address: editAdminisUnit.address,
                provinceId: editAdminisUnit.provinceId,
                districtId: editAdminisUnit.districtId,
                wardId: editAdminisUnit.wardId,
                tel: editAdminisUnit.tel,
            })
            if (selectNewPosition) {
                form.setFieldsValue({
                    long_: initialLatLgn[0],
                    lat_: initialLatLgn[1],
                })
            }

        } else {
            if (selectNewPosition) {
                console.log('set initialLatLgn:')
                form.setFieldsValue({
                    long_: initialLatLgn[0],
                    lat_: initialLatLgn[1],
                })
            }
        }
        setImgFile(editAdminisUnit?.avatarFileName)
    }, [editAdminisUnit, form, initialLatLgn[0], initialLatLgn[1], selectNewPosition])


    const toggleCollapsedCameraForm = () => {
        setIsCollapsedCameraForm(isCollapsedCameraForm ? false : true);
    };



    const [filterOptions, setFilterOptions] = useState({});

    const [provinceId, setProvinceId] = useState(null);

    const [districts, setDistrict] = useState([]);

    const [districtId, setDistrictId] = useState(null);

    const [wards, setWard] = useState([]);

    useEffect(() => {
        fetchSelectOptions().then(setFilterOptions);
    }, []);

    useEffect(() => {
        console.log("form", form)
    }, [form])

    useEffect(() => {
        console.log('useEffect:provinceId changed', provinceId)
        setDistrict([]);
        if (provinceId) {
            AddressApi.getDistrictByProvinceId(provinceId).then(setDistrict);
        }
        if (editAdminisUnit && editAdminisUnit.districtId) {
            AddressApi.getWardByDistrictId(editAdminisUnit.districtId).then(setWard);
        }
    }, [editAdminisUnit, provinceId]);

    useEffect(() => {
        console.log('useEffect:districtId changed', provinceId)
        setWard([]);
        if (districtId) {
            AddressApi.getWardByDistrictId(districtId).then(setWard);
        }
    }, [districtId, provinceId]);

    const {provinces} = filterOptions;

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
        handleSubmitCallback(payload, AdministrativeUnitType)

    };

    const onReset = () => {
        form.resetFields();
    };

    const onTelChange = (rule, value, callback) => {
        const tel = form.getFieldValue('tel')
        console.log('onTelChange:', tel)
        const isValidPhoneNumber = validator.isMobilePhone(tel)
        if (!isValidPhoneNumber) {
            callback(t('view.map.invalid_phone_number'))
        } else {
            callback()
        }
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
                fields={[]}
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
                            label={t('view.map.unit_name')}
                            rules={[{required: true, message: t('view.map.required_field')}]}
                        >
                            <Input placeholder={t('view.map.please_enter_unit_name', { plsEnter: t('please_enter')})}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={12} className="camera-form-inner__item">
                    <Col span={24}>
                        <Form.Item
                            name={["address"]}
                            label={t('view.map.address')}
                        >
                            <Input placeholder={t('view.map.please_enter_your_address', { plsEnter: t('please_enter')})}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={12}>
                    <Col span={24}>
                        <Form.Item
                            label={t('view.map.phone_number')}
                            name={["tel"]}
                            rules={[{validator: onTelChange}]}
                        >
                            <Input placeholder={t('view.map.please_enter_your_phone_number',{ plsEnter: t('please_enter') })}></Input>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={12}>
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
                                placeholder={t('view.map.longitude')}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={t('view.map.latitude')} name={["lat_"]}>
                            <Input
                                placeholder={t('view.map.latitude')} 
                            />
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
                        <Button className="submit__button submit__button--cancel" htmlType="button" ghost
                                onClick={onReset}>{t('view.map.button_cancel')}</Button>
                        <Button className="submit__button" type="primary" htmlType="submit ">
                        {t('view.map.button_save')}
                        </Button>
                    </Space>
                </div>
            </Form>
        </div>
    );
};

export default MapAdministrativeUnitAdd;