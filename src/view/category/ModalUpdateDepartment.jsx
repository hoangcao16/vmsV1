import { Button, Col, Form, Input, Modal, Row, Spin, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AdDivisionApi from "../../actions/api/advision/AdDivision";
import DepartmentApi from "../../actions/api/department/DepartmentApi";
import Notification from "../../components/vms/notification/Notification";
import { filterOption, normalizeOptions } from "../common/select/CustomSelect";
const formItemLayout = {
  wrapperCol: { span: 24 },
  labelCol: { span: 24 },
};
const initialValues = {
  key: "",
};
const ModalUpdateDepartment = (props) => {
  const DATA_FAKE_UNIT = {
    provinces: [{ name: "", uuid: "" }],
  };
  const { t } = useTranslation();
  let { setShowModal, selectedCategoryId } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState(null);
  const [administrativeUnits, setAdministrativeUnits] = useState([]);
  const [administrativeUnitUuid, setAdministrativeUnitUuid] = useState(
    department?.administrativeUnitUuid || null
  );
  const [filterOptions, setFilterOptions] = useState(DATA_FAKE_UNIT);

  useEffect(() => {
    const data = {
      name: "",
    };
    AdDivisionApi.getAllAdDivision(data).then(setAdministrativeUnits);
    fetchSelectOptions().then(setFilterOptions);
  }, []);

  useEffect(() => {
    const getDepartmentById = async () => {
      if (selectedCategoryId !== null) {
        const response = await DepartmentApi.getDepartmentByUuid(
          selectedCategoryId
        );
        if (response) {
          form.setFieldsValue({
            name: response.name,
            administrativeUnitUuid: response.administrativeUnitUuid,
          });
        }
      }
    };
    getDepartmentById();
  }, [selectedCategoryId]);
  const showMessage = (selectedCategoryId, response) => {
    const notifyMess = {
      type: "success",
      title: "",
      description: `${t("noti.successfully_add_tag_category", {
        add: t("add"),
      })}`,
    };
    if (selectedCategoryId) {
      notifyMess.description = response
        ? `${t("noti.successfully_update_dep_category")}`
        : `${t("noti.fail_update_dep_category")}`;
    } else {
      notifyMess.description = response
        ? `${t("noti.successfully_add_dep_category")}`
        : `${t("noti.fail_add_dep_category")}`;
    }
    Notification(notifyMess);
  };
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      let response;
      console.log("       values    ", values);
      if (selectedCategoryId) {
        response = await DepartmentApi.editDepartment(
          selectedCategoryId,
          values
        );
      } else {
        response = await DepartmentApi.addDepartment(values);
      }
      if (response) {
        setShowModal(false);
        showMessage(selectedCategoryId, response);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const onChangeADUnitId = async (ADUnitId) => {
    setAdministrativeUnitUuid(ADUnitId);
    // form.setFieldsValue({ districtId: null, wardId: null });
  };
  return (
    <>
      <Modal
        title={
          selectedCategoryId
            ? `${t("view.department.edit_department")}`
            : `${t("view.department.add_department")}`
        }
        visible={true}
        // onOk={handleSubmit}
        onCancel={() => {
          setShowModal(false);
        }}
        className="modal__update-tag modal__edit--category"
        footer={null}
      >
        <Spin tip="Loading..." spinning={loading}>
          <Form
            className="bg-grey"
            form={form}
            {...formItemLayout}
            onFinish={handleSubmit}
            initialValues={initialValues}
          >
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  label={t("view.department.name_department")}
                  name={["name"]}
                  rules={[
                    {
                      required: true,
                      message: `${t("view.map.required_field")}`,
                    },
                  ]}
                >
                  <Input
                    maxLength={255}
                    onBlur={(e) =>
                      form.setFieldsValue({
                        key: e.target.value.trim(),
                      })
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  name={["administrativeUnitUuid"]}
                  label={t("view.department.administrative")}
                  rules={[
                    {
                      required: true,
                      message: `${t("view.map.required_field")}`,
                    },
                  ]}
                >
                  <Select
                    showSearch
                    dataSource={administrativeUnits}
                    onChange={(aDUnitId) => onChangeADUnitId(aDUnitId)}
                    filterOption={filterOption}
                    options={normalizeOptions(
                      "name",
                      "uuid",
                      administrativeUnits
                    )}
                    placeholder={t("view.department.administrative")}
                    allowClear
                  />
                </Form.Item>
              </Col>
            </Row>
            <div className="footer__modal">
              <Button
                onClick={() => {
                  setShowModal(false);
                }}
              >
                {t("view.camera.close")}
              </Button>
              <Button htmlType="submit">{t("view.map.button_save")}</Button>
            </div>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};

async function fetchSelectOptions() {
  const data = {
    name: "",
  };
  const administrativeUnits = await AdDivisionApi.getAllAdDivision(data);
  console.log("ccccccccccc", administrativeUnits);
  return {
    administrativeUnits,
  };
}

export default ModalUpdateDepartment;
