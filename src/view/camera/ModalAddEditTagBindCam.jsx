import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Form, Modal, Row } from "antd";
import _ from 'lodash';
import React, { useEffect, useState } from "react";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import TagApi from "../../actions/api/tag";
import { CustomSelect } from "../common/select/CustomSelect";
import "./ModalAddEditTagBindCam.scss";
const formItemLayout = {
  wrapperCol: { span: 24 },
  labelCol: { span: 24 },
};

const ModalAddEditTagBindCam = (props) => {
  const { tags = [], setShowModal, showModal, handleSubmit, camId } = props;
  const [formValue, setFormValue] = useState({ tags });
  const [keyOptions, setKeyOptions] = useState([]);
  const [form] = Form.useForm();


  useEffect(() => {
    (async () => {
      try {
        const response = await TagApi.getAllTags();
        if (response) {
          setKeyOptions(response);
        }
      } catch (error) {}
    })();
  }, []);

  const handleChangeKey = (value, key) => {
    const { tags } = formValue;
    Object.assign(tags[key], { key: value });
    setFormValue({tags});
  };

  const handleDisable = () => {
    const { tags } = formValue;
    let disable = false;
      for(let i = 0 ; i < tags.length; i++) {
        if(!tags[i].key || !tags[i].value.length) {
            disable = true;
            break;
        }
      }
    return disable;
  };

  return (
    <>
      <Modal
        title={camId ? "Sửa tag" : "Thêm mới tag"}
        visible={showModal}
        onCancel={() => {
          setShowModal(false);
        }}
        className="modal__update-tag modal__edit--category"
        footer={null}
        destroyOnClose={true}
      >
        <Form
          className="bg-grey"
          form={form}
          {...formItemLayout}
          onFinish={handleSubmit}
          initialValues={formValue}
        >
          <Form.List name="tags">
            {(fields, { add, remove }) => (
              <Row gutter={[24, 16]}>
                {fields.length > 0 &&
                  fields?.map(({ key, name, fieldKey, ...restField }) => (
                    <React.Fragment key={key}>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "key"]}
                          fieldKey={[fieldKey, "key"]}
                          rules={[
                            {
                              required: true,
                              message: "Trường này là bắt buộc.",
                            },
                          ]}
                        >
                          <CustomSelect
                            dataSource={keyOptions}
                            labelField="key"
                            valueField="key"
                            onChange={(value) => {
                              handleChangeKey(value, key);
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={14}>
                        <Form.Item
                          {...restField}
                          name={[name, "value"]}
                          fieldKey={[fieldKey, "value"]}
                          className="tag-input-item"
                          rules={[
                            {
                              required: true,
                              message: "Trường này là bắt buộc.",
                            },
                          ]}
                        >
                          <TagsInput onlyUnique onChange={(value) => {
                              const { tags } = _.cloneDeep(formValue);
                                tags[key].value = value;
                                setFormValue({tags});
                          }}/>  
                        </Form.Item>
                      </Col>
                      <Col
                        span={2}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <MinusCircleOutlined
                          onClick={() => {
                            remove(name);
                            const { tags } = _.cloneDeep(formValue);
                            tags.splice(key, 1);
                            setFormValue({tags});
                          }}
                        />
                      </Col>
                    </React.Fragment>
                  ))}
                <Col offset={6}>
                  <Form.Item>
                    <Button
                      className="btn-add-tag"
                      type="default"
                      onClick={() => {
                        add({
                          key: "",
                          value: [],
                        });
                        setFormValue({
                          tags: [
                            ...formValue?.tags,
                            {
                              key: "",
                              value: [],
                            },
                          ],
                        });
                      }}
                      block
                      icon={<PlusOutlined />}
                      disabled={handleDisable()}
                    >
                      Add new tag
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            )}
          </Form.List>
          <div className="footer__modal">
            <Button
              onClick={() => {
                setShowModal(false);
              }}
            >
              Đóng
            </Button>
            <Button htmlType="submit">Lưu</Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default ModalAddEditTagBindCam;