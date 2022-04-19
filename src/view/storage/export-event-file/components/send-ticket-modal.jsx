/* eslint-disable no-useless-escape */
import {
  StyledSendTicketModal,
  SendTicketModalHeader,
  StyledOutSideSelect,
  StyledEmailInput,
  ErrorMessage,
} from "./style";
import { Row, Col, Radio, Button } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
const OutSideSystemOptions = [
  {
    label: "Đội CSGT số 1",
    value: 1,
  },
  {
    label: "Đội CSGT số 2",
    value: 2,
  },
  {
    label: "Đội CSGT số 3",
    value: 3,
  },
];
const defaultValues = {
  email: "",
};
const SendTicketModal = ({
  sendModalVisible,
  handleSendTicket,
  handleCancelSend,
  resetForm,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(1);
  const hanldeTabs = (e) => {
    setActiveTab(e.target.value);
  };
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: defaultValues });
  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetForm]);
  return (
    <>
      <StyledSendTicketModal
        visible={sendModalVisible}
        // onOk={handleSendTicket}
        width={520}
        title={<Header />}
        centered={true}
        onCancel={handleCancelSend}
        footer={null}
      >
        <form onSubmit={handleSubmit(handleSendTicket)}>
          <Row>
            <Col span={6}>
              <span>{t("view.penalty_ticket.recipients")}</span>
            </Col>
            <Col span={17} offset={1}>
              <Row>
                <Radio.Group
                  name="radiogroup"
                  defaultValue={1}
                  onChange={hanldeTabs}
                >
                  <Radio value={1}>
                    {t("view.penalty_ticket.outside-the-system")}
                  </Radio>
                  <Radio value={2}>{t("view.penalty_ticket.leader")}</Radio>
                </Radio.Group>
              </Row>
              <Row>
                <Col span={24} className="email-content">
                  {activeTab === 1 ? (
                    <StyledOutSideSelect
                      options={OutSideSystemOptions}
                      className="react-select"
                      classNamePrefix="select-outside-system"
                      placeholder={t("view.penalty_ticket.select-recipients")}
                    />
                  ) : (
                    <Controller
                      name="email"
                      rules={{
                        // pattern: {
                        //   value:
                        //     /^([a-zA-Z0-9]+([\._-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+([\_-]?[a-zA-Z0-9]+)*(\.[a-zA-Z]{2,4}){1,2})+(\s*[,]\s*([a-zA-Z0-9]+([\._-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+([\_-]?[a-zA-Z0-9]+)*(\.[a-zA-Z]{2,4}){1,2})+)*$/,
                        //   message: t("view.penalty_ticket.validate-email"),
                        // },
                        pattern: {
                          value:
                            /^(([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}){1,25})+(\s*[,.]\s*(([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}){1,25})+)*$/,
                          message: t("view.penalty_ticket.validate-email"),
                        },
                        required: t("view.penalty_ticket.require-email"),
                      }}
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <>
                          <StyledEmailInput
                            autoSize={true}
                            maxLength={100}
                            onChange={(e) => onChange(e.target.value?.trim())}
                            value={value}
                            placeholder={t("view.penalty_ticket.email-addr")}
                            data-type={errors?.email ? "error" : "normal"}
                          />
                          <ErrorMessage>{errors.email?.message}</ErrorMessage>
                        </>
                      )}
                    />
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="ant-modal-footer">
            <Col offset={12} span={12}>
              <Button type="primary" htmlType="submit">
                {t("view.penalty_ticket.send_ticket")}
              </Button>
              <Button onClick={handleCancelSend}>
                {t("view.camera.close")}
              </Button>
            </Col>
          </Row>
        </form>
      </StyledSendTicketModal>
    </>
  );
};
export default SendTicketModal;
const Header = () => {
  const { t } = useTranslation();
  return (
    <SendTicketModalHeader>
      {t("view.penalty_ticket.send-a-ticket")}
    </SendTicketModalHeader>
  );
};
