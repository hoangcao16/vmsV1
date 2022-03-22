import {
    Col,
    Input,
    Popconfirm,
    Row,
    Tooltip,
    Form,
    Button,
    Select,
    Modal,
} from "antd";
import { CloseOutlined } from '@ant-design/icons';
import { FiBookmark, FiDownload, FiFilm, FiImage } from "react-icons/fi";
import moment from "moment";
import { RiDeleteBinLine } from "react-icons/ri";
import React, { useState, useEffect } from "react";
import { AiOutlineCheck, AiOutlineClose, AiOutlineEdit } from "react-icons/all";
import debounce from "lodash/debounce";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import {
    filterOption,
    normalizeOptions,
} from "../../common/select/CustomSelect";
import DepartmentApi from "../../../actions/api/department/DepartmentApi";
import AIEventsApi from "../../../actions/api/ai-events/AIEventsApi";
import "./InfoObjectPopoverContent.scss";

const formItemLayout = {
    wrapperCol: { span: 24 },
    labelCol: { span: 24 },
};

const InfoObjectPopoverContent = (props) => {
    const { t } = useTranslation();
    const DATA_FAKE_UNIT = {
        departments: [{ name: "", uuid: "" }],
    };
    const typeObjects = [
        {
            id: "vehicle",
            name: `${t("view.ai_events.type_object.vehicle")}`,
        },
        {
            id: "human",
            name: `${t("view.ai_events.type_object.human")}`,
        },
        {
            id: "unknow",
            name: `${t("view.ai_events.type_object.unknow")}`,
        },
    ];

    const [form] = Form.useForm();
    const [currNode, setCurrNode] = useState(props.fileCurrent.note);
    const [editMode, setEditMode] = useState(false);
    const [typeObject, setTypeObject] = useState(props.fileCurrent.typeObject);
    const [departments, setDepartments] = useState([]);
    const [departmentId, setDepartmentId] = useState("");
    const [filterOptions, setFilterOptions] = useState(DATA_FAKE_UNIT);

    useEffect(() => {
        const data = {
            name: "",
        };
        DepartmentApi.getAllDepartment(data).then(setDepartments);
        fetchSelectOptions().then(setFilterOptions);
    }, []);

    const handleSubmit = async (value) => {
        const payload = {
            ...value,
            uuid: props.fileCurrent.uuid,
            cameraUuid: props.fileCurrent.cameraUuid,
            type: value.typeObject,
        };

        console.log("         props.fileCurrent        ", value);

        try {
            const isEdit = await AIEventsApi.editInforOfEvent(
                props.fileCurrent.uuid,
                payload
            );

            if (isEdit) {
                props.closeObjectForm();
                const notifyMess = {
                    type: "success",
                    title: "",
                    description: `${t("noti.successfully_edit_nvr")}`,
                };
                Notification(notifyMess);
            } else {
                const notifyMess = {
                    type: "error",
                    title: "",
                    description:
                        "Đã xảy ra lỗi trong quá trình chỉnh sửa, hãy kiểm tra lại",
                };
                Notification(notifyMess);
            }
        } catch (error) {
            // message.warning(
            //   'Đã xảy ra lỗi trong quá trình chỉnh sửa, hãy kiểm tra lại'
            // );
            console.log(error);
        }

        props.onClose();

        // setTimeout(() => {
        //   setIsModalVisible(false);
        //   handleShowModalEdit();
        // }, 500);
    };

    const onChangeSelectTypeObject = async (type) => {
        setTypeObject(type);

        // await resetDistrictAndWardData();
    };

    const onChangeDepId = async (uuid) => {
        setDepartmentId(uuid);
    };

    return (
        <>
            <Form
                className="bg-grey"
                form={form}
                {...formItemLayout}
                onFinish={handleSubmit}
                initialValues={props.fileCurrent}
            >
                <div className="form__title">
                  <span>{t("view.ai_events.info")} {t("view.ai_events." + props.fileCurrent.subEventType).toLowerCase()}</span>
                  <CloseOutlined className="icon__close" onClick={props.onClose} />
                </div>

                <Form.Item
                    label={t("view.ai_events.choose_obj")}
                    name={["typeObject"]}
                    className="form--item__css"
                >
                    <Select
                        dataSource={typeObjects}
                        onChange={(type) => onChangeSelectTypeObject(type)}
                        filterOption={filterOption}
                        options={normalizeOptions("name", "id", typeObjects)}
                        placeholder={t("view.ai_events.choose_obj")}
                    />
                </Form.Item>

                {typeObject && typeObject === "vehicle" ? (
                    <Form.Item
                        label={t("view.ai_events.plateNumber")}
                        name={["plateNumber"]}
                        rules={[]}
                        className="form--item__css"
                    >
                        <Input placeholder={t("view.ai_events.plateNumber")} />
                    </Form.Item>
                ) : null}

                {typeObject && typeObject === "human" ? (
                    <Form.Item
                        label={t("view.ai_events.code")}
                        name={["code"]}
                        rules={[]}
                        className="form--item__css"
                    >
                        <Input placeholder={t("view.ai_events.code")} />
                    </Form.Item>
                ) : null}
                {typeObject && typeObject === "human" ? (
                    <Form.Item
                        label={t("view.ai_events.name")}
                        name={["name"]}
                        rules={[]}
                        className="form--item__css"
                    >
                        <Input placeholder={t("view.ai_events.name")} />
                    </Form.Item>
                ) : null}
                {typeObject && typeObject === "human" ? (
                    <Form.Item
                        label={t("view.ai_events.position")}
                        name={["position"]}
                        rules={[]}
                        className="form--item__css"
                    >
                        <Input placeholder={t("view.ai_events.position")} />
                    </Form.Item>
                ) : null}
                {typeObject && typeObject === "human" ? (
                    <Form.Item
                        name={["departmentUuid"]}
                        label={t("view.ai_events.department")}
                        rules={[
                            {
                                required: true,
                                message: `${t("view.map.required_field")}`,
                            },
                        ]}
                        className="form--item__css"
                    >
                        <Select
                            showSearch
                            dataSource={departments}
                            onChange={(aDUnitId) => onChangeDepId(aDUnitId)}
                            filterOption={filterOption}
                            options={normalizeOptions(
                                "name",
                                "uuid",
                                departments
                            )}
                            placeholder={t("view.ai_events.department")}
                            allowClear
                        />
                    </Form.Item>
                ) : null}

                <Row className="row--submit" justify="end">
                    <Col className="gutter-row" span={4}>
                        <div className="cancel" style={{ marginTop: "20px", marginRight: "10px" }}>
                            <Button type="primary" ghost block onClick={props.onClose}>
                                {t("view.map.button_cancel")}
                            </Button>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={4}>
                        <div className="submit" style={{ marginTop: "20px", marginRight: "10px" }}>
                            <Button type="primary" htmlType="submit" block>
                                {t("view.map.button_save")}
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Form>
        </>
    );
};

function infoObjectPopoverContentPropsAreEqual(prevPopContent, nextPopContent) {
    return _.isEqual(prevPopContent.fileCurrent, nextPopContent.fileCurrent);
}

async function fetchSelectOptions() {
    const data = {
        name: "",
    };
    const departments = await DepartmentApi.getAllDepartment(data);
    console.log("ccccccccccc", departments);
    return {
        departments,
    };
}

export const MemoizedInfoObjectPopoverContent = React.memo(
    InfoObjectPopoverContent,
    infoObjectPopoverContentPropsAreEqual
);
